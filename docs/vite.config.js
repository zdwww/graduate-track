import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  // Served from https://zdwww.github.io/graduate-track/ — must be root-absolute
  // with a trailing slash. "./" would break deep links (relative asset URLs).
  base: "/graduate-track/",
  plugins: [react()],
  // Must match ALLOWED_ORIGINS in backend/index.js, or every request fails CORS.
  server: { port: 5174, strictPort: true },
});
