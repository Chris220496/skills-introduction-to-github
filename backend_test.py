import requests
import sys
import json
from datetime import datetime
import time

class SnakeGameAPITester:
    def __init__(self, base_url="https://efe5d670-0f6f-4fc4-a179-3853c9dd7614.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.game_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_start_game(self, player_name="TestPlayer", game_mode="classic"):
        """Test starting a new game"""
        success, response = self.run_test(
            "Start New Game",
            "POST",
            "game/start",
            200,
            data={"player_name": player_name, "game_mode": game_mode}
        )
        if success and 'id' in response:
            self.game_id = response['id']
            print(f"   Game ID: {self.game_id}")
            
            # Validate response structure
            required_fields = ['id', 'player_name', 'snake', 'food', 'score', 'game_mode', 'is_active']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                print(f"⚠️  Missing fields in response: {missing_fields}")
                return False
            
            # Validate snake structure
            if not isinstance(response['snake'], list) or len(response['snake']) < 3:
                print(f"⚠️  Invalid snake structure: {response['snake']}")
                return False
                
            # Validate food structure
            if not isinstance(response['food'], dict) or 'x' not in response['food'] or 'y' not in response['food']:
                print(f"⚠️  Invalid food structure: {response['food']}")
                return False
                
            return True
        return False

    def test_game_move(self, direction="right"):
        """Test making a move in the game"""
        if not self.game_id:
            print("❌ No game ID available for move test")
            return False
            
        success, response = self.run_test(
            f"Make Move ({direction})",
            "POST",
            "game/move",
            200,
            data={"game_id": self.game_id, "direction": direction}
        )
        
        if success:
            # Check if game over or normal move
            if 'game_over' in response and response['game_over']:
                print(f"   Game Over - Final Score: {response.get('final_score', 'N/A')}")
                return True
            else:
                # Validate move response structure
                required_fields = ['snake', 'food', 'score', 'is_active']
                missing_fields = [field for field in required_fields if field not in response]
                if missing_fields:
                    print(f"⚠️  Missing fields in move response: {missing_fields}")
                    return False
                return True
        return False

    def test_get_game_state(self):
        """Test getting current game state"""
        if not self.game_id:
            print("❌ No game ID available for game state test")
            return False
            
        return self.run_test(
            "Get Game State",
            "GET",
            f"game/{self.game_id}",
            200
        )[0]

    def test_leaderboard(self, game_mode="classic", limit=10):
        """Test getting leaderboard"""
        return self.run_test(
            "Get Leaderboard",
            "GET",
            "leaderboard",
            200,
            params={"game_mode": game_mode, "limit": limit}
        )[0]

    def test_multiplayer_create_room(self, room_name="Test Room", max_players=4):
        """Test creating multiplayer room"""
        return self.run_test(
            "Create Multiplayer Room",
            "POST",
            "multiplayer/create-room",
            200,
            params={"room_name": room_name, "max_players": max_players}
        )

    def test_multiplayer_get_rooms(self):
        """Test getting multiplayer rooms"""
        return self.run_test(
            "Get Multiplayer Rooms",
            "GET",
            "multiplayer/rooms",
            200
        )[0]

    def test_game_sequence(self):
        """Test a complete game sequence"""
        print("\n🎮 Testing Complete Game Sequence...")
        
        # Start game
        if not self.test_start_game("SequenceTest", "classic"):
            return False
            
        # Make several moves
        moves = ["right", "down", "left", "up"]
        for i, direction in enumerate(moves):
            print(f"\n   Move {i+1}: {direction}")
            if not self.test_game_move(direction):
                print(f"   Failed at move {i+1}")
                return False
            time.sleep(0.1)  # Small delay between moves
            
        # Get final game state
        if not self.test_get_game_state():
            return False
            
        print("✅ Complete game sequence test passed")
        return True

    def test_different_game_modes(self):
        """Test different game modes"""
        modes = ["classic", "speed", "survival"]
        for mode in modes:
            print(f"\n🎯 Testing {mode} mode...")
            if self.test_start_game(f"ModeTest_{mode}", mode):
                print(f"✅ {mode} mode works")
            else:
                print(f"❌ {mode} mode failed")
                return False
        return True

    def test_error_scenarios(self):
        """Test error handling scenarios"""
        print("\n⚠️  Testing Error Scenarios...")
        
        # Test invalid game ID for move
        success, _ = self.run_test(
            "Invalid Game ID Move",
            "POST",
            "game/move",
            200,  # API returns 200 with error message
            data={"game_id": "invalid-id", "direction": "up"}
        )
        
        # Test invalid direction
        if self.game_id:
            success, _ = self.run_test(
                "Invalid Direction",
                "POST",
                "game/move",
                200,
                data={"game_id": self.game_id, "direction": "invalid"}
            )
        
        # Test missing player name
        success, _ = self.run_test(
            "Missing Player Name",
            "POST",
            "game/start",
            422,  # Validation error
            data={"game_mode": "classic"}
        )
        
        return True

def main():
    print("🐍 Starting Snake Game API Tests...")
    print("=" * 50)
    
    tester = SnakeGameAPITester()
    
    # Test basic endpoints
    tester.test_root_endpoint()
    
    # Test game functionality
    tester.test_start_game()
    tester.test_game_move("right")
    tester.test_game_move("down")
    tester.test_get_game_state()
    
    # Test leaderboard
    tester.test_leaderboard()
    
    # Test multiplayer endpoints
    tester.test_multiplayer_create_room()
    tester.test_multiplayer_get_rooms()
    
    # Test complete game sequence
    tester.test_game_sequence()
    
    # Test different game modes
    tester.test_different_game_modes()
    
    # Test error scenarios
    tester.test_error_scenarios()
    
    # Print final results
    print("\n" + "=" * 50)
    print(f"📊 Final Results:")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())