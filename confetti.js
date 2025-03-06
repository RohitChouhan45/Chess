export class ConfettiCelebration {
  constructor() {
    this.confetti = [];
    this.colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    this.canvas = null;
    this.ctx = null;
    this.animationId = null;
    this.particleCount = 200; // Increased particle count
  }

  init() {
    if (this.canvas) {
      document.body.removeChild(this.canvas);
    }
    
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    document.body.appendChild(this.canvas);
    
    this.ctx = this.canvas.getContext('2d');
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createConfetti(count = this.particleCount) {
    this.confetti = [];
    for (let i = 0; i < count; i++) {
      this.confetti.push({
        x: Math.random() * this.canvas.width,
        y: -20 - Math.random() * 100, // Stagger starting positions
        size: Math.random() * 15 + 5, // Increased size variation
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        speed: Math.random() * 7 + 3, // Increased speed
        angle: Math.random() * Math.PI * 2,
        rotation: Math.random() * 0.2 - 0.1,
        oscillationSpeed: Math.random() * 0.03 + 0.02,
        oscillationDistance: Math.random() * 40 + 40
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    let shouldContinue = false;
    
    this.confetti.forEach(piece => {
      piece.y += piece.speed;
      piece.x += Math.sin(piece.angle) * piece.oscillationDistance;
      piece.angle += piece.oscillationSpeed;
      
      this.ctx.save();
      this.ctx.translate(piece.x, piece.y);
      this.ctx.rotate(piece.angle);
      
      this.ctx.fillStyle = piece.color;
      this.ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
      
      this.ctx.restore();
      
      if (piece.y < this.canvas.height + 20) {
        shouldContinue = true;
      }
    });
    
    if (shouldContinue) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.stop();
    }
  }

  start() {
    this.init();
    this.createConfetti();
    this.animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}