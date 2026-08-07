/**
 * EL Journal - Full-Screen Welcome / Loading Screen Component
 * Smooth entrance animation, particle backdrop, glassmorphism badge, progress bar, and session storage guard.
 */

(function () {
  'use strict';

  // Prevent scrolling while loading screen is active
  document.body.style.overflow = 'hidden';

  // 2. Inject Welcome Overlay DOM Structure
  const overlay = document.createElement('div');
  overlay.id = 'welcome-screen-overlay';
  overlay.innerHTML = `
    <canvas id="welcome-canvas"></canvas>
    <div class="welcome-content">
      <div class="welcome-icons-row">
        <div class="welcome-icon-box" title="Journal / Blog">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <div class="welcome-icon-box" title="Code / Development">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
        </div>
        <div class="welcome-icon-box" title="UI/UX Design">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m4.93 4.93 4.24 4.24"></path>
            <path d="m14.83 9.17 4.24-4.24"></path>
            <path d="m14.83 14.83 4.24 4.24"></path>
            <path d="m9.17 14.83-4.24 4.24"></path>
          </svg>
        </div>
      </div>
      <div class="welcome-title-subtitle">Welcome To</div>
      <h1 class="welcome-title-main">EL JOURNAL WEBSITE</h1>
      <div class="welcome-progress-wrap" style="margin-top: 16px;">
        <div class="welcome-progress-track">
          <div class="welcome-progress-fill" id="welcome-progress-bar"></div>
        </div>
        <div class="welcome-loading-text" id="welcome-loading-txt">Loading.</div>
      </div>
    </div>
  `;

  document.body.prepend(overlay);

  // 3. Floating Particle Canvas Background
  const canvas = document.getElementById('welcome-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2 };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
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

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 91, 68, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#A5150C';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw connection lines
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

    // Clean up particle loop when overlay is removed
    overlay.addEventListener('transitionend', () => {
      cancelAnimationFrame(animId);
    });
  }

  // 4. Progress Bar & Animated Loading Dots
  const progressBar = document.getElementById('welcome-progress-bar');
  const loadingTxt = document.getElementById('welcome-loading-txt');

  let progress = 0;
  const duration = 10000; // 10 seconds fill time
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

      // 5. Exit Transition: Scale down & fade out overlay
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
