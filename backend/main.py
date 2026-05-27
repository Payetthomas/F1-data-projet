from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="F1 Predictor API")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Chargement des CSV au démarrage ---
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

df_results = pd.read_csv(os.path.join(DATA_DIR, "results.csv"))
df_races = pd.read_csv(os.path.join(DATA_DIR, "races.csv"))
df_drivers = pd.read_csv(os.path.join(DATA_DIR, "drivers.csv"))
df_standings = pd.read_csv(os.path.join(DATA_DIR, "driver_standings.csv"))
df_constructors = pd.read_csv(os.path.join(DATA_DIR, "constructors.csv"))
df_constructor_standings = pd.read_csv(os.path.join(DATA_DIR, "constructor_standings.csv"))

# --- Chargement du modèle et des features ---
import json

MODEL_PATH = os.path.join(DATA_DIR, "model.pkl")
FEATURES_PATH = os.path.join(DATA_DIR, "model_features.json")

model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None

with open(FEATURES_PATH) as f:
    MODEL_FEATURES = json.load(f)

print(f"✅ Modèle chargé, features : {MODEL_FEATURES}")

# --- Schéma prédiction ---
class PredictionInput(BaseModel):
    grid: int
    driverId: int
    constructorId: int
    circuitId: int
    year: int
    quali_position: float
    temp_mean: float
    precipitation: float
    wind_speed: float

# --- Routes ---

@app.get("/")
def root():
    return {"message": "F1 Predictor API 🏎️", "status": "ok"}


@app.get("/standings/drivers")
def get_driver_standings(season: int = 2024):
    """Classement pilotes pour une saison donnée"""

    # Récupère la dernière course de la saison
    races_season = df_races[df_races["year"] == season]
    if races_season.empty:
        raise HTTPException(status_code=404, detail=f"Saison {season} introuvable")

    last_race_id = races_season["raceId"].max()

    # Classement à la dernière course
    standings = df_standings[df_standings["raceId"] == last_race_id].copy()

    # Jointure avec les noms de pilotes
    standings = standings.merge(
        df_drivers[["driverId", "forename", "surname", "code"]],
        on="driverId",
        how="left"
    )
    standings["driver"] = standings["forename"] + " " + standings["surname"]

    # Jointure pour récupérer l'écurie depuis results
    last_results = df_results[df_results["raceId"] == last_race_id][["driverId", "constructorId"]]
    standings = standings.merge(last_results, on="driverId", how="left")
    standings = standings.merge(
        df_constructors[["constructorId", "name"]],
        on="constructorId",
        how="left"
    )
    standings = standings.rename(columns={"name": "team"})
    standings = standings.sort_values("position")

    return standings[["position", "driver", "team", "points"]].fillna("—").to_dict(orient="records")


@app.get("/standings/constructors")
def get_constructor_standings(season: int = 2024):
    """Classement constructeurs pour une saison donnée"""

    races_season = df_races[df_races["year"] == season]
    if races_season.empty:
        raise HTTPException(status_code=404, detail=f"Saison {season} introuvable")

    last_race_id = races_season["raceId"].max()

    standings = df_constructor_standings[
        df_constructor_standings["raceId"] == last_race_id
    ].copy()

    standings = standings.merge(
        df_constructors[["constructorId", "name"]],
        on="constructorId",
        how="left"
    )
    standings = standings.rename(columns={"name": "team"})
    standings = standings.sort_values("position")

    return standings[["position", "team", "points"]].fillna("—").to_dict(orient="records")


@app.get("/races")
def get_race_calendar(season: int = 2024):
    """Calendrier des courses d'une saison"""

    races = df_races[df_races["year"] == season].copy()
    if races.empty:
        raise HTTPException(status_code=404, detail=f"Saison {season} introuvable")

    races = races.sort_values("round")

    return races[["round", "name", "date"]].rename(
        columns={"name": "name"}
    ).assign(circuit=races["name"]).to_dict(orient="records")


@app.get("/races/{season}/{round}/results")
def get_race_results(season: int, round: int):
    """Résultats d'une course spécifique"""

    race = df_races[(df_races["year"] == season) & (df_races["round"] == round)]
    if race.empty:
        raise HTTPException(status_code=404, detail="Course introuvable")

    race_id = race["raceId"].iloc[0]
    results = df_results[df_results["raceId"] == race_id].copy()

    results = results.merge(
        df_drivers[["driverId", "forename", "surname"]],
        on="driverId", how="left"
    )
    results["driver"] = results["forename"] + " " + results["surname"]

    results = results.merge(
        df_constructors[["constructorId", "name"]],
        on="constructorId", how="left"
    )
    results = results.rename(columns={"name": "team"})
    results = results.sort_values("positionOrder")

    return results[["positionOrder", "driver", "team", "points", "grid"]].rename(
        columns={"positionOrder": "position"}
    ).fillna("—").to_dict(orient="records")


@app.post("/api/predict")
def predict(data: PredictionInput):
    """Prédit la position d'arrivée d'un pilote"""
    if model is None:
        raise HTTPException(status_code=503, detail="Modèle non chargé")

    input_df = pd.DataFrame([data.model_dump()])[MODEL_FEATURES]
    prediction = model.predict(input_df)

    return {
        "predicted_position": round(float(prediction[0]), 1),
        "input": data.model_dump()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)