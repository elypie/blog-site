/* Ely's Blog - tsParticles Background Script */

(function () {
  function initParticles() {
    // Hide particles completely if Light Mode is active
    let container = document.getElementById('tsparticles');
    if (document.body.classList.contains('light-theme') || document.documentElement.classList.contains('light-theme')) {
      if (container) container.style.display = 'none';
      return;
    }

    // Render particle background on Home page and Welcome page
    const path = window.location.pathname.toLowerCase();
    const isHomeOrWelcome = path.endsWith('/') || path.endsWith('/index.html') || path.includes('index.html') || path.includes('welcome.html') || (path.split('/').pop() === '');
    if (!isHomeOrWelcome) {
      return;
    }

    if (typeof tsParticles === 'undefined') {
      console.warn('tsParticles library not loaded yet.');
      return;
    }

    // Ensure particle container element exists
    let container = document.getElementById('tsparticles');
    if (!container) {
      container = document.createElement('div');
      container.id = 'tsparticles';
      document.body.prepend(container);
    }

    // Set inline container styles to guarantee fixed background behind content
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.right = '0';
    container.style.bottom = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.zIndex = '0';
    container.style.pointerEvents = 'none';

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    tsParticles.load("tsparticles", {
      fpsLimit: 120,
      fullScreen: {
        enable: true,
        zIndex: 0
      },
      particles: {
        color: {
          value: ["#A5150C", "#FF3333", "#DC2626"]
        },
        links: {
          color: "#A5150C",
          distance: 140,
          enable: true,
          opacity: 0.4,
          width: 1.2,
          shadow: {
            enable: true,
            color: "#A5150C",
            blur: 5
          }
        },
        move: {
          direction: "none",
          enable: !prefersReducedMotion,
          outModes: {
            default: "out"
          },
          random: true,
          speed: prefersReducedMotion ? 0 : 0.8,
          straight: false
        },
        number: {
          density: {
            enable: true,
            area: 800
          },
          value: 100
        },
        opacity: {
          value: { min: 0.4, max: 0.85 },
          animation: {
            enable: !prefersReducedMotion,
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
            mode: "repel",
            parallax: {
              enable: !prefersReducedMotion,
              force: 50,
              smooth: 10
            }
          },
          resize: true
        },
        modes: {
          repel: {
            distance: 130,
            duration: 0.4,
            factor: 5,
            speed: 1,
            maxSpeed: 50,
            easing: "ease-out-quad"
          }
        }
      },
      detectRetina: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initParticles);
  } else {
    initParticles();
  }
})();
