import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameCanvas from './components/Game/GameCanvas';
import GameUI from './components/Game/GameUI';
import DialogSystem from './components/Game/DialogSystem';
import { GameState, NPC } from './types/GameTypes';
import { mockData } from './data/mockData';

const FoxAdventureGame: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    showUI: false,
    showDialog: false,
    currentNPC: null,
    player: {
      level: 1,
      exp: 0,
      health: 100,
      maxHealth: 100,
      x: 400,
      y: 300,
      direction: 'down',
      isMoving: false,
      isAttacking: false,
      attackCooldown: 0,
      animationFrame: 0,
      lastAnimation: 0,
      gold: 150
    },
    inventory: mockData.inventory,
    activeQuests: mockData.quests.filter(q => q.status === 'active'),
    completedQuests: mockData.quests.filter(q => q.status === 'completed'),
    skills: mockData.skills,
    currentMap: mockData.maps[0],
    settings: mockData.gameSettings
  });

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    // Load saved game from localStorage
    const savedGame = localStorage.getItem('foxAdventureGame');
    if (savedGame) {
      try {
        const parsedGame = JSON.parse(savedGame);
        setGameState(prevState => ({
          ...prevState,
          ...parsedGame
        }));
      } catch (error) {
        console.error('Error loading saved game:', error);
      }
    }
    setGameLoaded(true);
  }, []);

  // Auto-save game state every 30 seconds
  useEffect(() => {
    if (!gameLoaded) return;
    
    const saveGame = () => {
      try {
        localStorage.setItem('foxAdventureGame', JSON.stringify(gameState));
      } catch (error) {
        console.error('Error saving game:', error);
      }
    };

    const saveInterval = setInterval(saveGame, 30000);
    return () => clearInterval(saveInterval);
  }, [gameState, gameLoaded]);

  const handleGameStateChange = (newState: Partial<GameState>) => {
    setGameState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  const handleNPCInteraction = (npc: NPC) => {
    setGameState(prevState => ({
      ...prevState,
      showDialog: true,
      currentNPC: npc
    }));
  };

  const handleQuestAccept = (questId: number) => {
    const quest = mockData.quests.find(q => q.id === questId);
    if (quest) {
      setGameState(prevState => ({
        ...prevState,
        activeQuests: [...prevState.activeQuests, { ...quest, status: 'active' }]
      }));
    }
  };

  const handleDialogClose = () => {
    setGameState(prevState => ({
      ...prevState,
      showDialog: false,
      currentNPC: null
    }));
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0a0a0a',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      background: 'linear-gradient(90deg, #2c3e50, #34495e)',
      borderBottom: '2px solid #f39c12',
      padding: '20px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
    },
    headerContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    titleIcon: {
      fontSize: '32px',
      position: 'relative' as const
    },
    titleText: {
      fontSize: '24px',
      fontWeight: 'bold',
      background: 'linear-gradient(45deg, #f39c12, #e67e22)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    },
    playerStats: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    stat: {
      backgroundColor: '#2c3e50',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '14px',
      border: '1px solid #34495e'
    },
    audioButton: {
      fontSize: '24px',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: '#f39c12',
      transition: 'all 0.2s'
    },
    gameArea: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 'calc(100vh - 120px)',
      padding: '20px'
    },
    gameContainer: {
      position: 'relative' as const,
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
    },
    instructions: {
      position: 'absolute' as const,
      top: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '15px',
      borderRadius: '10px',
      border: '1px solid #f39c12',
      fontSize: '12px',
      color: '#ecf0f1'
    },
    instructionTitle: {
      color: '#f39c12',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    instructionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '5px'
    },
    key: {
      backgroundColor: '#2c3e50',
      padding: '2px 6px',
      borderRadius: '3px',
      fontSize: '10px',
      minWidth: '20px',
      textAlign: 'center' as const
    },
    miniMap: {
      position: 'absolute' as const,
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '10px',
      borderRadius: '10px',
      border: '1px solid #f39c12'
    },
    miniMapTitle: {
      color: '#f39c12',
      fontSize: '10px',
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    miniMapGrid: {
      width: '80px',
      height: '80px',
      backgroundColor: '#2c3e50',
      borderRadius: '5px',
      position: 'relative' as const
    },
    playerDot: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      width: '4px',
      height: '4px',
      backgroundColor: '#f39c12',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)',
      animation: 'pulse 2s infinite'
    },
    npcDot: {
      position: 'absolute' as const,
      width: '2px',
      height: '2px',
      backgroundColor: '#27ae60',
      borderRadius: '50%'
    },
    enemyDot: {
      position: 'absolute' as const,
      width: '2px',
      height: '2px',
      backgroundColor: '#e74c3c',
      borderRadius: '50%'
    }
  };

  return (
    <div style={styles.container}>
      {/* Game Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.title}>
            <div style={styles.titleIcon}>🦊</div>
            <h1 style={styles.titleText}>Aventura del Zorro Medieval</h1>
          </div>
          <div style={styles.playerStats}>
            <div style={styles.stat}>
              Nivel {gameState.player.level} | EXP: {gameState.player.exp}
            </div>
            <div style={styles.stat}>
              Oro: {gameState.player.gold} 🪙
            </div>
            <button
              style={styles.audioButton}
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div style={styles.gameArea}>
        <div style={styles.gameContainer}>
          <GameCanvas
            gameState={gameState}
            onGameStateChange={handleGameStateChange}
            onNPCInteraction={handleNPCInteraction}
          />
          
          {/* Game Instructions */}
          <div style={styles.instructions}>
            <div style={styles.instructionTitle}>Controles</div>
            <div style={styles.instructionItem}>
              <span style={styles.key}>WASD</span>
              <span>Mover</span>
            </div>
            <div style={styles.instructionItem}>
              <span style={styles.key}>SPACE</span>
              <span>Atacar</span>
            </div>
            <div style={styles.instructionItem}>
              <span style={styles.key}>E</span>
              <span>Interactuar</span>
            </div>
            <div style={styles.instructionItem}>
              <span style={styles.key}>I</span>
              <span>Inventario</span>
            </div>
          </div>

          {/* Mini Map */}
          <div style={styles.miniMap}>
            <div style={styles.miniMapTitle}>Mini Mapa</div>
            <div style={styles.miniMapGrid}>
              <div style={styles.playerDot} />
              {/* NPC dots */}
              {mockData.npcs.map((npc, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.npcDot,
                    left: `${(npc.x / 1600) * 100}%`,
                    top: `${(npc.y / 1600) * 100}%`
                  }}
                />
              ))}
              {/* Enemy dots */}
              {mockData.enemies.map((enemy, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.enemyDot,
                    left: `${(enemy.x / 1600) * 100}%`,
                    top: `${(enemy.y / 1600) * 100}%`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game UI Overlay */}
      <GameUI
        gameState={gameState}
        onGameStateChange={handleGameStateChange}
        isVisible={gameState.showUI}
      />

      {/* Dialog System */}
      <DialogSystem
        isVisible={gameState.showDialog}
        npc={gameState.currentNPC}
        onClose={handleDialogClose}
        onQuestAccept={handleQuestAccept}
      />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FoxAdventureGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;