import React, { useEffect, useRef, useState } from 'react';
import { mockData } from '../../data/mockData';
import { SpriteRenderer } from './SpriteRenderer';

const TILE_SIZE = 32;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

const Enhanced2DCanvas = ({ gameState, onGameStateChange, onNPCInteraction }) => {
  const canvasRef = useRef(null);
  const [keys, setKeys] = useState({});
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [spriteRenderer, setSpriteRenderer] = useState(null);
  const [loading, setLoading] = useState(true);
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
    attackCooldown: 0,
    animationFrame: 0,
    lastAnimation: 0
  });

  const [currentMap, setCurrentMap] = useState(mockData.maps[0]);
  const [npcs, setNpcs] = useState(mockData.npcs);
  const [enemies, setEnemies] = useState(mockData.enemies);
  const [items, setItems] = useState(mockData.items);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Initialize sprite renderer
    const renderer = new SpriteRenderer(canvas, ctx);
    setSpriteRenderer(renderer);

    // Wait for sprites to load
    const checkLoading = setInterval(() => {
      if (renderer.isLoaded()) {
        setLoading(false);
        clearInterval(checkLoading);
      }
    }, 100);

    const gameLoop = (timestamp) => {
      if (!loading && renderer.isLoaded()) {
        update(timestamp);
        render(ctx, timestamp);
      }
      requestAnimationFrame(gameLoop);
    };

    gameLoop();

    const handleKeyDown = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: true }));
      
      // Handle interactions
      if (e.key === 'e' || e.key === 'E') {
        checkNPCInteraction();
      }
    };

    const handleKeyUp = (e) => {
      setKeys(prev => ({ ...prev, [e.key]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (checkLoading) clearInterval(checkLoading);
    };
  }, [loading]);

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

  const update = (timestamp) => {
    let newPlayer = { ...player };
    let isMoving = false;
    const speed = 3;

    // Movement
    if (keys['ArrowUp'] || keys['w'] || keys['W']) {
      newPlayer.y -= speed;
      newPlayer.direction = 'up';
      isMoving = true;
    }
    if (keys['ArrowDown'] || keys['s'] || keys['S']) {
      newPlayer.y += speed;
      newPlayer.direction = 'down';
      isMoving = true;
    }
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) {
      newPlayer.x -= speed;
      newPlayer.direction = 'left';
      isMoving = true;
    }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) {
      newPlayer.x += speed;
      newPlayer.direction = 'right';
      isMoving = true;
    }

    // Attack
    if (keys[' '] && newPlayer.attackCooldown <= 0) {
      newPlayer.isAttacking = true;
      newPlayer.attackCooldown = 30;
      createAttackParticles(newPlayer.x, newPlayer.y, newPlayer.direction);
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

    // Update enemies (simple AI)
    updateEnemies();

    setPlayer(newPlayer);
  };

  const createAttackParticles = (x, y, direction) => {
    const particleCount = 5;
    const newParticles = [];
    
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

  const render = (ctx, timestamp) => {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    if (!spriteRenderer) return;

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

  const drawMap = (ctx) => {
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
          spriteRenderer.drawSprite(spriteName, drawX, drawY);
        }
      }
    }
  };

  const drawPlayer = (ctx) => {
    const drawX = player.x - camera.x - 24;
    const drawY = player.y - camera.y - 24;

    // Draw player shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
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
    spriteRenderer.drawSprite(spriteName, drawX, drawY);

    // Draw direction indicator
    if (player.isAttacking) {
      ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
      let attackX = drawX + 24;
      let attackY = drawY + 24;
      
      switch (player.direction) {
        case 'up': attackY -= 30; break;
        case 'down': attackY += 30; break;
        case 'left': attackX -= 30; break;
        case 'right': attackX += 30; break;
      }
      
      ctx.fillRect(attackX - 4, attackY - 4, 8, 8);
    }
  };

  const drawNPCs = (ctx) => {
    npcs.forEach(npc => {
      const drawX = npc.x - camera.x - 16;
      const drawY = npc.y - camera.y - 16;

      // Only draw if visible
      if (drawX > -32 && drawX < CANVAS_WIDTH && drawY > -32 && drawY < CANVAS_HEIGHT) {
        // Draw NPC shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.ellipse(npc.x - camera.x, npc.y - camera.y + 12, 12, 6, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Draw NPC sprite
        spriteRenderer.drawSprite(npc.type, drawX, drawY);

        // Draw quest indicator
        if (npc.hasQuest) {
          ctx.fillStyle = '#FFD700';
          ctx.fillRect(drawX + 8, drawY - 16, 16, 16);
          ctx.fillStyle = '#000';
          ctx.font = '14px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('!', drawX + 16, drawY - 4);
        }

        // Draw interaction prompt when near
        const distance = Math.sqrt(
          Math.pow(player.x - npc.x, 2) + Math.pow(player.y - npc.y, 2)
        );
        
        if (distance < 50) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(drawX - 8, drawY - 32, 48, 16);
          ctx.fillStyle = '#FFF';
          ctx.font = '12px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('Pulsa E', drawX + 16, drawY - 20);
        }
      }
    });
  };

  const drawEnemies = (ctx) => {
    enemies.forEach(enemy => {
      const drawX = enemy.x - camera.x - 16;
      const drawY = enemy.y - camera.y - 16;

      // Only draw if visible
      if (drawX > -32 && drawX < CANVAS_WIDTH && drawY > -32 && drawY < CANVAS_HEIGHT) {
        // Draw enemy shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.ellipse(enemy.x - camera.x, enemy.y - camera.y + 12, 12, 6, 0, 0, 2 * Math.PI);
        ctx.fill();

        // Draw enemy sprite
        spriteRenderer.drawSprite(enemy.type, drawX, drawY);

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

  const drawItems = (ctx) => {
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
        spriteRenderer.drawSprite(spriteName, drawX, drawY);
      }
    });
  };

  const drawParticles = (ctx) => {
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

  const drawUI = (ctx) => {
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

    // Draw controls
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, CANVAS_HEIGHT - 90, 300, 80);
    ctx.fillStyle = '#FFF';
    ctx.font = '12px Arial';
    ctx.fillText('WASD/Flechas: Mover', 16, CANVAS_HEIGHT - 70);
    ctx.fillText('Espacio: Atacar', 16, CANVAS_HEIGHT - 55);
    ctx.fillText('E: Interactuar', 16, CANVAS_HEIGHT - 40);
    ctx.fillText('I: Inventario', 16, CANVAS_HEIGHT - 25);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-900">
        <div className="text-center">
          <div className="text-4xl mb-4">🦊</div>
          <div className="text-amber-400 text-xl mb-2">Cargando Aventura...</div>
          <div className="w-64 bg-gray-700 rounded-full h-2">
            <div 
              className="bg-amber-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${spriteRenderer ? spriteRenderer.getLoadProgress() : 0}%` }}
            />
          </div>
          <div className="text-gray-400 text-sm mt-2">
            {spriteRenderer ? Math.round(spriteRenderer.getLoadProgress()) : 0}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="game-canvas border-2 border-gray-800"
        style={{ 
          imageRendering: 'pixelated',
          background: 'linear-gradient(45deg, #1a1a2e, #16213e)'
        }}
      />
    </div>
  );
};

export default Enhanced2DCanvas;