# Architecture du projet F1 Data Project

## Stack technique
- **Frontend** : React 18 + Vite + TypeScript
- **Style** : Tailwind CSS + shadcn/ui
- **Données** : TanStack React Query
- **Graphiques** : Recharts
- **Backend** : FastAPI (Python 3.12)
- **ML** : scikit-learn, joblib, pandas

## Structure des dossiers
f1-data-project/
├── docs/          ← documentation
├── notebook/      ← modèle ML (Colab)
├── backend/       ← API FastAPI
└── frontend/      ← Dashboard React

## Communication frontend ↔ backend
Le frontend appelle le backend via des requêtes HTTP JSON sur `/api/...`
Le backend charge `model.pkl` et répond avec les prédictions.