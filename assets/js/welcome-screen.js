/**
 * EL Journal - Full-Screen Welcome / Loading Screen Component
 * Solid dark background completely covering homepage, tsParticles red constellation background, 2.6s progress fill, and smooth reveal transition.
 */

(function () {
  'use strict';

  // 1. Get pre-rendered Welcome Overlay from HTML
  const overlay = document.getElementById('welcome-screen-overlay');
  if (!overlay) return;

  // Check if inline script already hid overlay for internal navigation
  if (overlay.style.display === 'none') {
    overlay.remove();
    return;
  }

  // Check navigation type and referrer
  const navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  const isReload = navEntry && navEntry.type === 'reload';
  const isInitialOpen = !document.referrer || !document.referrer.includes(window.location.host);

  // If navigating from an internal subpage (e.g. profile.html or blogs.html), skip welcome screen
  if (!isReload && !isInitialOpen) {
    overlay.remove();
    return;
  }

  // Lock scrolling while loading screen is active
  document.body.style.overflow = 'hidden';

  // 2. Particle backgrounds disabled as per design specification
  function initWelcomeParticles() {
    const welcomeParticlesContainer = document.getElementById('welcome-tsparticles');
    if (welcomeParticlesContainer) welcomeParticlesContainer.style.display = 'none';
  }

  initWelcomeParticles();

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
