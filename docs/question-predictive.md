# Question prédictive

## Question centrale

**Comment prédire la position finale d'un pilote lors d'une course de Formule 1 ?**

## Cible `y`

| Propriété | Valeur |
|-----------|--------|
| Colonne | `positionOrder` |
| Type | Continu (entier 1–20) |
| Description | Position d'arrivée du pilote dans la course |

## Features `X` retenues

| Feature | Type | Justification |
|---------|------|---------------|
| `quali_position` | int | Meilleur prédicteur (41% d'importance) |
| `grid` | int | Position sur la grille de départ |
| `driverId` | int | Identité du pilote (historique de performance) |
| `constructorId` | int | Performance de l'écurie |
| `circuitId` | int | Caractéristiques du circuit |
| `year` | int | Évolution des performances dans le temps |
| `temp_mean` | float | Température moyenne le jour de la course |
| `precipitation` | float | Précipitations (pluie = perturbations) |
| `wind_speed` | float | Vitesse du vent |

## Famille ML : Régression

On choisit la **régression** plutôt que la classification car `positionOrder` est une valeur ordinale continue (1 à 20) — prédire P3.2 est plus informatif que de classer dans une catégorie "top 3 / top 10 / autre".

## Modèle retenu : XGBoost

Trois modèles ont été comparés :

| Modèle | MAE Validation | MAE Test |
|--------|---------------|----------|
| Linear Regression | ~6.5 | ~6.5 |
| Random Forest | 4.85 | 4.82 |
| **XGBoost** | **meilleur** | **meilleur** |

XGBoost a été retenu car il obtient le MAE le plus bas sur le jeu de test.

## Métrique principale : MAE

Le **Mean Absolute Error (MAE)** mesure l'erreur moyenne en nombre de positions. Un MAE de 4.8 signifie : *"en moyenne, le modèle se trompe de 4.8 positions"*. C'est la métrique la plus lisible dans le contexte F1 — plus parlante que le RMSE pour un utilisateur non technique.