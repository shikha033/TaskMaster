import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8080,
    // Forward API calls to the Express server during development.
    proxy: {
      "/api": { target: "http://localhost:5000", changeOrigin: true },
    },
  },
  plugins: [react()],
});
