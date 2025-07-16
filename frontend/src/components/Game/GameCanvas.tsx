import React, { useEffect, useRef, useState } from 'react';
import { View, Dimensions, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { Canvas, CanvasRenderingContext2D } from 'react-native-canvas';
import { Player, NPC, Enemy, Item, GameMap, Camera, TouchControls, Particle, GameState } from '../../types/GameTypes';
import { mockData } from '../../data/mockData';
import { SpriteRenderer } from './SpriteRenderer';
import TouchControlsComponent from './TouchControls';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CANVAS_WIDTH = screenWidth;
const CANVAS_HEIGHT = screenHeight - 200; // Space for controls
const TILE_SIZE = 32;

interface GameCanvasProps {
  gameState: GameState;
  onGameStateChange: (newState: Partial<GameState>) => void;
  onNPCInteraction: (npc: NPC) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ gameState, onGameStateChange, onNPCInteraction }) => {
  const canvasRef = useRef<Canvas>(null);
  const animationRef = useRef<number>();
  const [spriteRenderer, setSpriteRenderer] = useState<SpriteRenderer | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
  const [player, setPlayer] = useState<Player>({
    x: 400,
    y: 300,
    direction: 'down',
    health: 100,
    maxHealth: 100,
    level: 1,
    exp: 0,
    isMoving: false,
    isAttacking: false,
    attackCooldown: 0,
    animationFrame: 0,
    lastAnimation: 0,
    gold: 150
  });

  const [touchControls, setTouchControls] = useState<TouchControls>({
    joystick: { x: 0, y: 0, active: false },
    actionButtons: { attack: false, interact: false, inventory: false }
  });

  const [currentMap] = useState<GameMap>(mockData.maps[0]);
  const [npcs] = useState<NPC[]>(mockData.npcs);
  const [enemies, setEnemies] = useState<Enemy[]>(mockData.enemies);
  const [items] = useState<Item[]>(mockData.items);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const renderer = new SpriteRenderer(canvas);
      setSpriteRenderer(renderer);

      // Wait for sprites to load
      const checkLoading = setInterval(() => {
        if (renderer.isLoaded()) {
          setLoading(false);
          clearInterval(checkLoading);
          startGameLoop();
        }
      }, 100);

      return () => {
        if (checkLoading) clearInterval(checkLoading);
        if (animationRef.current) cancelAnimationFrame(animationRef.current);
      };
    }
  }, []);

  const startGameLoop = () => {
    const gameLoop = (timestamp: number) => {
      if (!loading && spriteRenderer) {
        update(timestamp);
        render(timestamp);
      }
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    gameLoop(0);
  };

  const update = (timestamp: number) => {
    let newPlayer = { ...player };
    let isMoving = false;
    const speed = 3;

    // Touch controls movement
    if (touchControls.joystick.active) {
      const magnitude = Math.sqrt(
        touchControls.joystick.x * touchControls.joystick.x +
        touchControls.joystick.y * touchControls.joystick.y
      );
      
      if (magnitude > 0.1) {
        const normalizedX = touchControls.joystick.x / magnitude;
        const normalizedY = touchControls.joystick.y / magnitude;
        
        newPlayer.x += normalizedX * speed;
        newPlayer.y += normalizedY * speed;
        
        // Set direction based on movement
        if (Math.abs(normalizedX) > Math.abs(normalizedY)) {
          newPlayer.direction = normalizedX > 0 ? 'right' : 'left';
        } else {
          newPlayer.direction = normalizedY > 0 ? 'down' : 'up';
        }
        
        isMoving = true;
      }
    }

    // Attack
    if (touchControls.actionButtons.attack && newPlayer.attackCooldown <= 0) {
      newPlayer.isAttacking = true;
      newPlayer.attackCooldown = 30;
      createAttackParticles(newPlayer.x, newPlayer.y, newPlayer.direction);
    }

    // Interact
    if (touchControls.actionButtons.interact) {
      checkNPCInteraction();
      setTouchControls(prev => ({
        ...prev,
        actionButtons: { ...prev.actionButtons, interact: false }
      }));
    }

    // Inventory
    if (touchControls.actionButtons.inventory) {
      onGameStateChange({ showUI: !gameState.showUI });
      setTouchControls(prev => ({
        ...prev,
        actionButtons: { ...prev.actionButtons, inventory: false }
      }));
    }

    if (newPlayer.attackCooldown > 0) {
      newPlayer.attackCooldown--;
    }

    if (newPlayer.attackCooldown === 0) {
      newPlayer.isAttacking = false;
    }

    // Animation
    if (isMoving && timestamp - newPlayer.lastAnimation > 200) {
      newPlayer.animationFrame = (newPlayer.animationFrame + 1) % 4;
      newPlayer.lastAnimation = timestamp;
    } else if (!isMoving) {
      newPlayer.animationFrame = 0;
    }

    newPlayer.isMoving = isMoving;

    // Update camera to follow player smoothly
    const targetCameraX = newPlayer.x - CANVAS_WIDTH / 2;
    const targetCameraY = newPlayer.y - CANVAS_HEIGHT / 2;
    
    setCamera(prevCamera => ({
      x: prevCamera.x + (targetCameraX - prevCamera.x) * 0.1,
      y: prevCamera.y + (targetCameraY - prevCamera.y) * 0.1
    }));

    // Update particles
    updateParticles();

    // Update enemies
    updateEnemies();

    setPlayer(newPlayer);
  };

  const checkNPCInteraction = () => {
    const interactionDistance = 50;
    
    npcs.forEach(npc => {
      const distance = Math.sqrt(
        Math.pow(player.x - npc.x, 2) + Math.pow(player.y - npc.y, 2)
      );
      
      if (distance < interactionDistance) {
        onNPCInteraction(npc);
      }
    });
  };

  const createAttackParticles = (x: number, y: number, direction: string) => {
    const particleCount = 5;
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < particleCount; i++) {
      let offsetX = 0, offsetY = 0;
      
      switch (direction) {
        case 'up': offsetY = -30; break;
        case 'down': offsetY = 30; break;
        case 'left': offsetX = -30; break;
        case 'right': offsetX = 30; break;
      }
      
      newParticles.push({
        x: x + offsetX + (Math.random() - 0.5) * 20,
        y: y + offsetY + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 30,
        maxLife: 30,
        color: '#FFD700'
      });
    }
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const updateParticles = () => {
    setParticles(prev => 
      prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life - 1,
        vx: particle.vx * 0.98,
        vy: particle.vy * 0.98
      })).filter(particle => particle.life > 0)
    );
  };

  const updateEnemies = () => {
    setEnemies(prev => 
      prev.map(enemy => {
        const dx = player.x - enemy.x;
        const dy = player.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100 && distance > 32) {
          const moveSpeed = 1;
          const normalizedX = dx / distance;
          const normalizedY = dy / distance;
          
          return {
            ...enemy,
            x: enemy.x + normalizedX * moveSpeed,
            y: enemy.y + normalizedY * moveSpeed
          };
        }
        
        return enemy;
      })
    );
  };

  const render = (timestamp: number) => {
    if (!canvasRef.current || !spriteRenderer) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw map tiles
    drawMap(ctx);

    // Draw items
    drawItems(ctx);

    // Draw enemies
    drawEnemies(ctx);

    // Draw NPCs
    drawNPCs(ctx);

    // Draw player
    drawPlayer(ctx);

    // Draw particles
    drawParticles(ctx);

    // Draw UI
    drawUI(ctx);
  };

  const drawMap = (ctx: CanvasRenderingContext2D) => {
    const startX = Math.floor(camera.x / TILE_SIZE);
    const startY = Math.floor(camera.y / TILE_SIZE);
    const endX = startX + Math.ceil(CANVAS_WIDTH / TILE_SIZE) + 1;
    const endY = startY + Math.ceil(CANVAS_HEIGHT / TILE_SIZE) + 1;

    for (let y = Math.max(0, startY); y < Math.min(currentMap.height, endY); y++) {
      for (let x = Math.max(0, startX); x < Math.min(currentMap.width, endX); x++) {
        const tileIndex = y * currentMap.width + x;
        const tile = currentMap.tiles[tileIndex];
        
        if (tile) {
          const drawX = x * TILE_SIZE - camera.x;
          const drawY = y * TILE_SIZE - camera.y;
          
          const spriteName = tile + '_tile';
          spriteRenderer!.drawSprite(spriteName, drawX, drawY, ctx);
        }
      }
    }
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    const drawX = player.x - camera.x - 24;
    const drawY = player.y - camera.y - 24;

    // Draw player shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(player.x - camera.x, player.y - camera.y + 20, 16, 8, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Determine sprite based on state
    let spriteName = 'fox_idle';
    if (player.isAttacking) {
      spriteName = 'fox_attack';
    } else if (player.isMoving) {
      spriteName = 'fox_walk';
    }

    // Draw player sprite
    spriteRenderer!.drawSprite(spriteName, drawX, drawY, ctx);
  };

  const drawNPCs = (ctx: CanvasRenderingContext2D) => {
    npcs.forEach(npc => {
      const drawX = npc.x - camera.x - 16;
      const drawY = npc.y - camera.y - 16;

      // Only draw if visible
      if (drawX > -32 && drawX < CANVAS_WIDTH && drawY > -32 && drawY < CANVAS_HEIGHT) {
        // Draw NPC shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(npc.x - camera.x, npc.y - camera.y + 12, 12, 6, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Draw NPC sprite
        spriteRenderer!.drawSprite(npc.type, drawX, drawY, ctx);

        // Draw quest indicator
        if (npc.hasQuest) {
          ctx.fillStyle = '#FFD700';
          ctx.fillRect(drawX + 8, drawY - 16, 16, 16);
          ctx.fillStyle = '#000';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('!', drawX + 16, drawY - 4);
        }
      }
    });
  };

  const drawEnemies = (ctx: CanvasRenderingContext2D) => {
    enemies.forEach(enemy => {
      const drawX = enemy.x - camera.x - 16;
      const drawY = enemy.y - camera.y - 16;

      // Only draw if visible
      if (drawX > -32 && drawX < CANVAS_WIDTH && drawY > -32 && drawY < CANVAS_HEIGHT) {
        // Draw enemy shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.beginPath();
        ctx.ellipse(enemy.x - camera.x, enemy.y - camera.y + 12, 12, 6, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Draw enemy sprite
        spriteRenderer!.drawSprite(enemy.type, drawX, drawY, ctx);

        // Draw health bar
        const healthBarWidth = 32;
        const healthPercentage = enemy.health / enemy.maxHealth;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(drawX - 2, drawY - 10, healthBarWidth + 4, 8);
        
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(drawX, drawY - 8, healthBarWidth, 4);
        
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(drawX, drawY - 8, healthBarWidth * healthPercentage, 4);
      }
    });
  };

  const drawItems = (ctx: CanvasRenderingContext2D) => {
    items.forEach(item => {
      const drawX = item.x - camera.x - 12;
      const drawY = item.y - camera.y - 12;

      // Only draw if visible
      if (drawX > -24 && drawX < CANVAS_WIDTH && drawY > -24 && drawY < CANVAS_HEIGHT) {
        // Draw item glow effect
        const glowIntensity = 0.3 + 0.2 * Math.sin(Date.now() * 0.005);
        ctx.fillStyle = `rgba(255, 255, 0, ${glowIntensity})`;
        ctx.fillRect(drawX - 4, drawY - 4, 32, 32);

        // Draw item sprite
        const spriteName = item.type + '_item';
        spriteRenderer!.drawSprite(spriteName, drawX, drawY, ctx);
      }
    });
  };

  const drawParticles = (ctx: CanvasRenderingContext2D) => {
    particles.forEach(particle => {
      const drawX = particle.x - camera.x;
      const drawY = particle.y - camera.y;
      
      if (drawX > 0 && drawX < CANVAS_WIDTH && drawY > 0 && drawY < CANVAS_HEIGHT) {
        const alpha = particle.life / particle.maxLife;
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.fillRect(drawX - 2, drawY - 2, 4, 4);
      }
    });
  };

  const drawUI = (ctx: CanvasRenderingContext2D) => {
    // Draw health bar
    const healthBarWidth = 200;
    const healthPercentage = player.health / player.maxHealth;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, healthBarWidth + 4, 24);
    
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(12, 12, healthBarWidth, 20);
    
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(12, 12, healthBarWidth * healthPercentage, 20);
    
    ctx.fillStyle = '#FFF';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`HP: ${player.health}/${player.maxHealth}`, 16, 26);

    // Draw level and exp
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 40, 200, 20);
    ctx.fillStyle = '#FFF';
    ctx.fillText(`Nivel: ${player.level} | EXP: ${player.exp}`, 16, 54);
  };

  const handleJoystickMove = (x: number, y: number) => {
    setTouchControls(prev => ({
      ...prev,
      joystick: { x, y, active: true }
    }));
  };

  const handleJoystickRelease = () => {
    setTouchControls(prev => ({
      ...prev,
      joystick: { x: 0, y: 0, active: false }
    }));
  };

  const handleActionButton = (action: 'attack' | 'interact' | 'inventory') => {
    setTouchControls(prev => ({
      ...prev,
      actionButtons: { ...prev.actionButtons, [action]: true }
    }));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a2e' }}>
        {/* Loading screen would go here */}
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Canvas
        ref={canvasRef}
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          backgroundColor: '#1a1a2e'
        }}
      />
      <TouchControlsComponent
        onJoystickMove={handleJoystickMove}
        onJoystickRelease={handleJoystickRelease}
        onActionButton={handleActionButton}
      />
    </View>
  );
};

export default GameCanvas;