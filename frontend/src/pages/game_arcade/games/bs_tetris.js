/**
 * 밸런스 시트 테트리스 (Balance Sheet Tetris) 게임 코어 엔진
 * [자산 = 부채 + 자본] 회계 항등식 퍼즐
 */

const COLS = 10;
const ROWS = 20;

// 회계 테트로미노 정의 (타입, 회계 속성, 색상, 형태)
const SHAPES = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    type: 'asset',
    name: '당좌자산 (현금)',
    color: '#38BDF8', // Cyan
    border: '#0284C7'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    type: 'equity',
    name: '자기자본 (납입자본금)',
    color: '#10B981', // Emerald
    border: '#059669'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    type: 'equity',
    name: '이익잉여금 (사내유보)',
    color: '#34D399', // Mint
    border: '#10B981'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    type: 'asset',
    name: '유형자산 (공장/설비)',
    color: '#06B6D4', // Sky
    border: '#0891B2'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    type: 'liability',
    name: '단기차입금 (고금리 부채)',
    color: '#F43F5E', // Rose Red
    border: '#E11D48'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    type: 'asset',
    name: '투자자산 (지분투자)',
    color: '#60A5FA', // Blue
    border: '#3B82F6'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    type: 'liability',
    name: '회사채 (장기 부채)',
    color: '#FB923C', // Orange
    border: '#EA580C'
  }
};

class TetrisAudio {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playMove() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  playRotate() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  playDrop() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.09);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  playClear(lines) {
    if (this.isMuted || !this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, High C
      notes.slice(0, Math.min(4, lines + 2)).forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime + idx * 0.07;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      });
    } catch (e) {}
  }
}

export class BalanceSheetTetris {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.options = options;

    this.audio = new TetrisAudio();
    this.animationId = null;

    // Grid size & metrics
    this.cols = COLS;
    this.rows = ROWS;
    this.grid = [];
    this.blockSize = 28;

    // Game stats
    this.score = 0;
    this.clearedLines = 0;
    this.debtRatio = 250; // starts at 250%, decreases to < 100%
    this.totalAssets = 100; // in 억 원
    this.gameState = 'READY'; // READY, PLAYING, PAUSED, GAMEOVER

    // Timing
    this.dropInterval = 850; // ms
    this.lastDropTime = 0;

    // Piece states
    this.currentPiece = null;
    this.nextPiece = null;
    this.holdPiece = null;
    this.canHold = true;

    // Bag randomization (7-bag system)
    this.bag = [];

    // Line clear animation
    this.clearingLines = [];
    this.clearAnimationTimer = 0;

    this.setupDisplay();
    this.resetGrid();
    this.bindEvents();
  }

  setupDisplay() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);

    // Calculate dynamic block size to fit height
    this.blockSize = Math.floor((this.height - 30) / this.rows);
    this.gridStartX = Math.floor((this.width - this.cols * this.blockSize) / 2);
    this.gridStartY = 15;
  }

  resetGrid() {
    this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
  }

  getBagPiece() {
    if (this.bag.length === 0) {
      this.bag = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      for (let i = this.bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
      }
    }
    const key = this.bag.pop();
    const proto = SHAPES[key];
    return {
      key: key,
      shape: proto.shape.map(row => [...row]),
      type: proto.type,
      name: proto.name,
      color: proto.color,
      border: proto.border,
      x: Math.floor((this.cols - proto.shape[0].length) / 2),
      y: 0
    };
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.setupDisplay();
    });

    window.addEventListener('keydown', (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code) && this.gameState === 'PLAYING') {
        e.preventDefault();
      }
      this.handleInput(e.code);
    });
  }

  handleInput(code) {
    if (this.gameState !== 'PLAYING') return;
    this.audio.init();

    if (['ArrowLeft', 'KeyA', 'a'].includes(code)) {
      this.move(-1, 0);
    } else if (['ArrowRight', 'KeyD', 'd'].includes(code)) {
      this.move(1, 0);
    } else if (['ArrowUp', 'KeyW', 'w'].includes(code)) {
      this.rotate();
    } else if (['ArrowDown', 'KeyS', 's'].includes(code)) {
      this.move(0, 1);
    } else if (code === 'Space') {
      this.hardDrop();
    } else if (['KeyC', 'c', 'ShiftLeft', 'ShiftRight'].includes(code)) {
      this.hold();
    }
  }

  start() {
    this.audio.init();
    this.resetGrid();
    this.score = 0;
    this.clearedLines = 0;
    this.debtRatio = 260;
    this.totalAssets = 100;
    this.gameState = 'PLAYING';
    this.bag = [];
    this.holdPiece = null;
    this.canHold = true;

    this.currentPiece = this.getBagPiece();
    this.nextPiece = this.getBagPiece();
    this.lastDropTime = Date.now();

    this.notifyState();
    if (!this.animationId) {
      this.loop();
    }
  }

  rotate() {
    const shape = this.currentPiece.shape;
    const n = shape.length;
    const rotated = Array.from({ length: n }, () => Array(n).fill(0));

    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        rotated[c][n - 1 - r] = shape[r][c];
      }
    }

    const prevShape = this.currentPiece.shape;
    this.currentPiece.shape = rotated;

    // Wall kicks
    let offset = 0;
    if (this.collides(0, 0)) {
      if (!this.collides(1, 0)) offset = 1;
      else if (!this.collides(-1, 0)) offset = -1;
      else if (!this.collides(2, 0)) offset = 2;
      else if (!this.collides(-2, 0)) offset = -2;
      else {
        this.currentPiece.shape = prevShape; // Cancel rotation
        return;
      }
    }

    this.currentPiece.x += offset;
    this.audio.playRotate();
  }

  move(dx, dy) {
    if (!this.collides(dx, dy)) {
      this.currentPiece.x += dx;
      this.currentPiece.y += dy;
      if (dx !== 0) this.audio.playMove();
      return true;
    }
    if (dy > 0) {
      this.lockPiece();
    }
    return false;
  }

  hardDrop() {
    let dropped = 0;
    while (!this.collides(0, 1)) {
      this.currentPiece.y++;
      dropped++;
    }
    this.score += dropped * 2;
    this.audio.playDrop();
    this.lockPiece();
  }

  hold() {
    if (!this.canHold) return;
    this.audio.playMove();

    if (!this.holdPiece) {
      this.holdPiece = this.getBagPieceByName(this.currentPiece.key);
      this.currentPiece = this.nextPiece;
      this.nextPiece = this.getBagPiece();
    } else {
      const temp = this.holdPiece;
      this.holdPiece = this.getBagPieceByName(this.currentPiece.key);
      this.currentPiece = temp;
      this.currentPiece.x = Math.floor((this.cols - this.currentPiece.shape[0].length) / 2);
      this.currentPiece.y = 0;
    }
    this.canHold = false;
    this.notifyState();
  }

  getBagPieceByName(key) {
    const proto = SHAPES[key];
    return {
      key: key,
      shape: proto.shape.map(row => [...row]),
      type: proto.type,
      name: proto.name,
      color: proto.color,
      border: proto.border,
      x: Math.floor((this.cols - proto.shape[0].length) / 2),
      y: 0
    };
  }

  collides(offsetX, offsetY) {
    const shape = this.currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const nx = this.currentPiece.x + c + offsetX;
          const ny = this.currentPiece.y + r + offsetY;
          if (nx < 0 || nx >= this.cols || ny >= this.rows) return true;
          if (ny >= 0 && this.grid[ny][nx] !== null) return true;
        }
      }
    }
    return false;
  }

  lockPiece() {
    const shape = this.currentPiece.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c]) {
          const gx = this.currentPiece.x + c;
          const gy = this.currentPiece.y + r;
          if (gy < 0) {
            this.triggerGameOver('과도한 부채 및 무리한 차입으로 인한 파산');
            return;
          }
          this.grid[gy][gx] = {
            color: this.currentPiece.color,
            border: this.currentPiece.border,
            type: this.currentPiece.type
          };
        }
      }
    }

    this.checkLines();
    this.canHold = true;

    this.currentPiece = this.nextPiece;
    this.nextPiece = this.getBagPiece();

    if (this.collides(0, 0)) {
      this.triggerGameOver('재무상태표 마감 실패 (자본잠식)');
    }

    this.notifyState();
  }

  checkLines() {
    const linesToClear = [];
    for (let r = 0; r < this.rows; r++) {
      if (this.grid[r].every(cell => cell !== null)) {
        linesToClear.push(r);
      }
    }

    if (linesToClear.length > 0) {
      this.clearedLines += linesToClear.length;

      // Calculate Accounting Settlement Score
      let baseScore = [0, 100, 300, 600, 1200][linesToClear.length] || 1500;
      this.score += baseScore;

      // Debt ratio improves with settled lines!
      this.debtRatio = Math.max(75, this.debtRatio - linesToClear.length * 18);
      this.totalAssets += linesToClear.length * 50;

      // Remove lines
      linesToClear.forEach(r => {
        this.grid.splice(r, 1);
        this.grid.unshift(Array(this.cols).fill(null));
      });

      this.audio.playClear(linesToClear.length);
    }
  }

  getGhostY() {
    let gy = 0;
    while (!this.collides(0, gy + 1)) {
      gy++;
    }
    return this.currentPiece.y + gy;
  }

  triggerGameOver(reason) {
    this.gameState = 'GAMEOVER';
    this.audio.playDrop();

    let rating = '🐣 회계 입문자';
    if (this.score >= 1500) rating = '👑 CFO (최고재무책임자) 마스터';
    else if (this.score >= 600) rating = '🔍 공인회계사 꿈나무';

    if (this.options.onGameOver) {
      this.options.onGameOver({
        score: this.score,
        clearedLines: this.clearedLines,
        debtRatio: this.debtRatio,
        totalAssets: this.totalAssets,
        reason: reason,
        rating: rating
      });
    }
  }

  notifyState() {
    if (this.options.onStateChange) {
      this.options.onStateChange({
        state: this.gameState,
        score: this.score,
        clearedLines: this.clearedLines,
        debtRatio: this.debtRatio,
        totalAssets: this.totalAssets,
        currentPiece: this.currentPiece,
        nextPiece: this.nextPiece,
        holdPiece: this.holdPiece
      });
    }
  }

  update() {
    if (this.gameState !== 'PLAYING') return;

    const now = Date.now();
    const currentSpeed = Math.max(250, this.dropInterval - Math.floor(this.score / 600) * 80);

    if (now - this.lastDropTime > currentSpeed) {
      this.move(0, 1);
      this.lastDropTime = now;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Board background
    this.ctx.fillStyle = '#090D16';
    this.ctx.fillRect(this.gridStartX, this.gridStartY, this.cols * this.blockSize, this.rows * this.blockSize);

    // Board grid lines
    this.ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    this.ctx.lineWidth = 1;
    for (let c = 0; c <= this.cols; c++) {
      const x = this.gridStartX + c * this.blockSize;
      this.ctx.beginPath();
      this.ctx.moveTo(x, this.gridStartY);
      this.ctx.lineTo(x, this.gridStartY + this.rows * this.blockSize);
      this.ctx.stroke();
    }
    for (let r = 0; r <= this.rows; r++) {
      const y = this.gridStartY + r * this.blockSize;
      this.ctx.beginPath();
      this.ctx.moveTo(this.gridStartX, y);
      this.ctx.lineTo(this.gridStartX + this.cols * this.blockSize, y);
      this.ctx.stroke();
    }

    // Outer border with neon glow
    this.ctx.strokeStyle = this.debtRatio > 180 ? '#F43F5E' : '#10B981';
    this.ctx.shadowColor = this.debtRatio > 180 ? 'rgba(244, 63, 94, 0.4)' : 'rgba(16, 185, 129, 0.4)';
    this.ctx.shadowBlur = 12;
    this.ctx.strokeRect(this.gridStartX - 2, this.gridStartY - 2, this.cols * this.blockSize + 4, this.rows * this.blockSize + 4);
    this.ctx.shadowBlur = 0;

    // Draw Locked Grid Blocks
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const cell = this.grid[r][c];
        if (cell) {
          this.drawBlock(this.gridStartX + c * this.blockSize, this.gridStartY + r * this.blockSize, cell.color, cell.border);
        }
      }
    }

    // Draw Ghost Piece
    if (this.currentPiece && this.gameState === 'PLAYING') {
      const ghostY = this.getGhostY();
      const shape = this.currentPiece.shape;
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const gx = this.gridStartX + (this.currentPiece.x + c) * this.blockSize;
            const gy = this.gridStartY + (ghostY + r) * this.blockSize;
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            this.ctx.lineWidth = 1.5;
            this.ctx.strokeRect(gx + 2, gy + 2, this.blockSize - 4, this.blockSize - 4);
          }
        }
      }

      // Draw Active Piece
      for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
          if (shape[r][c]) {
            const px = this.gridStartX + (this.currentPiece.x + c) * this.blockSize;
            const py = this.gridStartY + (this.currentPiece.y + r) * this.blockSize;
            this.drawBlock(px, py, this.currentPiece.color, this.currentPiece.border);
          }
        }
      }
    }
  }

  drawBlock(x, y, color, border) {
    const s = this.blockSize;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x + 1, y + 1, s - 2, s - 2);

    // Subtle 3D bevel / shine
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    this.ctx.fillRect(x + 1, y + 1, s - 2, 3);
    this.ctx.fillRect(x + 1, y + 1, 3, s - 2);

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    this.ctx.fillRect(x + 1, y + s - 4, s - 2, 3);
    this.ctx.fillRect(x + s - 4, y + 1, 3, s - 2);

    this.ctx.strokeStyle = border || color;
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x + 1, y + 1, s - 2, s - 2);
  }

  loop() {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.loop());
  }
}
