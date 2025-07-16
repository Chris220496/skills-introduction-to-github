import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Enhanced2DCanvas from './components/Game/Enhanced2DCanvas';
import GameUI from './components/Game/GameUI';
import DialogSystem from './components/Game/DialogSystem';
import { mockData } from './data/mockData';
import './App.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const FoxAdventureGame = () => {
  const [gameState, setGameState] = useState({
    showUI: false,
    showDialog: false,
    currentNPC: null,
    player: {
      level: 1,
      exp: 0,
      health: 100,
      maxHealth: 100,
      inventory: mockData.inventory,
      activeQuests: mockData.quests.filter(q => q.status === 'active'),
      completedQuests: mockData.quests.filter(q => q.status === 'completed'),
      skills: mockData.skills,
      gold: 150
    },
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

    // Test backend connection
    const testBackend = async () => {
      try {
        const response = await axios.get(`${API}/`);
        console.log('Backend connected:', response.data.message);
      } catch (e) {
        console.error('Backend connection failed:', e);
      }
    };

    testBackend();
    setGameLoaded(true);
  }, []);

  // Auto-save game state
  useEffect(() => {
    if (!gameLoaded) return;
    
    const saveGame = () => {
      try {
        localStorage.setItem('foxAdventureGame', JSON.stringify(gameState));
      } catch (error) {
        console.error('Error saving game:', error);
      }
    };

    const saveInterval = setInterval(saveGame, 30000); // Save every 30 seconds
    return () => clearInterval(saveInterval);
  }, [gameState, gameLoaded]);

  const handleGameStateChange = (newState) => {
    setGameState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  const handleKeyPress = (e) => {
    switch (e.key) {
      case 'i':
      case 'I':
        setGameState(prevState => ({
          ...prevState,
          showUI: !prevState.showUI
        }));
        break;
      case 'Escape':
        setGameState(prevState => ({
          ...prevState,
          showUI: false,
          showDialog: false
        }));
        break;
      case 'm':
      case 'M':
        setAudioEnabled(prev => !prev);
        break;
    }
  };

  const handleNPCInteraction = (npc) => {
    setGameState(prevState => ({
      ...prevState,
      showDialog: true,
      currentNPC: npc
    }));
  };

  const handleQuestAccept = (questId) => {
    const quest = mockData.quests.find(q => q.id === questId);
    if (quest) {
      setGameState(prevState => ({
        ...prevState,
        player: {
          ...prevState.player,
          activeQuests: [...prevState.player.activeQuests, { ...quest, status: 'active' }]
        }
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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Game Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-amber-600 p-4 shadow-lg">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="text-4xl drop-shadow-lg">🦊</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Aventura del Zorro Medieval
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-full">
              Nivel {gameState.player.level} | EXP: {gameState.player.exp}
            </div>
            <div className="text-sm text-gray-300 bg-gray-800 px-3 py-1 rounded-full">
              Oro: {gameState.player.gold} 🪙
            </div>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="text-2xl hover:text-amber-400 transition-colors hover:scale-110 transform"
            >
              {audioEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-4">
        <div className="relative shadow-2xl rounded-lg overflow-hidden">
          <Enhanced2DCanvas 
            gameState={gameState}
            onGameStateChange={handleGameStateChange}
            onNPCInteraction={handleNPCInteraction}
          />
          
          {/* Game Instructions */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-80 p-4 rounded-lg border border-amber-600">
            <h3 className="text-amber-400 font-bold mb-2">Controles</h3>
            <div className="text-xs text-gray-300 space-y-1">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">WASD</kbd>
                <span>Mover</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">SPACE</kbd>
                <span>Atacar</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">E</kbd>
                <span>Interactuar</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">I</kbd>
                <span>Inventario</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">M</kbd>
                <span>Música</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-700 rounded text-xs">ESC</kbd>
                <span>Cerrar</span>
              </div>
            </div>
          </div>

          {/* Mini Map */}
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 p-2 rounded-lg border border-amber-600">
            <h4 className="text-amber-400 text-xs font-bold mb-1">Mini Mapa</h4>
            <div className="w-24 h-24 bg-gray-800 rounded relative">
              {/* Player dot */}
              <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
              {/* NPC dots */}
              {mockData.npcs.map((npc, index) => (
                <div 
                  key={index}
                  className="absolute w-1 h-1 bg-green-400 rounded-full"
                  style={{
                    left: `${(npc.x / 1600) * 100}%`,
                    top: `${(npc.y / 1600) * 100}%`
                  }}
                />
              ))}
              {/* Enemy dots */}
              {mockData.enemies.map((enemy, index) => (
                <div 
                  key={index}
                  className="absolute w-1 h-1 bg-red-400 rounded-full"
                  style={{
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

      {/* Audio Element (hidden) */}
      {audioEnabled && (
        <audio 
          loop 
          autoPlay 
          className="hidden"
          volume={0.3}
        >
          <source src="/audio/medieval-music.mp3" type="audio/mpeg" />
        </audio>
      )}
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<FoxAdventureGame />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;