
# SDH Chat Frontend (React + Vite + TypeScript + Material UI)

## Quick start
```bash
yarn
cp .env.example .env   # adjust VITE_BACKEND_URL if needed
yarn dev
```

## Scripts
- `yarn dev` — run Vite dev server
- `yarn build` — production build
- `yarn preview` — preview build
- `yarn lint` — run ESLint

## Notes
- Connects to Socket.IO backend at `VITE_BACKEND_URL`.
- Shows "NUEVO MENSAJE" badge when new messages arrive from a user different to the open chat.
