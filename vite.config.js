import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base keeps asset paths valid on any GitHub Pages URL.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
