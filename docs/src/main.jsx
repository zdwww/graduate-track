import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Self-hosted rather than pulled from a font CDN: no third-party request, it works
// offline, and the build fingerprints the woff2 files like any other asset. Only the
// weight axis is imported — the app uses no italics anywhere, and :root sets
// font-synthesis: none, so an italic face would be dead weight.
import "@fontsource-variable/source-serif-4/wght.css";
import "@fontsource-variable/inter/wght.css";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
