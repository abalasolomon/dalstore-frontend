/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // React files
  ],
  theme: {
    extend: {
      colors: {
        primary: "#f97316", // orange-500 as your main brand color
      },
    },
  },
  plugins: [],
};
