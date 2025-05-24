import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteMockServe } from "vite-plugin-mock";
import { qrcode } from "vite-plugin-qrcode";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteMockServe({
      // default
      mockPath: "mock",
      enable: true,
    }),
    qrcode(), // only applies in dev mode
  ],
  server: { host: "0.0.0.0", port: 8000 },
  base: "/depth-image-react-three-fiber/",
});
