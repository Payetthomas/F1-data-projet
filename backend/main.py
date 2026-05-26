from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="F1 Predictor API")

# --- CORS ---
# Autorise le frontend (localhost:5173) à appeler le backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Chargement du modèle ---
# On charge model.pkl au démarrage (pas à chaque requête)
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None

# --- Schéma d'entrée pour /api/predict ---
class PredictionInput(BaseModel):
    grid: int          # position sur la grille de départ
    driverId: int      # identifiant du pilote
    raceId: int        # identifiant de la course

# --- Routes ---

@app.get("/")
def root():
    return {"message": "F1 Predictor API 🏎️", "status": "ok"}

@app.get("/api/results")
def get_results():
    """Retourne des résultats historiques (placeholder pour l'instant)"""
    return {"results": [], "message": "À brancher sur les CSV"}

@app.post("/api/predict")
def predict(data: PredictionInput):
    """Prédit la position d'arrivée d'un pilote"""
    if model is None:
        return {"error": "Modèle non chargé — model.pkl introuvable"}
    
    # Prépare les données pour le modèle
    input_df = pd.DataFrame([{
        "grid": data.grid,
        "driverId": data.driverId,
        "raceId": data.raceId
    }])
    
    prediction = model.predict(input_df)
    
    return {
        "predicted_position": int(prediction[0]),
        "input": data.model_dump()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)