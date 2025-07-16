import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import GameCanvas from './components/Game/GameCanvas';
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
  }, []);

  // Auto-save game state
  useEffect(() => {
    const saveGame = () => {
      try {
        localStorage.setItem('foxAdventureGame', JSON.stringify(gameState));
      } catch (error) {
        console.error('Error saving game:', error);
      }
    };

    const saveInterval = setInterval(saveGame, 30000); // Save every 30 seconds
    return () => clearInterval(saveInterval);
  }, [gameState]);

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
      <div className="bg-gray-800 border-b border-amber-600 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦊</span>
            <h1 className="text-2xl font-bold text-amber-400">
              Aventura del Zorro Medieval
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-300">
              Nivel {gameState.player.level} | EXP: {gameState.player.exp}
            </div>
            <div className="text-sm text-gray-300">
              Oro: {gameState.player.gold} 🪙
            </div>
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="text-2xl hover:text-amber-400 transition-colors"
            >
              {audioEnabled ? '🔊' : '🔇'}
            </button>
          </div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)] p-4">
        <div className="relative">
          <GameCanvas 
            gameState={gameState}
            onGameStateChange={handleGameStateChange}
            onNPCInteraction={handleNPCInteraction}
          />
          
          {/* Game Instructions */}
          <div className="absolute top-4 right-4 bg-black bg-opacity-70 p-3 rounded">
            <div className="text-xs text-gray-300 space-y-1">
              <div>WASD/Flechas: Mover</div>
              <div>Espacio: Atacar</div>
              <div>E: Interactuar</div>
              <div>I: Inventario</div>
              <div>M: Música On/Off</div>
              <div>ESC: Cerrar menús</div>
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