export interface Player {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  health: number;
  maxHealth: number;
  level: number;
  exp: number;
  isMoving: boolean;
  isAttacking: boolean;
  attackCooldown: number;
  animationFrame: number;
  lastAnimation: number;
  gold: number;
}

export interface NPC {
  id: number;
  name: string;
  type: 'villager' | 'merchant' | 'guard';
  x: number;
  y: number;
  icon: string;
  hasQuest: boolean;
  dialog: string;
}

export interface Enemy {
  id: number;
  type: 'goblin' | 'skeleton' | 'orc';
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  damage: number;
  exp: number;
  loot: string[];
}

export interface Item {
  id: number;
  type: 'sword' | 'potion' | 'coin';
  x: number;
  y: number;
  name: string;
  description: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  type: string;
  icon: string;
  quantity: number;
  description: string;
}

export interface Quest {
  id: number;
  title: string;
  type: 'main' | 'side' | 'delivery';
  icon: string;
  giver: string;
  description: string;
  status: 'active' | 'completed' | 'failed';
  progress: number;
  maxProgress: number;
  rewards: {
    exp: number;
    gold: number;
    items: string[];
  };
}

export interface GameMap {
  id: number;
  name: string;
  width: number;
  height: number;
  tiles: string[];
}

export interface Dialog {
  id: number;
  npcId: number;
  questId?: number;
  messages: DialogMessage[];
}

export interface DialogMessage {
  speaker: string;
  text: string;
}

export interface Skill {
  id: number;
  name: string;
  icon: string;
  level: number;
  exp: number;
  maxExp: number;
  description: string;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export interface GameState {
  showUI: boolean;
  showDialog: boolean;
  currentNPC: NPC | null;
  player: Player;
  inventory: InventoryItem[];
  activeQuests: Quest[];
  completedQuests: Quest[];
  skills: Skill[];
  currentMap: GameMap;
  settings: {
    music: boolean;
    soundEffects: boolean;
    difficulty: string;
    autoSave: boolean;
    language: string;
  };
}

export interface Camera {
  x: number;
  y: number;
}

export interface TouchControls {
  joystick: {
    x: number;
    y: number;
    active: boolean;
  };
  actionButtons: {
    attack: boolean;
    interact: boolean;
    inventory: boolean;
  };
}