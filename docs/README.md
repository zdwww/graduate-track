# GraduateTrack — Frontend

The React + Vite single-page app for **GraduateTrack**, a graduate-school
application tracker. It consumes the Express + MongoDB API in
[`../backend`](../backend).

See the [project README](../README.md) for the full overview, the live URL,
and end-to-end setup.

## Develop

```bash
npm install
npm run dev      # Vite dev server (expects the backend at http://localhost:3000)
npm run build    # production build to docs/dist
npm run lint     # ESLint
```

The API base URL is resolved in `src/helpers/constants/apis.js`: `localhost`
uses the local backend, anything else uses the deployed Render API.
