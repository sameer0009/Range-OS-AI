/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui-components/src/**/*.{js,ts,jsx,tsx}"
  ],
  presets: [
    require('@rangeos/design-system/tailwind.config.js')
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
