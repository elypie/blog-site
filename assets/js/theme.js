/* Ely's Blog - Global Theme System Manager */
(function () {
  const THEME_KEY = 'elys_theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  function applyTheme(theme) {
    const isLight = theme === 'light';
    
    // Apply data-theme attribute and class to html root immediately
    if (document.documentElement) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.className = theme + '-theme';
    }
    
    // Apply data-theme attribute and class to body
    if (document.body) {
      document.body.setAttribute('data-theme', theme);
      if (isLight) {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
      }
    }

    // Sync toggle button icons across the DOM
    updateToggleIcons(theme);

    // Sync particle container visibility
    toggleParticles(theme);

    // Dispatch custom theme change event
    window.dispatchEvent(new CustomEvent('elys-theme-changed', { detail: { theme } }));
  }

  function updateToggleIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    const isLight = theme === 'light';

    toggleBtns.forEach(btn => {
      btn.style.display = 'inline-flex';
      if (isLight) {
        // Moon Icon (click to switch to Dark Mode)
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>`;
        btn.setAttribute('title', 'Switch to Dark Mode');
        btn.setAttribute('aria-label', 'Switch to Dark Mode');
      } else {
        // Sun Icon (click to switch to Light Mode)
        btn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>`;
        btn.setAttribute('title', 'Switch to Light Mode');
        btn.setAttribute('aria-label', 'Switch to Light Mode');
      }
    });
  }

  function toggleParticles(theme) {
    const isLight = theme === 'light';
    const homeParticles = document.getElementById('tsparticles');
    const welcomeParticles = document.getElementById('welcome-tsparticles');
    if (homeParticles) {
      homeParticles.style.display = isLight ? 'none' : 'block';
    }
    if (welcomeParticles) {
      welcomeParticles.style.display = isLight ? 'none' : 'block';
    }
  }

  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
  }

  // 1. Synchronous Execution at parse-time (before DOM paint)
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Observer to guarantee body gets attribute as soon as body is created by browser parser
  if (document.documentElement) {
    const observer = new MutationObserver(() => {
      if (document.body) {
        document.body.setAttribute('data-theme', getPreferredTheme());
        document.body.className = getPreferredTheme() + '-theme';
        observer.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true });
  }

  // 2. Re-apply and bind event listeners when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getPreferredTheme());

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    });
  });

  // 3. Listen for OS theme changes if no manual preference is saved
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Export Global Theme Controller
  window.ElysTheme = {
    getTheme: getPreferredTheme,
    setTheme: setTheme,
    toggleTheme: toggleTheme,
    applyTheme: applyTheme
  };
})();
