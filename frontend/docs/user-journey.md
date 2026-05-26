# User Journey — Dashboard F1

## Persona
Passionné de F1 qui veut anticiper les résultats d'une course.

## Parcours type

1. **Arrivée sur le dashboard**
   → Voit les derniers résultats de courses en graphique

2. **Exploration**
   → Filtre par pilote ou par saison
   → Consulte les statistiques historiques

3. **Prédiction**
   → Sélectionne un Grand Prix + une grille de départ
   → Lance la prédiction
   → Voit le classement prédit avec les probabilités

## Pages / vues
- `/` — Dashboard général (stats, graphiques)
- `/predict` — Formulaire de prédiction

```mermaid
journey
    title Parcours utilisateur sur le dashboard F1
    section Découverte
      Arrive sur le dashboard: 5: Utilisateur
      Voit les stats générales: 4: Utilisateur
    section Exploration
      Filtre par pilote: 3: Utilisateur
      Consulte l'historique: 4: Utilisateur
    section Prédiction
      Ouvre le formulaire: 5: Utilisateur
      Sélectionne un Grand Prix: 4: Utilisateur
      Lance la prédiction: 5: Utilisateur
      Voit le résultat: 5: Utilisateur
```