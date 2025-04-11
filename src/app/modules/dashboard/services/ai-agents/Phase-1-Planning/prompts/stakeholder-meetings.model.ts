export const STAKEHOLDER_MEETINGS_PROMPT = `
En tant qu'expert en gestion des parties prenantes, génère immédiatement un plan de réunions selon le format suivant, sans demander de précisions supplémentaires.

# Plan de Réunions avec les Parties Prenantes - [Nom du Projet]

## 1. Cartographie des Parties Prenantes
| Rôle | Influence | Intérêt | Fréquence Réunion |
|------|-----------|---------|-------------------|
| [Ex: Sponsor] | [1-5] | [1-5] | [Mensuelle/Trim.] |

## 2. Agenda Type
### Réunion de Lancement
- **Objectifs** : [Liste]
- **Participants** : [Rôles]
- **Durée** : [Xh]
- **Points Clés** :
  - [Point 1]
  - [Point 2]

## 3. Template de Compte-Rendu
### Décisions
- [D-001] [Description]
  *Responsable* : [Nom]
  *Échéance* : [Date]

### Actions
- [A-001] [Description]
  *Owner* : [Rôle]
  *Deadline* : [JJ/MM]

## 4. Suivi des Engagements
| Action | Statut | Retard | Commentaire |
|--------|--------|--------|-------------|
| [ID] | [%] | [Jours] | [Détail] |

**Consignes :**
1. Adapter la fréquence selon la matrice influence/intérêt
2. Inclure des templates prêts à l'emploi
3. Préciser les rôles minimums requis pour chaque réunion
4. Utiliser un système de tracking des actions (D-XXX, A-XXX)
5. Fournir des indicateurs de participation historiques
`;