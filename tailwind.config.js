/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#2563EB',      // Trust, professionalism, education
          green: '#10B981',     // Successful actions, student presence
          amber: '#F59E0B',     // Warnings, late attendance
          red: '#EF4444',       // Errors, deletions, absences
          cyan: '#06B6D4',      // Informational states, excused absences
        },
        background: {
          light: '#F3F4F6',     // Light gray background
          white: '#FFFFFF',     // White cards
        }
      }
    },
  },
  plugins: [],
}
