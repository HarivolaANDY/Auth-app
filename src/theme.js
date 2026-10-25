// Theme Manager (Dark / Light Mode)

export function initTheme() {
  const isDark = document.documentElement.classList.contains('dark') ||
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

  setTheme(isDark ? 'dark' : 'light');

  // Attach event listener to all theme toggle buttons on the page
  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const currentDark = document.documentElement.classList.contains('dark');
      setTheme(currentDark ? 'light' : 'dark');
    });
  });

  // Listen to system preference changes if user hasn't explicitly set a preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

export function setTheme(mode) {
  const isDark = mode === 'dark';
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }

  // Update theme toggle button icons and labels
  document.querySelectorAll('.theme-toggle').forEach((btn) => {
    const sunIcon = btn.querySelector('.icon-sun');
    const moonIcon = btn.querySelector('.icon-moon');
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    btn.setAttribute('title', isDark ? 'Mode clair' : 'Mode sombre');

    if (sunIcon && moonIcon) {
      if (isDark) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      }
    }
  });
}
