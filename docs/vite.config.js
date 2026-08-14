import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const BASE = "/graduate-track/";

// The two latin subsets are the only font files an English page ever requests, but the
// browser cannot discover them until it has fetched and parsed the CSS that references
// them. On a cold load that lost race paints the hero in the fallback face and reflows
// when the real font lands — Lighthouse measured it as a 0.171 cumulative layout shift
// on one run and 0 on the next, which is exactly the coin-flip a preload removes.
// The filenames are content-hashed, so they have to be read back off the bundle.
const preloadLatinFonts = () => ({
  name: "preload-latin-fonts",
  apply: "build",
  transformIndexHtml(html, ctx) {
    const fonts = Object.keys(ctx.bundle ?? {}).filter((file) =>
      /(?<!-ext)-latin-wght-normal-[^/]*\.woff2$/.test(file),
    );
    return {
      html,
      tags: fonts.map((file) => ({
        tag: "link",
        attrs: {
          rel: "preload",
          as: "font",
          type: "font/woff2",
          href: BASE + file,
          crossorigin: "",
        },
        injectTo: "head",
      })),
    };
  },
});

// https://vite.dev/config/
export default defineConfig({
  // Served from https://zdwww.github.io/graduate-track/ — must be root-absolute
  // with a trailing slash. "./" would break deep links (relative asset URLs).
  base: BASE,
  plugins: [react(), preloadLatinFonts()],
  // Must match ALLOWED_ORIGINS in backend/index.js, or every request fails CORS.
  server: { port: 5174, strictPort: true },
});
