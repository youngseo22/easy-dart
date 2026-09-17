/**
 * DART 공시 레이더 미사일 슈팅 게임 코어 엔진
 * HTML5 Canvas 60fps 기반 아케이드 게임
 */
import { DISCLOSURE_DATASET, getRandomDisclosure } from './disclosure_dataset.js';

class SoundSynthesizer {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playLaser() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  playExplosion() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // White noise buffer for explosion
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.linearRampToValueAtTime(80, now + 0.25);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  playWarning() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {}
  }

  playCombo() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.12); // G5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  playCollect() {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.06); // E5
      osc.frequency.setValueAtTime(880.00, now + 0.12); // A5
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch (e) {}
  }
}

export class DartRadarShooter {
  constructor(canvasElement, options = {}) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.options = options;

    this.sound = new SoundSynthesizer();
    this.animationFrameId = null;

    // Game Metrics & Logic
    this.score = 0;
    this.marketCap = 100; // 0 ~ 100% 체력
    this.combo = 0;
    this.maxCombo = 0;
    this.level = 1;
    this.gameState = 'READY'; // READY, PLAYING, PAUSED, GAMEOVER
    this.startTime = 0;
    this.survivalSeconds = 0;

    // Disclosures Encountered (for review sheet)
    this.encounterHistory = new Map(); // id -> { item, countShot, countMissed }

    // Screen shake
    this.screenShakeTime = 0;

    // Entities
    this.player = {
      x: 0,
      y: 0,
      width: 48,
      height: 48,
      speed: 7,
      vx: 0,
      cooldown: 0
    };

    this.missiles = [];
    this.capsules = [];
    this.particles = [];
    this.floatingTexts = [];
    this.stars = [];

    // Controls
    this.keys = {
      left: false,
      right: false,
      shoot: false
    };

    // Spawning control
    this.lastSpawnTime = 0;
    this.spawnInterval = 1700; // ms

    this.setupDisplay();
    this.setupStars();
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

    this.player.x = this.width / 2;
    this.player.y = this.height - 60;
  }

  setupStars() {
    this.stars = [];
    for (let i = 0; i < 45; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2 + 0.8,
        speed: Math.random() * 0.8 + 0.3,
        alpha: Math.random() * 0.8 + 0.2
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.setupDisplay();
    });

    window.addEventListener('keydown', (e) => {
      this.sound.init();
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.code)) {
        this.keys.left = true;
      }
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code)) {
        this.keys.right = true;
      }
      if (['Space', 'KeyW', 'ArrowUp'].includes(e.code)) {
        this.keys.shoot = true;
        if (this.gameState === 'PLAYING') {
          e.preventDefault();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(e.code)) {
        this.keys.left = false;
      }
      if (['ArrowRight', 'KeyD', 'd', 'D'].includes(e.code)) {
        this.keys.right = false;
      }
      if (['Space', 'KeyW', 'ArrowUp'].includes(e.code)) {
        this.keys.shoot = false;
      }
    });

    // Touch & Mouse Drag on Canvas
    let isTouching = false;
    const handlePointerMove = (clientX) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      this.player.x = Math.max(30, Math.min(this.width - 30, x));
    };

    this.canvas.addEventListener('mousedown', (e) => {
      this.sound.init();
      isTouching = true;
      handlePointerMove(e.clientX);
      this.keys.shoot = true;
    });

    window.addEventListener('mousemove', (e) => {
      if (isTouching) {
        handlePointerMove(e.clientX);
      }
    });

    window.addEventListener('mouseup', () => {
      isTouching = false;
      this.keys.shoot = false;
    });

    this.canvas.addEventListener('touchstart', (e) => {
      this.sound.init();
      if (e.touches.length > 0) {
        isTouching = true;
        handlePointerMove(e.touches[0].clientX);
        this.keys.shoot = true;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      isTouching = false;
      this.keys.shoot = false;
    });
  }

  start() {
    this.sound.init();
    this.score = 0;
    this.marketCap = 100;
    this.combo = 0;
    this.maxCombo = 0;
    this.level = 1;
    this.gameState = 'PLAYING';
    this.startTime = Date.now();
    this.missiles = [];
    this.capsules = [];
    this.particles = [];
    this.floatingTexts = [];
    this.encounterHistory.clear();
    this.lastSpawnTime = Date.now();

    if (this.options.onStateChange) {
      this.options.onStateChange({
        state: this.gameState,
        score: this.score,
        marketCap: this.marketCap,
        combo: this.combo
      });
    }

    if (!this.animationFrameId) {
      this.loop();
    }
  }

  stop() {
    this.gameState = 'GAMEOVER';
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  triggerGameOver(reason) {
    this.gameState = 'GAMEOVER';
    this.survivalSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    this.sound.playWarning();

    // Prepare Review Summary
    const reviewList = Array.from(this.encounterHistory.values());

    if (this.options.onGameOver) {
      this.options.onGameOver({
        score: this.score,
        marketCap: Math.max(0, Math.floor(this.marketCap)),
        survivalSeconds: this.survivalSeconds,
        maxCombo: this.maxCombo,
        reason: reason,
        reviewList: reviewList
      });
    }
  }

  shoot() {
    if (this.player.cooldown > 0) return;
    this.player.cooldown = 11; // frame interval

    // Dual laser
    this.missiles.push({
      x: this.player.x - 14,
      y: this.player.y - 10,
      radius: 4,
      speed: 13,
      color: '#38BDF8'
    });
    this.missiles.push({
      x: this.player.x + 14,
      y: this.player.y - 10,
      radius: 4,
      speed: 13,
      color: '#38BDF8'
    });

    this.sound.playLaser();
  }

  spawnCapsule() {
    const item = getRandomDisclosure();
    const padding = 75;
    const spawnX = Math.random() * (this.width - padding * 2) + padding;

    // Track encounter
    if (!this.encounterHistory.has(item.id)) {
      this.encounterHistory.set(item.id, {
        item: item,
        countShot: 0,
        countAbsorbed: 0,
        countCollided: 0,
        countMissed: 0
      });
    }

    // Speed scales slightly with score
    const speedMultiplier = 1 + Math.min(1.2, this.score / 2000);

    this.capsules.push({
      item: item,
      x: spawnX,
      y: -30,
      vy: (1.2 * item.speed) * speedMultiplier,
      width: 154,
      height: 42,
      pulse: 0
    });
  }

  addExplosion(x, y, color, count = 18) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 2;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 1.5,
        color: color,
        alpha: 1,
        life: Math.random() * 20 + 20
      });
    }
  }

  addFloatingText(text, x, y, color, size = 15) {
    this.floatingTexts.push({
      text: text,
      x: x,
      y: y,
      color: color,
      size: size,
      alpha: 1,
      vy: -1.4
    });
  }

  update() {
    if (this.gameState !== 'PLAYING') return;

    // Update Player Movement
    if (this.keys.left) {
      this.player.x -= this.player.speed;
    }
    if (this.keys.right) {
      this.player.x += this.player.speed;
    }
    this.player.x = Math.max(30, Math.min(this.width - 30, this.player.x));

    // Player shooting
    if (this.keys.shoot) {
      this.shoot();
    }
    if (this.player.cooldown > 0) {
      this.player.cooldown--;
    }

    // Spawn Capsules
    const now = Date.now();
    const currentInterval = Math.max(850, this.spawnInterval - Math.floor(this.score / 500) * 120);
    if (now - this.lastSpawnTime > currentInterval) {
      this.spawnCapsule();
      this.lastSpawnTime = now;
    }

    // Update Missiles
    for (let i = this.missiles.length - 1; i >= 0; i--) {
      const m = this.missiles[i];
      m.y -= m.speed;
      if (m.y < -20) {
        this.missiles.splice(i, 1);
      }
    }

    // Update Capsules & Collision
    for (let i = this.capsules.length - 1; i >= 0; i--) {
      const c = this.capsules[i];
      c.y += c.vy;
      c.pulse += 0.08;

      const halfW = c.width / 2;
      const halfH = c.height / 2;

      // 1. Check Collision with Player Spaceship Body
      const hitPlayer = Math.abs(c.x - this.player.x) < (halfW + 16) && Math.abs(c.y - this.player.y) < (halfH + 18);

      if (hitPlayer) {
        const encounter = this.encounterHistory.get(c.item.id);
        if (!c.item.isDanger) {
          // 🍀 호재 공시 비행선 직접 흡수 성공! (+120P, +연쇄콤보, +시총 10% 회복)
          if (encounter) encounter.countAbsorbed = (encounter.countAbsorbed || 0) + 1;
          this.combo++;
          if (this.combo > this.maxCombo) this.maxCombo = this.combo;
          const comboBonus = Math.min(60, (this.combo - 1) * 15);
          const earned = 120 + comboBonus;
          this.score += earned;

          const prevCap = this.marketCap;
          this.marketCap = Math.min(100, this.marketCap + 10);
          const healed = Math.round(this.marketCap - prevCap);

          this.sound.playCollect();
          if (this.combo % 3 === 0) this.sound.playCombo();

          this.addExplosion(c.x, c.y, '#10B981', 22);

          const comboTxt = this.combo > 1 ? ` (${this.combo}연쇄!)` : '';
          this.addFloatingText(`💚 흡수 성공! +${earned}P${comboTxt}`, c.x, c.y - 18, '#34D399', 16);
          this.addFloatingText(`[시총 +${healed}% 회복] ${c.item.keyword}`, c.x, c.y + 12, '#A7F3D0', 12);
        } else {
          // 💥 악재 지뢰와 비행선 직접 충돌! (-25% 시총 급락)
          if (encounter) encounter.countCollided = (encounter.countCollided || 0) + 1;
          this.combo = 0;
          this.marketCap -= 25;

          this.sound.playWarning();
          this.screenShakeTime = 18;
          this.addExplosion(c.x, c.y, '#EF4444', 24);

          this.addFloatingText(`💥 지뢰 직접 충돌! 시총 -25%`, c.x, c.y - 18, '#EF4444', 16);
          this.addFloatingText(`[${c.item.keyword}] 미사일로 격추해야 합니다!`, c.x, c.y + 12, '#FCA5A5', 12);

          if (this.marketCap <= 0) {
            this.triggerGameOver(`${c.item.keyword} 지뢰 충돌로 인한 시총 붕괴`);
            return;
          }
        }

        this.capsules.splice(i, 1);
        continue;
      }

      // 2. Check collision with missiles
      let hit = false;
      for (let j = this.missiles.length - 1; j >= 0; j--) {
        const m = this.missiles[j];
        if (
          m.x >= c.x - halfW &&
          m.x <= c.x + halfW &&
          m.y >= c.y - halfH &&
          m.y <= c.y + halfH
        ) {
          hit = true;
          this.missiles.splice(j, 1);
          break;
        }
      }

      if (hit) {
        const encounter = this.encounterHistory.get(c.item.id);
        if (encounter) encounter.countShot = (encounter.countShot || 0) + 1;

        if (c.item.isDanger) {
          // 🎯 악재 공시 요격 성공!
          this.combo++;
          if (this.combo > this.maxCombo) this.maxCombo = this.combo;
          const comboBonus = Math.min(50, (this.combo - 1) * 15);
          const earned = c.item.score + comboBonus;
          this.score += earned;

          this.sound.playExplosion();
          if (this.combo % 3 === 0) this.sound.playCombo();

          this.addExplosion(c.x, c.y, c.item.color, 24);
          this.screenShakeTime = 6;

          const comboTxt = this.combo > 1 ? ` (${this.combo}콤보!)` : '';
          this.addFloatingText(`🎯 요격 성공! +${earned}P${comboTxt}`, c.x, c.y - 15, '#FBBF24', 16);
          this.addFloatingText(`[상폐 방어: ${c.item.category}]`, c.x, c.y + 12, '#38BDF8', 12);
        } else {
          // 🚨 호재 공시 미사일 오발! (페널티)
          this.combo = 0;
          const penalty = c.item.penalty || 60;
          this.score = Math.max(0, this.score - penalty);
          this.marketCap -= 16; // 시총(HP) 감소

          this.sound.playWarning();
          this.addExplosion(c.x, c.y, '#EF4444', 14);
          this.screenShakeTime = 12;

          this.addFloatingText(`🚨 오발! 우량 공시 파괴 (-${penalty}P)`, c.x, c.y - 15, '#EF4444', 15);
          this.addFloatingText(`호재는 몸체로 흡수해야 합니다! (시총 -16%)`, c.x, c.y + 12, '#F87171', 12);

          if (this.marketCap <= 0) {
            this.triggerGameOver('우량 공시 파괴로 인한 투자자 신뢰 상실');
            return;
          }
        }

        this.capsules.splice(i, 1);
        continue;
      }

      // 3. Reached bottom (Player base)
      if (c.y > this.height - 30) {
        const encounter = this.encounterHistory.get(c.item.id);
        if (encounter) encounter.countMissed = (encounter.countMissed || 0) + 1;

        if (c.item.isDanger) {
          // 악재가 회사에 직격타!
          this.combo = 0;
          this.marketCap -= 20;
          this.sound.playWarning();
          this.screenShakeTime = 16;
          this.addExplosion(c.x, this.height - 40, '#DC2626', 20);
          this.addFloatingText(`⚠️ 악재 방치 직격타! 시총 -20%`, c.x, this.height - 70, '#EF4444', 15);
          this.addFloatingText(`[${c.item.keyword}] 미사일 요격 실패!`, c.x, this.height - 45, '#FCA5A5', 12);

          if (this.marketCap <= 0) {
            this.triggerGameOver(`${c.item.keyword} 방치로 인한 상장폐지`);
            return;
          }
        } else {
          // 호재는 자연스럽게 통과시킴
          this.addFloatingText(`💨 호재 놓침! (비행선으로 흡수하세요)`, c.x, this.height - 50, '#94A3B8', 12);
        }

        this.capsules.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 1 / p.life;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Update Floating Texts
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy;
      ft.alpha -= 0.025;
      if (ft.alpha <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }

    // Update Stars
    for (const star of this.stars) {
      star.y += star.speed;
      if (star.y > this.height) {
        star.y = 0;
        star.x = Math.random() * this.width;
      }
    }

    // Notify state to UI
    if (this.options.onStateChange) {
      this.options.onStateChange({
        state: this.gameState,
        score: this.score,
        marketCap: Math.max(0, Math.floor(this.marketCap)),
        combo: this.combo
      });
    }
  }

  draw() {
    this.ctx.save();

    // Screen Shake effect
    if (this.screenShakeTime > 0) {
      const dx = (Math.random() - 0.5) * this.screenShakeTime * 2.2;
      const dy = (Math.random() - 0.5) * this.screenShakeTime * 2.2;
      this.ctx.translate(dx, dy);
      this.screenShakeTime--;
    }

    // Clear Background with Dark Cyber Space Gradient
    const bgGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
    bgGrad.addColorStop(0, '#090D16');
    bgGrad.addColorStop(1, '#0F172A');
    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw Radar Grid Lines
    this.ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
    this.ctx.lineWidth = 1;
    const gridSize = 45;
    for (let x = 0; x < this.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Draw Stars
    for (const star of this.stars) {
      this.ctx.fillStyle = `rgba(148, 163, 184, ${star.alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw Bottom Defense Line (Company Market Cap Barrier)
    this.ctx.strokeStyle = this.marketCap > 30 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(239, 68, 68, 0.7)';
    this.ctx.lineWidth = 2;
    this.ctx.setLineDash([6, 6]);
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height - 35);
    this.ctx.lineTo(this.width, this.height - 35);
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Draw Missiles
    for (const m of this.missiles) {
      this.ctx.fillStyle = m.color;
      this.ctx.shadowColor = m.color;
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Laser Trail
      this.ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(m.x, m.y);
      this.ctx.lineTo(m.x, m.y + 12);
      this.ctx.stroke();
    }
    this.ctx.shadowBlur = 0;

    // Draw Capsules
    for (const c of this.capsules) {
      const halfW = c.width / 2;
      const halfH = c.height / 2;
      const cx = c.x;
      const cy = c.y;

      // Glow outline
      const glowColor = c.item.color;
      const pulseSize = Math.sin(c.pulse) * 3;

      this.ctx.shadowColor = glowColor;
      this.ctx.shadowBlur = 12 + pulseSize;

      // Capsule Background
      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      this.ctx.strokeStyle = glowColor;
      this.ctx.lineWidth = 2;

      this.roundRect(cx - halfW, cy - halfH, c.width, c.height, 12, true, true);
      this.ctx.shadowBlur = 0;

      // Category Pill Tag & Action Instruction
      this.ctx.fillStyle = glowColor;
      this.ctx.font = 'bold 9.5px Pretendard, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      const actionBadge = c.item.isDanger ? '🎯 [미사일 격추]' : '🍀 [몸으로 획득]';
      this.ctx.fillText(`${actionBadge} ${c.item.category}`, cx, cy - 9);

      // Disclosure Keyword Text
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.font = 'bold 12.5px Pretendard, sans-serif';
      this.ctx.fillText(c.item.keyword, cx, cy + 9);
    }

    // Draw Player Turret (Spaceship)
    this.drawPlayer();

    // Draw Particles
    for (const p of this.particles) {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;

    // Draw Floating Texts
    for (const ft of this.floatingTexts) {
      this.ctx.fillStyle = ft.color;
      this.ctx.globalAlpha = Math.max(0, ft.alpha);
      this.ctx.font = `bold ${ft.size}px Pretendard, sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
    }
    this.ctx.globalAlpha = 1;

    this.ctx.restore();
  }

  drawPlayer() {
    const px = this.player.x;
    const py = this.player.y;

    this.ctx.save();
    this.ctx.translate(px, py);

    // Engine Thruster Glow
    const thrust = Math.random() * 6 + 10;
    const thrusterGrad = this.ctx.createRadialGradient(0, 20, 2, 0, 20 + thrust, thrust);
    thrusterGrad.addColorStop(0, '#38BDF8');
    thrusterGrad.addColorStop(1, 'transparent');
    this.ctx.fillStyle = thrusterGrad;
    this.ctx.beginPath();
    this.ctx.arc(0, 20, thrust, 0, Math.PI * 2);
    this.ctx.fill();

    // Spaceship Hull
    this.ctx.shadowColor = '#06B6D4';
    this.ctx.shadowBlur = 14;

    // Main Body
    this.ctx.fillStyle = '#0F172A';
    this.ctx.strokeStyle = '#38BDF8';
    this.ctx.lineWidth = 2.5;

    this.ctx.beginPath();
    this.ctx.moveTo(0, -22); // Nose
    this.ctx.lineTo(20, 18); // Right wing
    this.ctx.lineTo(7, 12);  // Right inner
    this.ctx.lineTo(0, 15);  // Center
    this.ctx.lineTo(-7, 12); // Left inner
    this.ctx.lineTo(-20, 18);// Left wing
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Cockpit / Radar Core
    this.ctx.fillStyle = '#10B981';
    this.ctx.beginPath();
    this.ctx.arc(0, -2, 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Dual Cannons
    this.ctx.strokeStyle = '#FBBF24';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(-16, -6, 3, 12);
    this.ctx.strokeRect(13, -6, 3, 12);

    this.ctx.restore();
  }

  roundRect(x, y, w, h, radius, fill, stroke) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + w, y, x + w, y + h, radius);
    this.ctx.arcTo(x + w, y + h, x, y + h, radius);
    this.ctx.arcTo(x, y + h, x, y, radius);
    this.ctx.arcTo(x, y, x + w, y, radius);
    this.ctx.closePath();
    if (fill) this.ctx.fill();
    if (stroke) this.ctx.stroke();
  }

  loop() {
    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }
}
