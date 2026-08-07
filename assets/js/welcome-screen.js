/**
 * EL Journal - Full-Screen Welcome / Loading Screen Component
 * Solid dark background completely covering homepage, glowing red constellation particles, 2.6s progress fill, and smooth reveal transition.
 */

(function () {
  'use strict';

  // 1. Get pre-rendered Welcome Overlay from HTML
  const overlay = document.getElementById('welcome-screen-overlay');
  if (!overlay) return;

  // Prevent scrolling while loading screen is active
  document.body.style.overflow = 'hidden';

  // 2. Floating Red Constellation Particle Canvas Background
  const canvas = document.getElementById('welcome-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particlesCount = Math.min(Math.floor(window.innerWidth / 18), 50);
    const particles = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.3
      });
    }

    let animId;
    function renderParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Draw glowing red particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 91, 68, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#A5150C';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connecting red lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(165, 21, 12, ${0.15 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(renderParticles);
    }
    renderParticles();

    overlay.addEventListener('transitionend', () => {
      cancelAnimationFrame(animId);
    });
  }

  // 3. Progress Bar & Animated Loading Dots
  const progressBar = document.getElementById('welcome-progress-bar');
  const loadingTxt = document.getElementById('welcome-loading-txt');

  let progress = 0;
  const duration = 2600; // 2.6 seconds fill time
  const startTime = performance.now();

  const dots = ['Loading.', 'Loading..', 'Loading...'];
  let dotIdx = 0;
  const dotInterval = setInterval(() => {
    dotIdx = (dotIdx + 1) % dots.length;
    if (loadingTxt) loadingTxt.textContent = dots[dotIdx];
  }, 400);

  function animateProgress(currentTime) {
    const elapsed = currentTime - startTime;
    progress = Math.min((elapsed / duration) * 100, 100);

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (progress < 100) {
      requestAnimationFrame(animateProgress);
    } else {
      clearInterval(dotInterval);
      if (loadingTxt) loadingTxt.textContent = 'Loading...';

      // 4. Exit Transition: Scale down & fade out overlay, smoothly revealing homepage
      setTimeout(() => {
        overlay.classList.add('welcome-hidden');
        document.body.style.overflow = '';

        setTimeout(() => {
          overlay.remove();
        }, 600);
      }, 300);
    }
  }

  requestAnimationFrame(animateProgress);
})();
