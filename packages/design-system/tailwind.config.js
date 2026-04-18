/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        cyber: {
          background: "#0F111A",
          surface: "#171923",
          "surface-elevated": "#202433",
          primary: "#00E5FF",
          secondary: "#2962FF",
          alert: "#FF1744",
          forensic: "#FF9100",
          "blue-team": "#00B0FF",
          success: "#00E676"
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', '"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 10px rgba(0, 229, 255, 0.5), 0 0 20px rgba(0, 229, 255, 0.3)',
        'glow-alert': '0 0 10px rgba(255, 23, 68, 0.5), 0 0 20px rgba(255, 23, 68, 0.3)',
        'glow-forensic': '0 0 10px rgba(255, 145, 0, 0.5), 0 0 20px rgba(255, 145, 0, 0.3)',
        'glow-success': '0 0 10px rgba(0, 230, 118, 0.5), 0 0 20px rgba(0, 230, 118, 0.3)',
      }
    },
  },
  plugins: [],
}
