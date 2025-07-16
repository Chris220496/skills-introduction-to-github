import React, { useEffect, useRef, useState } from 'react';
import { mockData } from '../../data/mockData';

const TILE_SIZE = 32;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const GameCanvas = ({ gameState, onGameStateChange }) => {
  const canvasRef = useRef(null);
  const [keys, setKeys] = useState({});
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [player, setPlayer] = useState({
    x: 400,
    y: 300,
    direction: 'down',
    health: 100,
    maxHealth: 100,
    level: 1,
    exp: 0,
    isMoving: false,
    isAttacking: false,
    attackCooldown: 0
  });

  const [currentMap, setCurrentMap] = useState(mockData.maps[0]);
  const [npcs, setNpcs] = useState(mockData.npcs);
  const [enemies, setEnemies] = useState(mockData.enemies);
  const [items, setItems] = useState(mockData.items);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const gameLoop = () => {
      update();
      render(ctx);
      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const update = () => {
    let newPlayer = { ...player };
    let isMoving = false;
    const speed = 3;

    // Movement
    if (keys['ArrowUp'] || keys['w']) {
      newPlayer.y -= speed;
      newPlayer.direction = 'up';
      isMoving = true;
    }
    if (keys['ArrowDown'] || keys['s']) {
      newPlayer.y += speed;
      newPlayer.direction = 'down';
      isMoving = true;
    }
    if (keys['ArrowLeft'] || keys['a']) {
      newPlayer.x -= speed;
      newPlayer.direction = 'left';
      isMoving = true;
    }
    if (keys['ArrowRight'] || keys['d']) {
      newPlayer.x += speed;
      newPlayer.direction = 'right';
      isMoving = true;
    }

    // Attack
    if (keys[' '] && newPlayer.attackCooldown <= 0) {
      newPlayer.isAttacking = true;
      newPlayer.attackCooldown = 30;
    }

    if (newPlayer.attackCooldown > 0) {
      newPlayer.attackCooldown--;
    }

    if (newPlayer.attackCooldown === 0) {
      newPlayer.isAttacking = false;
    }

    newPlayer.isMoving = isMoving;

    // Update camera to follow player
    setCamera({
      x: newPlayer.x - CANVAS_WIDTH / 2,
      y: newPlayer.y - CANVAS_HEIGHT / 2
    });

    setPlayer(newPlayer);
  };

  const render = (ctx) => {
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

    // Draw UI
    drawUI(ctx);
  };

  const drawMap = (ctx) => {
    const startX = Math.floor(camera.x / TILE_SIZE);
    const startY = Math.floor(camera.y / TILE_SIZE);
    const endX = startX + Math.ceil(CANVAS_WIDTH / TILE_SIZE);
    const endY = startY + Math.ceil(CANVAS_HEIGHT / TILE_SIZE);

    for (let y = Math.max(0, startY); y < Math.min(currentMap.height, endY); y++) {
      for (let x = Math.max(0, startX); x < Math.min(currentMap.width, endX); x++) {
        const tileIndex = y * currentMap.width + x;
        const tile = currentMap.tiles[tileIndex];
        
        if (tile) {
          const drawX = x * TILE_SIZE - camera.x;
          const drawY = y * TILE_SIZE - camera.y;
          
          ctx.fillStyle = getTileColor(tile);
          ctx.fillRect(drawX, drawY, TILE_SIZE, TILE_SIZE);
          
          // Draw tile border for pixel art effect
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 1;
          ctx.strokeRect(drawX, drawY, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  };

  const getTileColor = (tile) => {
    switch (tile) {
      case 'grass': return '#4a7c59';
      case 'stone': return '#8b8680';
      case 'water': return '#4169e1';
      case 'tree': return '#2d5016';
      case 'dirt': return '#8b7355';
      case 'wall': return '#555555';
      default: return '#4a7c59';
    }
  };

  const drawPlayer = (ctx) => {
    const drawX = player.x - camera.x;
    const drawY = player.y - camera.y;

    // Draw player shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(drawX + 2, drawY + 26, 24, 6);

    // Draw player body (fox)
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(drawX + 4, drawY + 4, 20, 20);

    // Draw player face
    ctx.fillStyle = '#fff';
    ctx.fillRect(drawX + 6, drawY + 6, 16, 12);

    // Draw ears
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(drawX + 6, drawY + 2, 4, 6);
    ctx.fillRect(drawX + 18, drawY + 2, 4, 6);

    // Draw eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(drawX + 8, drawY + 8, 2, 2);
    ctx.fillRect(drawX + 18, drawY + 8, 2, 2);

    // Draw tail
    ctx.fillStyle = '#ff6b35';
    ctx.fillRect(drawX + 22, drawY + 8, 6, 8);

    // Draw weapon if attacking
    if (player.isAttacking) {
      ctx.fillStyle = '#c0c0c0';
      switch (player.direction) {
        case 'up':
          ctx.fillRect(drawX + 10, drawY - 8, 8, 12);
          break;
        case 'down':
          ctx.fillRect(drawX + 10, drawY + 24, 8, 12);
          break;
        case 'left':
          ctx.fillRect(drawX - 8, drawY + 10, 12, 8);
          break;
        case 'right':
          ctx.fillRect(drawX + 24, drawY + 10, 12, 8);
          break;
      }
    }
  };

  const drawNPCs = (ctx) => {
    npcs.forEach(npc => {
      const drawX = npc.x - camera.x;
      const drawY = npc.y - camera.y;

      // Only draw if visible
      if (drawX > -32 && drawX < CANVAS_WIDTH && drawY > -32 && drawY < CANVAS_HEIGHT) {
        // Draw NPC shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(drawX + 2, drawY + 26, 24, 6);

        // Draw NPC based on type
        switch (npc.type) {
          case 'villager':
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(drawX + 4, drawY + 4, 20, 20);
            ctx.fillStyle = '#fdbcb4';
            ctx.fillRect(drawX + 6, drawY + 6, 16, 12);
            break;
          case 'merchant':
            ctx.fillStyle = '#4b0082';
            ctx.fillRect(drawX + 4, drawY + 4, 20, 20);
            ctx.fillStyle = '#fdbcb4';
            ctx.fillRect(drawX + 6, drawY + 6, 16, 12);
            break;
          case 'guard':
            ctx.fillStyle = '#708090';
            ctx.fillRect(drawX + 4, drawY + 4, 20, 20);
            ctx.fillStyle = '#fdbcb4';
            ctx.fillRect(drawX + 6, drawY + 6, 16, 12);
            break;
        }

        // Draw quest indicator
        if (npc.hasQuest) {
          ctx.fillStyle = '#ffd700';
          ctx.fillRect(drawX + 10, drawY - 8, 8, 8);
          ctx.fillStyle = '#000';
          ctx.font = '12px Arial';
          ctx.fillText('!', drawX + 13, drawY - 1);
        }
      }
    });
  };

  const drawEnemies = (ctx) => {
    enemies.forEach(enemy => {
      const drawX = enemy.x - camera.x;
      const drawY = enemy.y - camera.y;

      // Only draw if visible
      if (drawX > -32 && drawX < CANVAS_WIDTH && drawY > -32 && drawY < CANVAS_HEIGHT) {
        // Draw enemy shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(drawX + 2, drawY + 26, 24, 6);

        // Draw enemy based on type
        switch (enemy.type) {
          case 'goblin':
            ctx.fillStyle = '#228b22';
            ctx.fillRect(drawX + 4, drawY + 4, 20, 20);
            ctx.fillStyle = '#90ee90';
            ctx.fillRect(drawX + 6, drawY + 6, 16, 12);
            break;
          case 'skeleton':
            ctx.fillStyle = '#f5f5dc';
            ctx.fillRect(drawX + 4, drawY + 4, 20, 20);
            break;
          case 'orc':
            ctx.fillStyle = '#556b2f';
            ctx.fillRect(drawX + 4, drawY + 4, 20, 20);
            ctx.fillStyle = '#8fbc8f';
            ctx.fillRect(drawX + 6, drawY + 6, 16, 12);
            break;
        }

        // Draw health bar
        const healthBarWidth = 20;
        const healthPercentage = enemy.health / enemy.maxHealth;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(drawX + 4, drawY - 8, healthBarWidth, 4);
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(drawX + 4, drawY - 8, healthBarWidth * healthPercentage, 4);
      }
    });
  };

  const drawItems = (ctx) => {
    items.forEach(item => {
      const drawX = item.x - camera.x;
      const drawY = item.y - camera.y;

      // Only draw if visible
      if (drawX > -32 && drawX < CANVAS_WIDTH && drawY > -32 && drawY < CANVAS_HEIGHT) {
        // Draw item glow effect
        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
        ctx.fillRect(drawX + 2, drawY + 2, 20, 20);

        // Draw item based on type
        switch (item.type) {
          case 'sword':
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(drawX + 8, drawY + 4, 8, 20);
            ctx.fillStyle = '#8b4513';
            ctx.fillRect(drawX + 10, drawY + 16, 4, 8);
            break;
          case 'potion':
            ctx.fillStyle = '#ff69b4';
            ctx.fillRect(drawX + 8, drawY + 8, 8, 12);
            ctx.fillStyle = '#800080';
            ctx.fillRect(drawX + 10, drawY + 4, 4, 8);
            break;
          case 'coin':
            ctx.fillStyle = '#ffd700';
            ctx.fillRect(drawX + 8, drawY + 8, 8, 8);
            break;
        }
      }
    });
  };

  const drawUI = (ctx) => {
    // Draw health bar
    const healthBarWidth = 200;
    const healthPercentage = player.health / player.maxHealth;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, healthBarWidth + 4, 24);
    
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(12, 12, healthBarWidth, 20);
    
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(12, 12, healthBarWidth * healthPercentage, 20);
    
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText(`Health: ${player.health}/${player.maxHealth}`, 16, 26);

    // Draw level and exp
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 40, 200, 20);
    ctx.fillStyle = '#fff';
    ctx.fillText(`Level: ${player.level} | EXP: ${player.exp}`, 16, 54);

    // Draw controls
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, CANVAS_HEIGHT - 80, 300, 70);
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText('WASD/Arrow Keys: Move', 16, CANVAS_HEIGHT - 60);
    ctx.fillText('Space: Attack', 16, CANVAS_HEIGHT - 45);
    ctx.fillText('E: Interact', 16, CANVAS_HEIGHT - 30);
    ctx.fillText('I: Inventory', 16, CANVAS_HEIGHT - 15);
  };

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas border-2 border-gray-800"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
};

export default GameCanvas;