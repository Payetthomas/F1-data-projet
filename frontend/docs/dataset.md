# Dataset F1

## Source
**Kaggle** — Formula 1 World Championship (1950–2024)  
14 fichiers CSV couvrant toute l'histoire de la F1.

## Fichiers CSV

### Fichiers principaux (utilisés pour la prédiction)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `results.csv` | ~26 700 | Résultats détaillés de chaque pilote par course |
| `qualifying.csv` | ~10 500 | Résultats de qualifications (Q1, Q2, Q3) |
| `races.csv` | ~1 100 | Infos sur chaque Grand Prix (circuit, date, année) |
| `drivers.csv` | ~860 | Infos sur les pilotes (nom, nationalité, numéro) |
| `lap_times.csv` | ~589 000 | Temps au tour par pilote et par course |

### Fichiers secondaires (contexte, enrichissement)

| Fichier | Lignes | Description |
|---------|--------|-------------|
| `circuits.csv` | 77 | Infos sur les circuits (pays, coordonnées GPS) |
| `constructors.csv` | 212 | Infos sur les écuries |
| `constructor_results.csv` | ~12 600 | Résultats des écuries par course |
| `constructor_standings.csv` | ~13 400 | Classement des écuries par course |
| `driver_standings.csv` | ~34 800 | Classement des pilotes par course |
| `pit_stops.csv` | ~11 400 | Détail des arrêts aux stands |
| `sprint_results.csv` | 360 | Résultats des courses sprint |
| `seasons.csv` | 75 | Liste des saisons (1950–2024) |
| `status.csv` | 139 | Référentiel des statuts de fin de course (Finished, Accident…) |

## Colonnes clés de `results.csv`

| Colonne | Type | Description |
|---------|------|-------------|
| `resultId` | int | Identifiant unique du résultat |
| `raceId` | int | Référence vers `races.csv` |
| `driverId` | int | Référence vers `drivers.csv` |
| `constructorId` | int | Référence vers `constructors.csv` |
| `grid` | int | **Position sur la grille de départ** ← feature principale |
| `positionOrder` | int | **Position d'arrivée** ← variable cible (ce qu'on prédit) |
| `points` | float | Points marqués |
| `laps` | int | Nombre de tours effectués |
| `fastestLapSpeed` | float | Vitesse du meilleur tour |
| `statusId` | int | Statut de fin de course |

## Relations entre fichiers
races.csv ──────────┐
↓
drivers.csv ──→ results.csv ←── constructors.csv
↑
qualifying.csv ─────┘

## Notes
- `\N` dans les CSV = valeur manquante (convention MySQL Kaggle)
- `lap_times.csv` est le fichier le plus lourd (~17 Mo), à utiliser avec précaution
- Les données couvrent 1950 à 2024 mais les courses modernes (post-2000) sont plus complètes