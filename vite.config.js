import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: true,
    // proxy: {
    //   "/api": "https://diiri-cargo.duckdns.org",
    //   "/uploads": "https://diiri-cargo.duckdns.org",
    // },
    // proxy: {
    //   "/api": "http://localhost:3000",
    //   "/uploads": "http://localhost:3000",
    // },
  },
});