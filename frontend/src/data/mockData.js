export const mockData = {
  maps: [
    {
      id: 1,
      name: "Aldea Inicial",
      width: 50,
      height: 50,
      tiles: Array(2500).fill(null).map((_, i) => {
        const x = i % 50;
        const y = Math.floor(i / 50);
        
        // Create a simple map layout
        if (x === 0 || x === 49 || y === 0 || y === 49) return 'wall';
        if (x > 10 && x < 15 && y > 10 && y < 15) return 'water';
        if (x > 20 && x < 25 && y > 20 && y < 25) return 'stone';
        if (Math.random() < 0.1) return 'tree';
        if (Math.random() < 0.05) return 'dirt';
        return 'grass';
      })
    }
  ],

  npcs: [
    {
      id: 1,
      name: "Aldeano Sabio",
      type: "villager",
      x: 300,
      y: 200,
      icon: "🧙‍♂️",
      hasQuest: true,
      dialog: "¡Bienvenido, valiente zorro! He estado esperándote."
    },
    {
      id: 2,
      name: "Comerciante",
      type: "merchant",
      x: 500,
      y: 250,
      icon: "🛍️",
      hasQuest: false,
      dialog: "¿Necesitas suministros para tu aventura?"
    },
    {
      id: 3,
      name: "Guardia Real",
      type: "guard",
      x: 600,
      y: 300,
      icon: "🛡️",
      hasQuest: true,
      dialog: "Los caminos no son seguros últimamente..."
    }
  ],

  enemies: [
    {
      id: 1,
      type: "goblin",
      x: 700,
      y: 400,
      health: 30,
      maxHealth: 30,
      damage: 5,
      exp: 10,
      loot: ["coin", "potion"]
    },
    {
      id: 2,
      type: "skeleton",
      x: 800,
      y: 350,
      health: 25,
      maxHealth: 25,
      damage: 8,
      exp: 15,
      loot: ["coin", "bone"]
    },
    {
      id: 3,
      type: "orc",
      x: 750,
      y: 500,
      health: 50,
      maxHealth: 50,
      damage: 12,
      exp: 25,
      loot: ["sword", "coin"]
    }
  ],

  items: [
    {
      id: 1,
      type: "sword",
      x: 450,
      y: 350,
      name: "Espada de Hierro",
      description: "Una espada básica pero confiable"
    },
    {
      id: 2,
      type: "potion",
      x: 550,
      y: 400,
      name: "Poción de Vida",
      description: "Restaura 50 puntos de vida"
    },
    {
      id: 3,
      type: "coin",
      x: 650,
      y: 450,
      name: "Moneda de Oro",
      description: "Moneda del reino"
    }
  ],

  inventory: [
    {
      id: 1,
      name: "Espada de Hierro",
      type: "weapon",
      icon: "⚔️",
      quantity: 1,
      description: "Una espada básica pero confiable. Aumenta el daño de ataque."
    },
    {
      id: 2,
      name: "Poción de Vida",
      type: "consumable",
      icon: "🧪",
      quantity: 3,
      description: "Restaura 50 puntos de vida instantáneamente."
    },
    {
      id: 3,
      name: "Monedas de Oro",
      type: "currency",
      icon: "🪙",
      quantity: 150,
      description: "La moneda oficial del reino. Úsala para comprar objetos."
    },
    {
      id: 4,
      name: "Arco Élfico",
      type: "weapon",
      icon: "🏹",
      quantity: 1,
      description: "Un arco mágico que permite ataques a distancia."
    },
    {
      id: 5,
      name: "Escudo de Madera",
      type: "armor",
      icon: "🛡️",
      quantity: 1,
      description: "Reduce el daño recibido en combate."
    },
    {
      id: 6,
      name: "Llave Dorada",
      type: "key",
      icon: "🗝️",
      quantity: 1,
      description: "Una llave misteriosa que abre puertas especiales."
    }
  ],

  quests: [
    {
      id: 1,
      title: "El Cristal Perdido",
      type: "main",
      icon: "💎",
      giver: "Aldeano Sabio",
      description: "Encuentra el cristal mágico perdido en el Bosque Encantado. Se dice que tiene poderes extraordinarios.",
      status: "active",
      progress: 0,
      maxProgress: 1,
      rewards: {
        exp: 100,
        gold: 50,
        items: ["Amuleto de Protección"]
      }
    },
    {
      id: 2,
      title: "Limpieza de Goblins",
      type: "side",
      icon: "⚔️",
      giver: "Guardia Real",
      description: "Elimina 5 goblins que están atacando a los comerciantes en el camino principal.",
      status: "active",
      progress: 2,
      maxProgress: 5,
      rewards: {
        exp: 75,
        gold: 30,
        items: ["Espada de Acero"]
      }
    },
    {
      id: 3,
      title: "Entrega Especial",
      type: "delivery",
      icon: "📦",
      giver: "Comerciante",
      description: "Lleva este paquete importante al Castillo Real y entrégalo al Rey.",
      status: "completed",
      progress: 1,
      maxProgress: 1,
      rewards: {
        exp: 50,
        gold: 25,
        items: ["Anillo de Velocidad"]
      }
    }
  ],

  dialogs: [
    {
      id: 1,
      npcId: 1,
      questId: 1,
      messages: [
        {
          speaker: "Aldeano Sabio",
          text: "¡Ah, el legendario zorro aventurero! He estado esperándote durante mucho tiempo."
        },
        {
          speaker: "Aldeano Sabio",
          text: "Necesito tu ayuda con algo muy importante. Un cristal mágico muy poderoso se ha perdido en el Bosque Encantado."
        },
        {
          speaker: "Aldeano Sabio",
          text: "Sin él, nuestra aldea está en peligro. ¿Podrías ayudarnos a recuperarlo? Te compensaré generosamente."
        }
      ]
    },
    {
      id: 2,
      npcId: 2,
      messages: [
        {
          speaker: "Comerciante",
          text: "¡Bienvenido a mi tienda, valiente zorro! Tengo los mejores suministros para aventureros."
        },
        {
          speaker: "Comerciante",
          text: "¿Necesitas pociones? ¿Tal vez un arma nueva? ¡Tengo todo lo que necesitas!"
        }
      ]
    },
    {
      id: 3,
      npcId: 3,
      questId: 2,
      messages: [
        {
          speaker: "Guardia Real",
          text: "Los caminos no son seguros últimamente. Los goblins están atacando a los comerciantes."
        },
        {
          speaker: "Guardia Real",
          text: "Si pudieras ayudarnos a eliminar algunos de estos goblins, sería una gran ayuda para toda la comunidad."
        }
      ]
    }
  ],

  skills: [
    {
      id: 1,
      name: "Combate con Espada",
      icon: "⚔️",
      level: 3,
      exp: 150,
      maxExp: 200,
      description: "Mejora tu habilidad con armas cuerpo a cuerpo"
    },
    {
      id: 2,
      name: "Arquería",
      icon: "🏹",
      level: 2,
      exp: 80,
      maxExp: 150,
      description: "Aumenta tu precisión y daño con arcos"
    },
    {
      id: 3,
      name: "Magia Elemental",
      icon: "🔥",
      level: 1,
      exp: 20,
      maxExp: 100,
      description: "Desbloquea hechizos de fuego, hielo y rayo"
    },
    {
      id: 4,
      name: "Sigilo",
      icon: "👤",
      level: 4,
      exp: 180,
      maxExp: 250,
      description: "Muévete sin ser detectado por los enemigos"
    },
    {
      id: 5,
      name: "Curación",
      icon: "💚",
      level: 2,
      exp: 100,
      maxExp: 150,
      description: "Regenera vida más rápido y usa pociones más eficientemente"
    },
    {
      id: 6,
      name: "Supervivencia",
      icon: "🏕️",
      level: 3,
      exp: 120,
      maxExp: 200,
      description: "Encuentra recursos y resiste condiciones adversas"
    }
  ],

  gameSettings: {
    music: true,
    soundEffects: true,
    difficulty: "normal",
    autoSave: true,
    language: "spanish"
  }
};