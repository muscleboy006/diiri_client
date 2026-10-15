import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    allowedHosts: true, // разрешаем домен ngrok
    // proxy: { 
    //   "/api": "http://localhost:3000", 
    //   "/uploads": "http://localhost:3000", 
    // },
      proxy: { 
      "/api": "http://75.119.138.244:3000", 
      "/uploads": "http://75.119.138.244:3000", 
    },
  },
});