/**
 * Runs before hydration (injected via a plain <script>, not a React
 * component) so the correct theme class is on <html> before first paint.
 * Priority: explicit user choice in localStorage ("theme": "light"|"dark")
 * > the OS-level system preference. No stored value = always follow system.
 */
export const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = stored === 'dark' || (stored !== 'light' && systemDark);
    document.documentElement.classList.toggle('dark', isDark);
  } catch (e) {}
})();
`;
