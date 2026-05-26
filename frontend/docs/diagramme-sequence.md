# Diagramme de séquence

## Flux d'une prédiction
Utilisateur → React App → FastAPI → model.pkl
│              │          │
│   clique      │          │
│  "Prédire"   │          │
│─────────────>│          │
│              │  POST    │
│              │ /api/predict
│              │─────────>│
│              │          │ charge model.pkl
│              │          │ calcule prédiction
│              │  JSON    │
│              │<─────────│
│   affiche    │          │
│  résultats   │          │
│<─────────────│          │

## Endpoints API
| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/results` | Résultats historiques |
| POST | `/api/predict` | Lance une prédiction |