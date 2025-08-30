import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// ${import.meta.env.VITE_API_URL}
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/api": `http://localhost:3000/api`,
    },
  },
});
