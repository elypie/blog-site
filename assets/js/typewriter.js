/* Ely's Blog - Typewriter Animation Script */

(function () {
  function initTypewriter() {
    const textElement = document.getElementById('hero-typewriter-text');
    if (!textElement) return;

    const titles = [
      "BS Information Technology",
      "UI/UX Enthusiast"
    ];

    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      textElement.textContent = titles[0];
      const cursor = document.querySelector('.typewriter-cursor');
      if (cursor) cursor.style.display = 'none';
      return;
    }

    function typeStep() {
      const currentTitle = titles[titleIndex % titles.length];

      if (isDeleting) {
        charIndex--;
        textElement.textContent = currentTitle.substring(0, charIndex);
      } else {
        charIndex++;
        textElement.textContent = currentTitle.substring(0, charIndex);
      }

      let stepSpeed = isDeleting ? 35 : 75;

      if (!isDeleting && charIndex === currentTitle.length) {
        stepSpeed = 2000; // Pause for 2 seconds after full text is typed
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex++;
        stepSpeed = 400; // Pause brief moment before typing next title
      }

      setTimeout(typeStep, stepSpeed);
    }

    typeStep();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTypewriter);
  } else {
    initTypewriter();
  }
})();
