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

  // 2. Load exact tsParticles red constellation particle engine on Welcome Screen
  function initWelcomeParticles() {
    if (typeof tsParticles === 'undefined') {
      setTimeout(initWelcomeParticles, 100);
      return;
    }

    const welcomeParticlesContainer = document.getElementById('welcome-tsparticles');
    if (!welcomeParticlesContainer) return;

    tsParticles.load("welcome-tsparticles", {
      fpsLimit: 120,
      fullScreen: {
        enable: false
      },
      particles: {
        color: {
          value: ["#AC5045", "#DFA05D", "#658761"]
        },
        links: {
          color: "#AC5045",
          distance: 140,
          enable: true,
          opacity: 0.2,
          width: 1.2,
          shadow: {
            enable: true,
            color: "#AC5045",
            blur: 5
          }
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out"
          },
          random: true,
          speed: 0.8,
          straight: false
        },
        number: {
          density: {
            enable: true,
            area: 800
          },
          value: 90
        },
        opacity: {
          value: { min: 0.4, max: 0.85 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.3,
            sync: false
          }
        },
        shape: {
          type: "circle"
        },
        size: {
          value: { min: 2, max: 4.5 }
        },
        shadow: {
          enable: true,
          color: "#A5150C",
          blur: 8
        }
      },
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: {
            enable: true,
            mode: "repel"
          }
        },
        modes: {
          repel: {
            distance: 120,
            duration: 0.4
          }
        }
      }
    });
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
