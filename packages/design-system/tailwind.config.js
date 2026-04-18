/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        cyber: {
          background: "#0F111A",
          surface: "#171923",
          "surface-elevated": "#202433",
          "surface-active": "#2D3245",
          primary: "#00E5FF", // Neon Cyan
          secondary: "#2962FF", // Deep Blue
          alert: "#FF1744", // High Alert Red
          warning: "#FFD600", // Medium Alert Yellow
          success: "#00E676", // Success Green
          forensic: "#FF9100", // DFIR Amber
          "blue-team": "#00B0FF", // Azure
          
          // Trust Zones
          "zone-ht": "#FFFFFF", // High Trust
          "zone-mt": "#A0AEC0", // Moderate Trust
          "zone-lt": "#FF9100", // Low Trust (Internal)
          "zone-qt": "#FF1744", // Quarantine
          
          // Evidence States
          "ev-proposed": "#718096",
          "ev-acquired": "#00E5FF",
          "ev-hashed": "#00E676",
          "ev-analyzing": "#2962FF",
          "ev-reported": "#00E5FF",
        }
      },
      fontFamily: {
        mono: ['"Fira Code"', '"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        'cyber-xs': ['10px', '14px'],
        'cyber-sm': ['12px', '16px'],
        'cyber-md': ['14px', '20px'],
        'cyber-lg': ['18px', '24px'],
      },
      boxShadow: {
        'glow-primary': '0 0 10px rgba(0, 229, 255, 0.4)',
        'glow-alert': '0 0 10px rgba(255, 23, 68, 0.4)',
        'glow-forensic': '0 0 10px rgba(255, 145, 0, 0.4)',
        'glow-success': '0 0 10px rgba(0, 230, 118, 0.4)',
      },
      borderWidth: {
        '3': '3px',
      },
      opacity: {
        '85': '.85',
      }
    },
  },
  plugins: [],
}
