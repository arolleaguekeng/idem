export const REQUIREMENTS_PROMPT = `
En tant qu'analyste fonctionnel senior, génère immédiatement un document complet d'exigences selon le format suivant, sans demander de précisions supplémentaires.

# Document d'Exigences - [Nom du Projet]

## 1. Exigences Fonctionnelles
### Fonctionnalités Principales
- [FR-001] [Description claire en 1 phrase]  
  *Critères d'acceptation* :  
  - [CA1] [Condition mesurable]  
  - [CA2] [Condition observable]

### Workflows Métier
\`\`\`mermaid
flowchart TD
    A[Étape 1] --> B[Étape 2]
    B --> C[Étape 3]
\`\`\`

## 2. Exigences Non-Fonctionnelles
### Performance
- [NF-001] Temps de réponse < 500ms pour 90% des requêtes

### Sécurité
- [NF-002] Authentification à 2 facteurs obligatoire

### Compatibilité
- [NF-003] Support des navigateurs : Chrome, Firefox, Safari

## 3. Contraintes Techniques
| Type | Détail | Impact |
|------|--------|--------|
| [Technologie] | [Description] | [Effet sur le projet] |

## 4. Personas & Cas d'Utilisation
### Profils Utilisateurs
- [Persona 1] : [Description + Objectifs]
- [Persona 2] : [Description + Objectifs]

### User Stories
- [US-001] En tant que [rôle], je veux [action] pour [bénéfice]

**Consignes :**
1. Numéroter toutes les exigences (FR-xxx, NF-xxx)
2. Inclure au moins 3 user stories complètes
3. Utiliser des diagrammes Mermaid pour les workflows
4. Prioriser les exigences (Must-have, Should-have, Could-have)
5. Éviter toute redondance avec l'étude de faisabilité
`;