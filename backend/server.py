from fastapi import FastAPI, APIRouter, WebSocket, WebSocketDisconnect
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime
import json
import asyncio
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# WebSocket connection manager for multiplayer
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.game_rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str = None):
        await websocket.accept()
        self.active_connections.append(websocket)
        if room_id:
            if room_id not in self.game_rooms:
                self.game_rooms[room_id] = []
            self.game_rooms[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str = None):
        self.active_connections.remove(websocket)
        if room_id and room_id in self.game_rooms:
            self.game_rooms[room_id].remove(websocket)
            if not self.game_rooms[room_id]:
                del self.game_rooms[room_id]

    async def broadcast_to_room(self, message: str, room_id: str):
        if room_id in self.game_rooms:
            for connection in self.game_rooms[room_id]:
                try:
                    await connection.send_text(message)
                except:
                    pass

manager = ConnectionManager()

# Game Models
class Position(BaseModel):
    x: int
    y: int

class GameState(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_id: str
    player_name: str
    snake: List[Position]
    food: Position
    power_ups: List[Dict[str, Any]] = Field(default_factory=list)
    score: int = 0
    game_mode: str = "classic"
    is_active: bool = True
    speed: int = 150
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class MoveRequest(BaseModel):
    game_id: str
    direction: str  # "up", "down", "left", "right"

class GameStartRequest(BaseModel):
    player_name: str
    game_mode: str = "classic"

class ScoreEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    player_name: str
    score: int
    game_mode: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class MultiplayerRoom(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    players: List[Dict[str, Any]] = Field(default_factory=list)
    max_players: int = 4
    is_active: bool = True
    game_state: Optional[Dict[str, Any]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Game Logic Functions
def generate_food_position(snake: List[Position], board_size: int = 20) -> Position:
    """Generate random food position that doesn't collide with snake"""
    while True:
        food = Position(
            x=random.randint(0, board_size - 1),
            y=random.randint(0, board_size - 1)
        )
        # Check if food position collides with any snake segment
        collision = False
        for segment in snake:
            if food.x == segment.x and food.y == segment.y:
                collision = True
                break
        if not collision:
            return food

def check_collision(head: Position, snake_body: List[Position], board_size: int = 20) -> bool:
    """Check if snake head collides with walls or itself"""
    # Check wall collision
    if head.x < 0 or head.x >= board_size or head.y < 0 or head.y >= board_size:
        return True
    
    # Check self collision - compare position coordinates
    for segment in snake_body[1:]:  # Exclude head itself
        if head.x == segment.x and head.y == segment.y:
            return True
    
    return False

def move_snake(snake: List[Position], direction: str, ate_food: bool = False) -> List[Position]:
    """Move snake in given direction"""
    head = snake[0]
    
    # Calculate new head position
    if direction == "up":
        new_head = Position(x=head.x, y=head.y - 1)
    elif direction == "down":
        new_head = Position(x=head.x, y=head.y + 1)
    elif direction == "left":
        new_head = Position(x=head.x - 1, y=head.y)
    elif direction == "right":
        new_head = Position(x=head.x + 1, y=head.y)
    else:
        return snake
    
    # Add new head
    new_snake = [new_head] + snake
    
    # Remove tail unless food was eaten
    if not ate_food:
        new_snake = new_snake[:-1]
    
    return new_snake

def generate_power_up(snake: List[Position], food: Position, board_size: int = 20) -> Dict[str, Any]:
    """Generate random power-up"""
    power_up_types = ["speed_boost", "double_points", "invincibility"]
    
    while True:
        position = Position(
            x=random.randint(0, board_size - 1),
            y=random.randint(0, board_size - 1)
        )
        if position not in snake and position != food:
            return {
                "type": random.choice(power_up_types),
                "position": position.dict(),
                "duration": 5000,  # 5 seconds
                "id": str(uuid.uuid4())
            }

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Snake Game API Ready!"}

@api_router.post("/game/start", response_model=GameState)
async def start_game(request: GameStartRequest):
    """Start a new game session"""
    # Initialize snake in center of board
    initial_snake = [
        Position(x=10, y=10),
        Position(x=10, y=11),
        Position(x=10, y=12)
    ]
    
    # Generate initial food
    food = generate_food_position(initial_snake)
    
    game_state = GameState(
        player_id=str(uuid.uuid4()),
        player_name=request.player_name,
        snake=initial_snake,
        food=food,
        game_mode=request.game_mode,
        speed=150 if request.game_mode == "classic" else 100
    )
    
    # Save to database
    await db.games.insert_one(game_state.dict())
    
    return game_state

@api_router.post("/game/move")
async def move_snake_api(request: MoveRequest):
    """Process snake movement"""
    # Get current game state
    game = await db.games.find_one({"id": request.game_id})
    if not game or not game["is_active"]:
        return {"error": "Game not found or not active"}
    
    game_state = GameState(**game)
    
    # Move snake
    ate_food = False
    new_snake = move_snake(game_state.snake, request.direction)
    
    # Check collision
    if check_collision(new_snake[0], new_snake):
        # Game over
        game_state.is_active = False
        await db.games.update_one(
            {"id": request.game_id},
            {"$set": {"is_active": False, "last_updated": datetime.utcnow()}}
        )
        
        # Save score to leaderboard
        score_entry = ScoreEntry(
            player_name=game_state.player_name,
            score=game_state.score,
            game_mode=game_state.game_mode
        )
        await db.leaderboard.insert_one(score_entry.dict())
        
        return {"game_over": True, "final_score": game_state.score}
    
    # Check if food eaten
    if new_snake[0].x == game_state.food.x and new_snake[0].y == game_state.food.y:
        ate_food = True
        game_state.score += 10
        if game_state.game_mode == "speed":
            game_state.score += 5  # Bonus points in speed mode
        
        # Generate new food
        game_state.food = generate_food_position(new_snake)
        
        # Chance to spawn power-up
        if random.random() < 0.3:  # 30% chance
            power_up = generate_power_up(new_snake, game_state.food)
            game_state.power_ups.append(power_up)
    
    # Update snake position
    game_state.snake = new_snake
    game_state.last_updated = datetime.utcnow()
    
    # Increase speed slightly in speed mode
    if game_state.game_mode == "speed" and game_state.score % 50 == 0:
        game_state.speed = max(50, game_state.speed - 10)
    
    # Update database
    await db.games.update_one(
        {"id": request.game_id},
        {"$set": game_state.dict()}
    )
    
    return {
        "snake": [pos.dict() for pos in game_state.snake],
        "food": game_state.food.dict(),
        "power_ups": game_state.power_ups,
        "score": game_state.score,
        "speed": game_state.speed,
        "is_active": game_state.is_active
    }

@api_router.get("/game/{game_id}")
async def get_game_state(game_id: str):
    """Get current game state"""
    game = await db.games.find_one({"id": game_id})
    if not game:
        return {"error": "Game not found"}
    
    return GameState(**game)

@api_router.get("/leaderboard", response_model=List[ScoreEntry])
async def get_leaderboard(game_mode: str = "classic", limit: int = 10):
    """Get top scores"""
    scores = await db.leaderboard.find(
        {"game_mode": game_mode}
    ).sort("score", -1).limit(limit).to_list(limit)
    
    return [ScoreEntry(**score) for score in scores]

@api_router.post("/multiplayer/create-room", response_model=MultiplayerRoom)
async def create_multiplayer_room(room_name: str, max_players: int = 4):
    """Create a new multiplayer room"""
    room = MultiplayerRoom(
        name=room_name,
        max_players=max_players
    )
    
    await db.multiplayer_rooms.insert_one(room.dict())
    return room

@api_router.get("/multiplayer/rooms", response_model=List[MultiplayerRoom])
async def get_multiplayer_rooms():
    """Get available multiplayer rooms"""
    rooms = await db.multiplayer_rooms.find(
        {"is_active": True}
    ).to_list(50)
    
    return [MultiplayerRoom(**room) for room in rooms]

@api_router.post("/multiplayer/join-room/{room_id}")
async def join_multiplayer_room(room_id: str, player_name: str):
    """Join a multiplayer room"""
    room = await db.multiplayer_rooms.find_one({"id": room_id})
    if not room:
        return {"error": "Room not found"}
    
    room_obj = MultiplayerRoom(**room)
    
    if len(room_obj.players) >= room_obj.max_players:
        return {"error": "Room is full"}
    
    # Add player to room
    player = {
        "id": str(uuid.uuid4()),
        "name": player_name,
        "joined_at": datetime.utcnow().isoformat()
    }
    
    room_obj.players.append(player)
    
    await db.multiplayer_rooms.update_one(
        {"id": room_id},
        {"$set": {"players": [p for p in room_obj.players]}}
    )
    
    return {"success": True, "player_id": player["id"], "room": room_obj}

# WebSocket endpoint for real-time multiplayer
@app.websocket("/ws/multiplayer/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(websocket, room_id)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Broadcast move to all players in room
            await manager.broadcast_to_room(data, room_id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, room_id)

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()