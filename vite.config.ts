import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: "VITE_",
  optimizeDeps: {
    include: ["@emotion/styled"],
  },
  preview: {
    port: 9898,
    host: true,
    allowedHosts: true,
  },
  server: {
    port: 9898,
  },
});
