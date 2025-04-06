export const FAISABILITY_PROMPT = `
En tant qu'expert en analyse de faisabilité, génère immédiatement une étude complète selon le format suivant, sans demander de précisions supplémentaires. L'analyse doit être exhaustive et directement exploitable.

# Analyse de Faisabilité - [Nom du Projet]

## 1. Faisabilité Métier
### Besin & Objectifs SMART
- **Spécifique** : [Analyse]
- **Mesurable** : [Indicateurs]
- **Atteignable** : [Évaluation]
- **Réaliste** : [Justification]
- **Temporel** : [Échéancier]

### Différenciation Concurrentielle
- [Avantages clés]
- [Gap analysis vs concurrence]

### Marché & Positionnement
- [Taille marché]
- [Positionnement stratégique proposé]

### Risques & Opportunités
- [Principaux risques]
- [Opportunités identifiées]

## 2. Faisabilité Financière
### Budget Prévisionnel
- Développement : [Estimation]
- Exploitation : [Coûts annuels]
- Maintenance : [Coûts récurrents]

### Financement
- [Sources identifiées]
- [Mix recommandé]

### ROI
- [Projection sur 3 ans]
- [Seuil de rentabilité]

## 3. Faisabilité Organisationnelle
### Ressources Humaines
- [Compétences disponibles]
- [Gaps à combler]

### Méthodologie
- [Méthode recommandée]
- [Justification]

### Planning
- [Jalons clés]
- [Timeline estimée]

## 4. Faisabilité Juridique
### Conformité
- [Régulations applicables]
- [Exigences sectorielles]

### Protection des Données
- [Mesures RGPD/CCPA]
- [Processus à implémenter]

### Propriété Intellectuelle
- [Brevets existants]
- [Stratégie IP recommandée]

**Consignes :** 
1. Remplir toutes les sections avec des analyses concrètes
2. Éviter tout message d'introduction/transition
3. Prioriser les listes à puces et tableaux synthétiques
4. Maintenir un ton professionnel et factuel
5. Inclure des recommandations actionnables dans chaque section 

`;
