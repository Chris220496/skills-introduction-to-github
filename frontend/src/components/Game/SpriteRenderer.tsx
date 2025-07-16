export class SpriteRenderer {
  private canvas: HTMLCanvasElement;
  private sprites: Map<string, HTMLCanvasElement> = new Map();
  private loadedSprites: number = 0;
  private totalSprites: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.initializeSprites();
  }

  private initializeSprites() {
    // Create sprite canvases for each game element
    this.createSprite('fox_idle', this.createFoxSprite('idle'));
    this.createSprite('fox_walk', this.createFoxSprite('walk'));
    this.createSprite('fox_attack', this.createFoxSprite('attack'));
    this.createSprite('goblin', this.createGoblinSprite());
    this.createSprite('skeleton', this.createSkeletonSprite());
    this.createSprite('orc', this.createOrcSprite());
    this.createSprite('villager', this.createVillagerSprite());
    this.createSprite('merchant', this.createMerchantSprite());
    this.createSprite('guard', this.createGuardSprite());
    this.createSprite('grass_tile', this.createGrassTile());
    this.createSprite('stone_tile', this.createStoneTile());
    this.createSprite('water_tile', this.createWaterTile());
    this.createSprite('tree_tile', this.createTreeTile());
    this.createSprite('dirt_tile', this.createDirtTile());
    this.createSprite('wall_tile', this.createWallTile());
    this.createSprite('sword_item', this.createSwordItem());
    this.createSprite('potion_item', this.createPotionItem());
    this.createSprite('coin_item', this.createCoinItem());
  }

  private createSprite(name: string, canvas: HTMLCanvasElement) {
    this.sprites.set(name, canvas);
    this.totalSprites++;
    this.loadedSprites++;
  }

  private createFoxSprite(state: 'idle' | 'walk' | 'attack'): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 48;
    canvas.height = 48;
    const ctx = canvas.getContext('2d')!;

    ctx.imageSmoothingEnabled = false;

    // Fox body (orange)
    const gradient = ctx.createLinearGradient(0, 0, 48, 48);
    gradient.addColorStop(0, '#FF6B35');
    gradient.addColorStop(1, '#D2691E');
    ctx.fillStyle = gradient;
    
    // Main body
    ctx.fillRect(12, 16, 24, 20);
    
    // Head
    ctx.fillRect(16, 8, 16, 16);
    
    // Ears
    ctx.fillStyle = '#FF6B35';
    ctx.fillRect(14, 4, 6, 8);
    ctx.fillRect(28, 4, 6, 8);
    
    // Inner ears
    ctx.fillStyle = '#FFB347';
    ctx.fillRect(16, 6, 2, 4);
    ctx.fillRect(30, 6, 2, 4);
    
    // Face (white)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(18, 12, 12, 8);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(20, 14, 2, 2);
    ctx.fillRect(26, 14, 2, 2);
    
    // Nose
    ctx.fillStyle = '#000000';
    ctx.fillRect(23, 17, 2, 1);
    
    // Tail
    ctx.fillStyle = gradient;
    ctx.fillRect(36, 20, 8, 12);
    
    // Tail tip (white)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(38, 28, 4, 4);
    
    // Legs
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(14, 32, 4, 8);
    ctx.fillRect(18, 32, 4, 8);
    ctx.fillRect(26, 32, 4, 8);
    ctx.fillRect(30, 32, 4, 8);

    // Animation-specific details
    if (state === 'walk') {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(14, 34, 4, 6);
      ctx.fillRect(18, 30, 4, 10);
      ctx.fillRect(26, 34, 4, 6);
      ctx.fillRect(30, 30, 4, 10);
    } else if (state === 'attack') {
      ctx.fillStyle = '#C0C0C0';
      ctx.fillRect(38, 12, 8, 2);
      ctx.fillRect(40, 8, 4, 8);
    }

    return canvas;
  }

  private createGoblinSprite(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Goblin body (green)
    ctx.fillStyle = '#228B22';
    ctx.fillRect(8, 12, 16, 16);
    
    // Head
    ctx.fillStyle = '#90EE90';
    ctx.fillRect(10, 6, 12, 12);
    
    // Ears
    ctx.fillStyle = '#228B22';
    ctx.fillRect(6, 6, 4, 6);
    ctx.fillRect(22, 6, 4, 6);
    
    // Eyes (red)
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(12, 10, 2, 2);
    ctx.fillRect(18, 10, 2, 2);
    
    // Arms
    ctx.fillStyle = '#228B22';
    ctx.fillRect(4, 14, 6, 10);
    ctx.fillRect(22, 14, 6, 10);
    
    // Legs
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(10, 24, 4, 8);
    ctx.fillRect(18, 24, 4, 8);
    
    // Weapon (club)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(2, 8, 2, 12);
    ctx.fillRect(0, 8, 6, 4);
    
    return canvas;
  }

  private createSkeletonSprite(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Skeleton body (bone white)
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(10, 14, 12, 14);
    
    // Skull
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(8, 6, 16, 12);
    
    // Eye sockets
    ctx.fillStyle = '#000000';
    ctx.fillRect(10, 8, 3, 3);
    ctx.fillRect(19, 8, 3, 3);
    
    // Ribcage
    ctx.fillStyle = '#000000';
    ctx.fillRect(11, 16, 1, 8);
    ctx.fillRect(13, 16, 1, 8);
    ctx.fillRect(15, 16, 1, 8);
    ctx.fillRect(17, 16, 1, 8);
    ctx.fillRect(19, 16, 1, 8);
    
    // Arms
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(4, 16, 6, 8);
    ctx.fillRect(22, 16, 6, 8);
    
    // Legs
    ctx.fillRect(10, 26, 4, 6);
    ctx.fillRect(18, 26, 4, 6);
    
    return canvas;
  }

  private createOrcSprite(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Orc body (dark green)
    ctx.fillStyle = '#556B2F';
    ctx.fillRect(10, 16, 20, 20);
    
    // Head
    ctx.fillStyle = '#8FBC8F';
    ctx.fillRect(12, 8, 16, 16);
    
    // Tusks
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(14, 18, 2, 4);
    ctx.fillRect(24, 18, 2, 4);
    
    // Eyes (red)
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(16, 12, 2, 2);
    ctx.fillRect(22, 12, 2, 2);
    
    // Arms (muscular)
    ctx.fillStyle = '#556B2F';
    ctx.fillRect(2, 18, 8, 12);
    ctx.fillRect(30, 18, 8, 12);
    
    // Legs
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(12, 32, 6, 8);
    ctx.fillRect(22, 32, 6, 8);
    
    // Armor
    ctx.fillStyle = '#696969';
    ctx.fillRect(12, 16, 16, 4);
    
    return canvas;
  }

  private createVillagerSprite(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Body (brown clothes)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(8, 12, 16, 16);
    
    // Head (skin)
    ctx.fillStyle = '#FDBCB4';
    ctx.fillRect(10, 6, 12, 12);
    
    // Hair
    ctx.fillStyle = '#654321';
    ctx.fillRect(10, 6, 12, 4);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(12, 10, 2, 2);
    ctx.fillRect(18, 10, 2, 2);
    
    // Arms
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(4, 14, 6, 10);
    ctx.fillRect(22, 14, 6, 10);
    
    // Legs
    ctx.fillStyle = '#654321';
    ctx.fillRect(10, 24, 4, 8);
    ctx.fillRect(18, 24, 4, 8);
    
    return canvas;
  }

  private createMerchantSprite(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Body (purple robe)
    ctx.fillStyle = '#4B0082';
    ctx.fillRect(8, 12, 16, 16);
    
    // Head
    ctx.fillStyle = '#FDBCB4';
    ctx.fillRect(10, 6, 12, 12);
    
    // Hat
    ctx.fillStyle = '#4B0082';
    ctx.fillRect(8, 4, 16, 4);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(12, 10, 2, 2);
    ctx.fillRect(18, 10, 2, 2);
    
    // Beard
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(12, 14, 8, 4);
    
    // Gold trim
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(8, 16, 16, 2);
    
    return canvas;
  }

  private createGuardSprite(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Body (armor)
    ctx.fillStyle = '#708090';
    ctx.fillRect(8, 12, 16, 16);
    
    // Head
    ctx.fillStyle = '#FDBCB4';
    ctx.fillRect(10, 6, 12, 12);
    
    // Helmet
    ctx.fillStyle = '#708090';
    ctx.fillRect(8, 4, 16, 6);
    
    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(12, 10, 2, 2);
    ctx.fillRect(18, 10, 2, 2);
    
    // Shield
    ctx.fillStyle = '#B22222';
    ctx.fillRect(2, 12, 6, 10);
    
    // Sword
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(26, 8, 2, 12);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(25, 18, 4, 4);
    
    return canvas;
  }

  private createGrassTile(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Base grass color
    ctx.fillStyle = '#4a7c59';
    ctx.fillRect(0, 0, 32, 32);
    
    // Grass texture
    ctx.fillStyle = '#5a8c69';
    for (let i = 0; i < 20; i++) {
      const x = Math.floor(Math.random() * 32);
      const y = Math.floor(Math.random() * 32);
      ctx.fillRect(x, y, 1, 2);
    }
    
    // Darker grass spots
    ctx.fillStyle = '#3a6c49';
    for (let i = 0; i < 10; i++) {
      const x = Math.floor(Math.random() * 30);
      const y = Math.floor(Math.random() * 30);
      ctx.fillRect(x, y, 2, 2);
    }
    
    return canvas;
  }

  private createStoneTile(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Base stone color
    ctx.fillStyle = '#8b8680';
    ctx.fillRect(0, 0, 32, 32);
    
    // Stone texture
    ctx.fillStyle = '#9b9690';
    for (let i = 0; i < 15; i++) {
      const x = Math.floor(Math.random() * 32);
      const y = Math.floor(Math.random() * 32);
      ctx.fillRect(x, y, 2, 2);
    }
    
    // Darker stone spots
    ctx.fillStyle = '#7b7670';
    for (let i = 0; i < 8; i++) {
      const x = Math.floor(Math.random() * 30);
      const y = Math.floor(Math.random() * 30);
      ctx.fillRect(x, y, 3, 3);
    }
    
    return canvas;
  }

  private createWaterTile(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Base water color
    ctx.fillStyle = '#4169e1';
    ctx.fillRect(0, 0, 32, 32);
    
    // Water waves
    ctx.fillStyle = '#5179f1';
    for (let y = 0; y < 32; y += 4) {
      for (let x = 0; x < 32; x += 8) {
        ctx.fillRect(x + (y % 8), y, 4, 2);
      }
    }
    
    // Highlights
    ctx.fillStyle = '#6189ff';
    for (let i = 0; i < 5; i++) {
      const x = Math.floor(Math.random() * 28);
      const y = Math.floor(Math.random() * 28);
      ctx.fillRect(x, y, 4, 1);
    }
    
    return canvas;
  }

  private createTreeTile(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Tree trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(12, 20, 8, 12);
    
    // Tree leaves
    ctx.fillStyle = '#2d5016';
    ctx.fillRect(6, 6, 20, 20);
    
    // Leaf highlights
    ctx.fillStyle = '#3d6026';
    for (let i = 0; i < 10; i++) {
      const x = 6 + Math.floor(Math.random() * 20);
      const y = 6 + Math.floor(Math.random() * 20);
      ctx.fillRect(x, y, 2, 2);
    }
    
    return canvas;
  }

  private createDirtTile(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Base dirt color
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(0, 0, 32, 32);
    
    // Dirt texture
    ctx.fillStyle = '#9b8365';
    for (let i = 0; i < 25; i++) {
      const x = Math.floor(Math.random() * 32);
      const y = Math.floor(Math.random() * 32);
      ctx.fillRect(x, y, 1, 1);
    }
    
    // Darker dirt spots
    ctx.fillStyle = '#7b6345';
    for (let i = 0; i < 12; i++) {
      const x = Math.floor(Math.random() * 30);
      const y = Math.floor(Math.random() * 30);
      ctx.fillRect(x, y, 2, 2);
    }
    
    return canvas;
  }

  private createWallTile(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Base wall color
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, 32, 32);
    
    // Stone blocks
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, 16, 16);
    ctx.strokeRect(16, 0, 16, 16);
    ctx.strokeRect(0, 16, 16, 16);
    ctx.strokeRect(16, 16, 16, 16);
    
    // Block highlights
    ctx.fillStyle = '#666666';
    ctx.fillRect(2, 2, 12, 12);
    ctx.fillRect(18, 2, 12, 12);
    ctx.fillRect(2, 18, 12, 12);
    ctx.fillRect(18, 18, 12, 12);
    
    return canvas;
  }

  private createSwordItem(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Sword blade
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(10, 2, 4, 16);
    
    // Sword hilt
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(8, 16, 8, 4);
    
    // Sword grip
    ctx.fillStyle = '#654321';
    ctx.fillRect(10, 18, 4, 4);
    
    // Blade shine
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(11, 4, 1, 12);
    
    return canvas;
  }

  private createPotionItem(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Potion bottle
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(8, 6, 8, 16);
    
    // Potion liquid
    ctx.fillStyle = '#FF69B4';
    ctx.fillRect(9, 8, 6, 12);
    
    // Bottle neck
    ctx.fillStyle = '#654321';
    ctx.fillRect(10, 4, 4, 4);
    
    // Cork
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(10, 2, 4, 2);
    
    // Shine
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(9, 9, 2, 2);
    
    return canvas;
  }

  private createCoinItem(): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = 24;
    canvas.height = 24;
    const ctx = canvas.getContext('2d')!;
    
    ctx.imageSmoothingEnabled = false;
    
    // Coin base
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(8, 8, 8, 8);
    
    // Coin border
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 1;
    ctx.strokeRect(8, 8, 8, 8);
    
    // Coin shine
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(9, 9, 2, 2);
    
    return canvas;
  }

  public drawSprite(spriteName: string, x: number, y: number, ctx: CanvasRenderingContext2D, scale: number = 1): void {
    const sprite = this.sprites.get(spriteName);
    if (sprite) {
      const width = sprite.width * scale;
      const height = sprite.height * scale;
      ctx.drawImage(sprite, x, y, width, height);
    }
  }

  public isLoaded(): boolean {
    return this.loadedSprites === this.totalSprites;
  }

  public getLoadProgress(): number {
    return this.totalSprites > 0 ? (this.loadedSprites / this.totalSprites) * 100 : 0;
  }
}