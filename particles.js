/* ============================================
   PORTFOLIO - PARTICLE CANVAS ANIMATION
   ============================================ */

(function () {
  'use strict';

  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let width, height;
  let particles = [];
  let mouse = { x: -9999, y: -9999 };

  const CONFIG = {
    count: 100,
    maxRadius: 3,
    minRadius: 1,
    speed: 0.4,
    connectDistance: 120,
    mouseRepelDistance: 150,
    mouseRepelForce: 0.06,
    colors: [
      'rgba(124, 58, 237, ALPHA)',   // purple
      'rgba(157, 93, 247, ALPHA)',   // purple light
      'rgba(6,  182, 212, ALPHA)',   // cyan
      'rgba(34, 211, 238, ALPHA)',   // cyan light
      'rgba(167, 139, 250, ALPHA)',  // lavender
    ],
    lineOpacityMax: 0.25,
    bgColor: '#0f0f1a',
  };

  /* ---- RESIZE ---- */
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  /* ---- MOUSE ---- */
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  /* ---- PARTICLE CLASS ---- */
  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial) {
      this.x = initial ? Math.random() * width : Math.random() * width;
      this.y = initial ? Math.random() * height : Math.random() * height;
      this.vx = (Math.random() - 0.5) * CONFIG.speed * 2;
      this.vy = (Math.random() - 0.5) * CONFIG.speed * 2;
      this.radius = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
      this.opacity = 0.3 + Math.random() * 0.5;
      const colorTemplate = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
      this.color = colorTemplate.replace('ALPHA', this.opacity.toFixed(2));
    }

    update() {
      // Mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distSq = dx * dx + dy * dy;
      const repelDistSq = CONFIG.mouseRepelDistance * CONFIG.mouseRepelDistance;

      if (distSq < repelDistSq && distSq > 0) {
        const dist = Math.sqrt(distSq);
        const force = (CONFIG.mouseRepelDistance - dist) / CONFIG.mouseRepelDistance;
        this.vx += (dx / dist) * force * CONFIG.mouseRepelForce * 3;
        this.vy += (dy / dist) * force * CONFIG.mouseRepelForce * 3;
      }

      // Velocity damping
      this.vx *= 0.995;
      this.vy *= 0.995;

      // Keep minimum speed
      const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (speed < 0.05) {
        this.vx += (Math.random() - 0.5) * 0.04;
        this.vy += (Math.random() - 0.5) * 0.04;
      }

      this.x += this.vx;
      this.y += this.vy;

      // Bounce off edges
      if (this.x < this.radius) { this.x = this.radius; this.vx = Math.abs(this.vx); }
      if (this.x > width - this.radius) { this.x = width - this.radius; this.vx = -Math.abs(this.vx); }
      if (this.y < this.radius) { this.y = this.radius; this.vy = Math.abs(this.vy); }
      if (this.y > height - this.radius) { this.y = height - this.radius; this.vy = -Math.abs(this.vy); }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  /* ---- INIT ---- */
  function initParticles() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(new Particle());
    }
  }

  /* ---- DRAW CONNECTIONS ---- */
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.connectDistance) {
          const opacity = (1 - dist / CONFIG.connectDistance) * CONFIG.lineOpacityMax;

          // Alternate between purple and cyan gradient lines
          const gradient = ctx.createLinearGradient(
            particles[i].x, particles[i].y,
            particles[j].x, particles[j].y
          );
          gradient.addColorStop(0, `rgba(124, 58, 237, ${opacity})`);
          gradient.addColorStop(1, `rgba(6, 182, 212, ${opacity})`);

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  /* ---- ANIMATION LOOP ---- */
  function animate() {
    ctx.clearRect(0, 0, width, height);

    drawConnections();

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(animate);
  }

  /* ---- START ---- */
  resize();
  initParticles();
  animate();

})();