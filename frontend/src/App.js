import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 }
];

const DIRECTIONS = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right'
};

const GAME_MODES = {
  classic: { name: 'Classic', speed: 150, description: 'Traditional Snake gameplay' },
  speed: { name: 'Speed Challenge', speed: 100, description: 'Faster pace, more points' },
  survival: { name: 'Survival', speed: 200, description: 'Obstacles appear over time' }
};

const SnakeGame = () => {
  const [gameState, setGameState] = useState({
    snake: INITIAL_SNAKE,
    food: { x: 15, y: 15 },
    score: 0,
    isPlaying: false,
    isGameOver: false,
    direction: 'right',
    speed: 150,
    power_ups: []
  });
  
  const [gameId, setGameId] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [selectedMode, setSelectedMode] = useState('classic');
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [gameMode, setGameMode] = useState('menu');
  const [powerUpEffects, setPowerUpEffects] = useState({});
  const [gameStats, setGameStats] = useState({ gamesPlayed: 0, bestScore: 0 });
  
  const gameLoopRef = useRef(null);
  const lastDirectionRef = useRef('right');
  const moveQueueRef = useRef([]);

  // Load leaderboard
  const loadLeaderboard = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/leaderboard?game_mode=${selectedMode}&limit=10`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  }, [selectedMode]);

  // Start new game
  const startGame = async () => {
    if (!playerName.trim()) {
      alert('Please enter your name!');
      return;
    }

    try {
      const response = await axios.post(`${API}/game/start`, {
        player_name: playerName,
        game_mode: selectedMode
      });

      setGameId(response.data.id);
      setGameState({
        snake: response.data.snake,
        food: response.data.food,
        score: response.data.score,
        isPlaying: true,
        isGameOver: false,
        direction: 'right',
        speed: response.data.speed,
        power_ups: response.data.power_ups || []
      });
      setGameMode('playing');
      lastDirectionRef.current = 'right';
      moveQueueRef.current = [];
      
      // Start game loop
      startGameLoop(response.data.speed);
      
    } catch (error) {
      console.error('Error starting game:', error);
      alert('Failed to start game. Please try again.');
    }
  };

  // Game loop
  const startGameLoop = (speed) => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }

    gameLoopRef.current = setInterval(() => {
      const nextDirection = moveQueueRef.current.shift() || lastDirectionRef.current;
      makeMove(nextDirection);
    }, speed);
  };

  // Make move
  const makeMove = async (direction) => {
    if (!gameId || !gameState.isPlaying) return;

    try {
      const response = await axios.post(`${API}/game/move`, {
        game_id: gameId,
        direction: direction
      });

      if (response.data.game_over) {
        // Game over
        setGameState(prev => ({
          ...prev,
          isPlaying: false,
          isGameOver: true
        }));
        setGameMode('gameOver');
        clearInterval(gameLoopRef.current);
        
        // Update stats
        setGameStats(prev => ({
          gamesPlayed: prev.gamesPlayed + 1,
          bestScore: Math.max(prev.bestScore, response.data.final_score)
        }));
        
        // Reload leaderboard
        await loadLeaderboard();
        
      } else {
        // Update game state
        setGameState(prev => ({
          ...prev,
          snake: response.data.snake,
          food: response.data.food,
          score: response.data.score,
          power_ups: response.data.power_ups || [],
          speed: response.data.speed
        }));

        // Update speed if changed
        if (response.data.speed !== gameState.speed) {
          startGameLoop(response.data.speed);
        }
      }

      lastDirectionRef.current = direction;
      
    } catch (error) {
      console.error('Error making move:', error);
      // Handle error gracefully
      setGameState(prev => ({
        ...prev,
        isPlaying: false,
        isGameOver: true
      }));
      setGameMode('gameOver');
      clearInterval(gameLoopRef.current);
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      console.log('Key pressed:', e.code, 'Game playing:', gameState.isPlaying);
      
      // Only handle game controls when playing
      if (!gameState.isPlaying) return;
      
      // Don't interfere with input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      const newDirection = DIRECTIONS[e.code];
      console.log('New direction:', newDirection);
      
      if (!newDirection) return;
      
      // Prevent default only for game control keys
      e.preventDefault();
      
      const lastDirection = moveQueueRef.current.length > 0 
        ? moveQueueRef.current[moveQueueRef.current.length - 1]
        : lastDirectionRef.current;
      
      // Prevent reversing direction
      const opposites = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left'
      };
      
      if (opposites[newDirection] === lastDirection) {
        console.log('Cannot reverse direction');
        return;
      }
      
      // Add to move queue (max 2 moves ahead)
      if (moveQueueRef.current.length < 2) {
        moveQueueRef.current.push(newDirection);
        console.log('Direction added to queue:', newDirection);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.isPlaying]);

  // Touch controls for mobile
  const handleTouchMove = (direction) => {
    if (!gameState.isPlaying) return;
    
    const lastDirection = moveQueueRef.current.length > 0 
      ? moveQueueRef.current[moveQueueRef.current.length - 1]
      : lastDirectionRef.current;
    
    const opposites = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };
    
    if (opposites[direction] === lastDirection) return;
    
    if (moveQueueRef.current.length < 2) {
      moveQueueRef.current.push(direction);
    }
  };

  // Reset game
  const resetGame = () => {
    clearInterval(gameLoopRef.current);
    setGameState({
      snake: INITIAL_SNAKE,
      food: { x: 15, y: 15 },
      score: 0,
      isPlaying: false,
      isGameOver: false,
      direction: 'right',
      speed: 150,
      power_ups: []
    });
    setGameId(null);
    setGameMode('menu');
    lastDirectionRef.current = 'right';
    moveQueueRef.current = [];
  };

  // Load leaderboard on mount and mode change
  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, []);

  const renderCell = (x, y) => {
    const isSnakeHead = gameState.snake[0]?.x === x && gameState.snake[0]?.y === y;
    const isSnakeBody = gameState.snake.slice(1).some(segment => segment.x === x && segment.y === y);
    const isFood = gameState.food.x === x && gameState.food.y === y;
    const powerUp = gameState.power_ups.find(p => p.position.x === x && p.position.y === y);

    let cellClass = 'cell';
    if (isSnakeHead) cellClass += ' snake-head';
    else if (isSnakeBody) cellClass += ' snake-body';
    else if (isFood) cellClass += ' food';
    else if (powerUp) cellClass += ` power-up power-up-${powerUp.type}`;

    return (
      <div key={`${x}-${y}`} className={cellClass}>
        {powerUp && (
          <div className="power-up-icon">
            {powerUp.type === 'speed_boost' && '⚡'}
            {powerUp.type === 'double_points' && '💎'}
            {powerUp.type === 'invincibility' && '🛡️'}
          </div>
        )}
      </div>
    );
  };

  const renderBoard = () => {
    const board = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        board.push(renderCell(x, y));
      }
    }
    return board;
  };

  if (gameMode === 'menu') {
    return (
      <div className="game-container">
        <div className="menu-screen">
          <h1 className="game-title">🐍 Modern Snake</h1>
          <div className="menu-content">
            <div className="player-input">
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="name-input"
                maxLength={20}
              />
            </div>
            
            <div className="game-mode-selector">
              <h3>Select Game Mode:</h3>
              {Object.entries(GAME_MODES).map(([key, mode]) => (
                <label key={key} className="mode-option">
                  <input
                    type="radio"
                    name="gameMode"
                    value={key}
                    checked={selectedMode === key}
                    onChange={(e) => setSelectedMode(e.target.value)}
                  />
                  <div className="mode-info">
                    <span className="mode-name">{mode.name}</span>
                    <span className="mode-description">{mode.description}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="menu-buttons">
              <button onClick={startGame} className="start-button">
                Start Game
              </button>
              <button 
                onClick={() => setShowLeaderboard(!showLeaderboard)} 
                className="leaderboard-button"
              >
                {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
              </button>
            </div>

            {showLeaderboard && (
              <div className="leaderboard">
                <h3>🏆 Top Players ({GAME_MODES[selectedMode].name})</h3>
                {leaderboard.length > 0 ? (
                  <div className="leaderboard-list">
                    {leaderboard.map((entry, index) => (
                      <div key={entry.id} className="leaderboard-entry">
                        <span className="rank">#{index + 1}</span>
                        <span className="name">{entry.player_name}</span>
                        <span className="score">{entry.score}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No scores yet. Be the first!</p>
                )}
              </div>
            )}

            <div className="game-stats">
              <div className="stat">
                <span className="stat-label">Games Played:</span>
                <span className="stat-value">{gameStats.gamesPlayed}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Best Score:</span>
                <span className="stat-value">{gameStats.bestScore}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameMode === 'playing') {
    return (
      <div className="game-container">
        <div className="game-header">
          <div className="game-info">
            <div className="player-info">
              <span className="player-name">{playerName}</span>
              <span className="game-mode-badge">{GAME_MODES[selectedMode].name}</span>
            </div>
            <div className="score-display">
              <span className="score-label">Score:</span>
              <span className="score-value">{gameState.score}</span>
            </div>
          </div>
          <button onClick={resetGame} className="quit-button">
            Quit Game
          </button>
        </div>

        <div className="game-board">
          {renderBoard()}
        </div>

        <div className="game-controls">
          <div className="controls-info">
            <p>🎮 Use arrow keys or WASD to move</p>
            <p>📱 Or use the buttons below on mobile</p>
          </div>
          
          <div className="mobile-controls">
            <div className="control-row">
              <button 
                className="control-btn control-btn-up"
                onClick={() => handleTouchMove('up')}
                onTouchStart={() => handleTouchMove('up')}
              >
                <span className="control-arrow">▲</span>
                <span className="control-text">UP</span>
              </button>
            </div>
            <div className="control-row control-row-middle">
              <button 
                className="control-btn control-btn-left"
                onClick={() => handleTouchMove('left')}
                onTouchStart={() => handleTouchMove('left')}
              >
                <span className="control-arrow">◀</span>
                <span className="control-text">LEFT</span>
              </button>
              <div className="control-center">
                <div className="snake-icon">🐍</div>
              </div>
              <button 
                className="control-btn control-btn-right"
                onClick={() => handleTouchMove('right')}
                onTouchStart={() => handleTouchMove('right')}
              >
                <span className="control-arrow">▶</span>
                <span className="control-text">RIGHT</span>
              </button>
            </div>
            <div className="control-row">
              <button 
                className="control-btn control-btn-down"
                onClick={() => handleTouchMove('down')}
                onTouchStart={() => handleTouchMove('down')}
              >
                <span className="control-arrow">▼</span>
                <span className="control-text">DOWN</span>
              </button>
            </div>
          </div>
          
          <div className="control-hints">
            <div className="hint-row">
              <span className="hint-key">W A S D</span>
              <span className="hint-text">Keyboard Controls</span>
            </div>
            <div className="hint-row">
              <span className="hint-key">↑ ↓ ← →</span>
              <span className="hint-text">Arrow Keys</span>
            </div>
          </div>
        </div>

        {gameState.power_ups.length > 0 && (
          <div className="power-ups-info">
            <h4>Power-ups on board:</h4>
            {gameState.power_ups.map(powerUp => (
              <div key={powerUp.id} className="power-up-info">
                {powerUp.type === 'speed_boost' && '⚡ Speed Boost'}
                {powerUp.type === 'double_points' && '💎 Double Points'}
                {powerUp.type === 'invincibility' && '🛡️ Invincibility'}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (gameMode === 'gameOver') {
    return (
      <div className="game-container">
        <div className="game-over-screen">
          <h2 className="game-over-title">Game Over!</h2>
          <div className="final-score">
            <span className="score-label">Final Score:</span>
            <span className="score-value">{gameState.score}</span>
          </div>
          <div className="game-over-info">
            <p>Player: {playerName}</p>
            <p>Mode: {GAME_MODES[selectedMode].name}</p>
          </div>
          <div className="game-over-buttons">
            <button onClick={startGame} className="play-again-button">
              Play Again
            </button>
            <button onClick={resetGame} className="menu-button">
              Back to Menu
            </button>
          </div>
          
          <div className="final-leaderboard">
            <h3>🏆 Leaderboard</h3>
            {leaderboard.slice(0, 5).map((entry, index) => (
              <div key={entry.id} className={`leaderboard-entry ${entry.player_name === playerName ? 'highlight' : ''}`}>
                <span className="rank">#{index + 1}</span>
                <span className="name">{entry.player_name}</span>
                <span className="score">{entry.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

function App() {
  return (
    <div className="App">
      <SnakeGame />
    </div>
  );
}

export default App;