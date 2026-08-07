/**
 * EL Journal - Full-Screen Welcome / Loading Screen Component
 * Uses tsParticles background script (particles-bg.js) with 5-second progress bar animation and smooth exit transition.
 */

(function () {
  'use strict';

  // 1. Get pre-rendered Welcome Overlay from HTML
  const overlay = document.getElementById('welcome-screen-overlay');
  if (!overlay) return;

  // Lock scrolling while loading screen is active
  document.body.style.overflow = 'hidden';

  // 2. Progress Bar & Animated Loading Dots
  const progressBar = document.getElementById('welcome-progress-bar');
  const loadingTxt = document.getElementById('welcome-loading-txt');

  let progress = 0;
  const duration = 5000; // 5 seconds fill time
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

      // 3. Exit Transition: Scale down & fade out overlay smoothly
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
