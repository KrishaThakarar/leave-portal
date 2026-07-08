// vite.config.js
// Configures the Vite dev server for our React app.
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // During development, any request starting with /api is forwarded to the
    // Express backend on port 3000. This avoids CORS headaches and lets the
    // frontend call "/api/..." as if it were the same server.
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
