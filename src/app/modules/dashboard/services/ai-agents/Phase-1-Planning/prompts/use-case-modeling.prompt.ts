export const USE_CASE_MODELING_PROMPT = `
En tant qu'expert en conception fonctionnelle, génère immédiatement une description détaillée des cas d'utilisation selon le format suivant, sans demander de précisions supplémentaires.

# Description des Fonctionnalités - [Nom du Projet]

## 1. Fonctionnalités Principales
### [FONC-001] [Nom de la fonctionnalité]
- **Objectif** : [Description concise du but]
- **Déclencheur** : [Événement/action qui lance la fonctionnalité]
- **Processus** :
  1. [Étape clé 1]
  2. [Étape clé 2]
  3. [Étape clé 3]
- **Résultat attendu** : [Sortie/conclusion observable]

## 2. Flux Alternatifs
#### Pour [FONC-001] :
- [FA-001] [Situation exceptionnelle] :
  - [Processus alternatif]
  - [Résultat spécifique]

## 3. Règles Métier
- [RB-001] [Description de la règle] :
  - Champ d'application : [Portée]
  - Contraintes : [Limites/conditions]

## 4. Acteurs Concernés
| Rôle | Interaction | Fréquence |
|------|-------------|-----------|
| [Rôle1] | [Description] | [Élevée/Moyenne/Faible] |

**Consignes :**
1. Décrire 5-10 fonctionnalités maximum
2. Inclure 1-2 flux alternatifs par fonctionnalité principale
3. Numéroter les items (FONC-XXX, FA-XXX, RB-XXX)
4. Utiliser un langage actionnable (verbes à l'infinitif)
5. Éviter tout jargon technique complexe
`;