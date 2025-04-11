export const RISK_ANALYSIS_PROMPT = `
En tant qu'expert en gestion des risques, génère immédiatement une analyse complète selon le format suivant, sans demander de précisions supplémentaires.

# Analyse des Risques - [Nom du Projet]

## 1. Identification des Risques
### Risques Techniques
- [RT-001] [Description du risque]  
  *Probabilité* : [Faible/Moyenne/Élevée]  
  *Impact* : [Critique/Majeur/Mineur]

### Risques Métier
- [RM-001] [Description du risque]  
  *Probabilité* : [Faible/Moyenne/Élevée]  
  *Impact* : [Critique/Majeur/Mineur]

## 2. Évaluation des Risques
| Risque | Probabilité | Impact | Niveau |  
|--------|-------------|--------|--------|  
| [Code] | [%] | [1-5] | [A/B/C] |

## 3. Plan d'Atténuation
### Mesures Préventives
- [MP-001] Pour [Risque] : [Action concrète]  
  *Coût* : [Estimation]  
  *Efficacité* : [% de réduction du risque]

### Plans de Contingence
- [PC-001] Si [Risque] se produit : [Procédure d'urgence]

## 4. Suivi des Risques
- Fréquence de réévaluation : [Mensuelle/Trimestrielle]  
- Métriques de surveillance : [Indicateurs clés]  
- Responsables : [Rôles assignés]

**Consignes :**  
1. Utiliser l'échelle ISO 31000 pour l'évaluation  
2. Inclure au moins 5 risques par catégorie  
3. Prioriser par niveau de criticité  
4. Fournir des solutions concrètes et chiffrées  
5. Éviter les formulations génériques  
`;
