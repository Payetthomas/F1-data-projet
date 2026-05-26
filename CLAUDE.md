# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

F1 Dashboard: a race result prediction app using historical Kaggle data. A scikit-learn model predicts a driver's finish position from their grid position, `driverId`, and `raceId`. The frontend visualises results; the backend serves the model via FastAPI.

## Commands

### Backend (port 8000)
```bash
cd backend
source venv/bin/activate          # Windows: venv/Scripts/activate
python main.py                     # starts uvicorn with hot-reload
```

### Frontend (port 5173)
```bash
cd frontend
npm run dev                        # dev server
npm run build                      # production build
npm run lint                       # ESLint
```

### Add a shadcn component
```bash
cd frontend
npx shadcn@latest add <component>  # e.g. button, card, table
```
> Note: `npx shadcn@latest init` requires interactive TTY input — use `npx shadcn@latest add` for adding individual components. If the network has SSL issues, set `npm config set strict-ssl false` first.

## Architecture

### Backend — `backend/main.py`
Single-file FastAPI app. Two routes:
- `GET /api/results` — placeholder, returns empty list
- `POST /api/predict` — takes `{ grid, driverId, raceId }`, returns `{ predicted_position }`

The ML model is loaded once at startup from `backend/model.pkl` (gitignored). If the file is absent, `/api/predict` returns an error instead of crashing. **The model must be trained and saved as `model.pkl` before prediction works.** CORS is pre-configured for `localhost:5173` and `5174`.

### Frontend — `frontend/src/`
- **`api.ts`** — all fetch calls to the backend, `BASE_URL = http://localhost:8000`. Functions are placeholders; routes will be added to the backend as they are implemented.
- **`App.tsx`** — top-level layout only; no business logic yet.
- **`lib/utils.ts`** — `cn()` helper (clsx + tailwind-merge).
- **`components/ui/`** — shadcn-generated components land here.

### Styling
Tailwind **v3** (not v4). shadcn is configured in `components.json` with Radix + Lucide + CSS variables. Theme tokens (light/dark) are defined as CSS custom properties in `src/index.css`. The `@apply border-border` and `@apply bg-background` warnings in VS Code are false positives — they compile correctly.

### ML pipeline
The notebook (`notebook/`) is where data prep and model training happen. The trained model is exported to `backend/model.pkl`. The model currently uses three features: `grid`, `driverId`, `raceId`.
