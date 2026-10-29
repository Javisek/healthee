const toggle = document.getElementById("theme-toggle");
const icon = document.getElementById("theme-icon");
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const isDark = theme === "dark";
  icon.textContent = isDark ? "☀️" : "🌙";
  toggle.setAttribute(
    "aria-label",
    isDark ? "light mode" : "dark mode"
  );
  toggle.setAttribute("aria-pressed", String(isDark));
}

// Use the saved theme, or follow the device preference.
const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)"
).matches;

setTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

toggle.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme");
  setTheme(currentTheme === "dark" ? "light" : "dark");
});
