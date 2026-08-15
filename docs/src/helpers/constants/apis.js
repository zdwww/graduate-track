// Local-dev escape hatch. Set VITE_API_BASE in a git-ignored docs/.env.local to
// aim the dev server at a different backend (e.g. the deployed Render API) without
// editing tracked code. CI never defines it, so the production bundle keeps using
// the hostname fallback below and GitHub Pages behaviour is unchanged.
const override = import.meta.env.VITE_API_BASE;

const isLocal =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

export const API_BASE =
  override ||
  (isLocal
    ? "http://localhost:3000/api"
    : "https://graduate-track-api.onrender.com/api");
