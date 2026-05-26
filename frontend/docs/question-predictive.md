# Question prédictive

## Question centrale
**Comment prédire la position finale d'un pilote en course de F1 ?**

## Variable cible (ce qu'on prédit)
`positionOrder` — la position d'arrivée du pilote

## Variables explicatives (ce qu'on donne au modèle)
- Position sur la grille de départ
- Identité du pilote
- Circuit / Grand Prix
- Historique des performances

## Modèle choisi
Random Forest — robuste, interprétable, bon sur des données tabulaires

## Métrique d'évaluation
- MAE (Mean Absolute Error) : erreur moyenne en nombre de positions