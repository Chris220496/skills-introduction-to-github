import React, { useState, useEffect } from 'react';
import { StatusBar, View, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import KeepAwake from 'react-native-keep-awake';
import Orientation from 'react-native-orientation-locker';
import HapticFeedback from 'react-native-haptic-feedback';

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

  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    // Lock orientation to landscape for better gaming experience
    Orientation.lockToLandscape();
    
    // Keep screen awake during gameplay
    KeepAwake.activate();
    
    // Load saved game from AsyncStorage
    loadGameState();
    
    // Cleanup on unmount
    return () => {
      Orientation.unlockAllOrientations();
      KeepAwake.deactivate();
    };
  }, []);

  // Auto-save game state every 30 seconds
  useEffect(() => {
    if (!gameLoaded) return;
    
    const saveGame = async () => {
      try {
        await AsyncStorage.setItem('foxAdventureGame', JSON.stringify(gameState));
      } catch (error) {
        console.error('Error saving game:', error);
      }
    };

    const saveInterval = setInterval(saveGame, 30000);
    return () => clearInterval(saveInterval);
  }, [gameState, gameLoaded]);

  const loadGameState = async () => {
    try {
      const savedGame = await AsyncStorage.getItem('foxAdventureGame');
      if (savedGame) {
        const parsedGame = JSON.parse(savedGame);
        setGameState(prevState => ({
          ...prevState,
          ...parsedGame
        }));
      }
      setGameLoaded(true);
    } catch (error) {
      console.error('Error loading saved game:', error);
      setGameLoaded(true);
    }
  };

  const handleGameStateChange = (newState: Partial<GameState>) => {
    setGameState(prevState => ({
      ...prevState,
      ...newState
    }));
  };

  const handleNPCInteraction = (npc: NPC) => {
    // Haptic feedback for interaction
    HapticFeedback.trigger('impactLight');
    
    setGameState(prevState => ({
      ...prevState,
      showDialog: true,
      currentNPC: npc
    }));
  };

  const handleQuestAccept = (questId: number) => {
    // Haptic feedback for quest acceptance
    HapticFeedback.trigger('notificationSuccess');
    
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

  const handleNewGame = () => {
    Alert.alert(
      'Nueva Partida',
      '¿Estás seguro de que quieres empezar una nueva partida? Se perderá todo el progreso actual.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('foxAdventureGame');
              // Reset game state to initial values
              setGameState({
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
                completedQuests: [],
                skills: mockData.skills,
                currentMap: mockData.maps[0],
                settings: mockData.gameSettings
              });
              HapticFeedback.trigger('notificationSuccess');
            } catch (error) {
              console.error('Error starting new game:', error);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar hidden={true} />
        
        <GameCanvas
          gameState={gameState}
          onGameStateChange={handleGameStateChange}
          onNPCInteraction={handleNPCInteraction}
        />

        <GameUI
          gameState={gameState}
          onGameStateChange={handleGameStateChange}
          isVisible={gameState.showUI}
        />

        <DialogSystem
          isVisible={gameState.showDialog}
          npc={gameState.currentNPC}
          onClose={handleDialogClose}
          onQuestAccept={handleQuestAccept}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});

export default FoxAdventureGame;