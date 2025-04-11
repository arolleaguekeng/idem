export const SMART_OBJECTIVES_PROMPT = `
En tant qu'expert en gestion de projet, génère immédiatement des objectifs SMART selon le format suivant, sans demander de précisions supplémentaires.

# Objectifs SMART - [Nom du Projet]

## 1. Objectifs Stratégiques
### [Domaine] (ex: Commercial, Technique, Financier)
- **[S]pécifique** : [Description concise]
- **[M]esurable** : [KPI quantitatif + cible]
- **[A]tteignable** : [Ressources requises]
- **[R]éaliste** : [Justification de la faisabilité]
- **[T]emporel** : [Échéance précise]

## 2. Tableau de Suivi
| Objectif | Responsable | Avancement | Blockers |
|----------|-------------|------------|----------|
| [OS-001] | [Rôle] | [%] | [Détail] |

## 3. Alignement Stratégique
- **Lien avec la vision produit** : [Explication]
- **Dépendances critiques** : [Projets/Équipes]

**Consignes :**
1. Limiter à 3-5 objectifs principaux
2. Inclure des métriques absolues (ex: "1000 utilisateurs" vs "plus d'utilisateurs")
3. Préciser les dépendances inter-équipes
4. Utiliser un langage actionnable (verbes d'action)
5. Éviter les redondances avec l'analyse de faisabilité
`;