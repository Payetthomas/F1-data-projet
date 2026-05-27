---
title: F1 Data Project
emoji: 🏎️
colorFrom: red
colorTo: gray
sdk: docker
pinned: false
---

# F1 Data Project 🏎️

Dashboard de prédiction des résultats de courses de Formule 1, 
conçu pour les passionnés de F1 souhaitant anticiper les classements 
à partir de données historiques (Kaggle). Le modèle prédit la position 
d'arrivée d'un pilote en fonction de sa position sur la grille de départ, 
de son identité et du circuit.

## Stack

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + Vite + TypeScript |
| Style | Tailwind CSS + shadcn/ui + lucide-react |
| Données | TanStack React Query |
| Graphiques | Recharts |
| Backend | FastAPI + Uvicorn |
| ML | scikit-learn + pandas + joblib |

## Lancer le projet

**Backend (port 8000)**
```bash
cd backend
source venv/bin/activate
python main.py
```

**Frontend (port 5173)**
```bash
cd frontend
npm install
npm run dev
```

## Documentation

Toute la documentation détaillée est dans [`docs/`](./docs) :

- [`architecture.md`](./docs/architecture.md) — Stack et structure du projet
- [`dataset.md`](./docs/dataset.md) — Description des données
- [`question-predictive.md`](./docs/question-predictive.md) — Modèle ML
- [`user-journey.md`](./docs/user-journey.md) — Parcours utilisateur
- [`diagramme-sequence.md`](./docs/diagramme-sequence.md) — Flux de communication