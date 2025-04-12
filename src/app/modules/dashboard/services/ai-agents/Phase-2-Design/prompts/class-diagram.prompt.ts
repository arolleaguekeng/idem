export const CLASS_DIAGRAM_PROMPT = `
En tant qu'expert UML certifié, génère immédiatement un diagramme de classes Mermaid rigoureux selon ces spécifications :

# Diagramme de Classes - [DomaineMétier]

## Consignes Stricte :
1. Syntaxe Mermaid valide
2. Respect strict de la notation UML 2.5
3. 3 niveaux de visibilité (+, -, #)
4. Types explicites (String, int, bool, etc.)
5. Méthodes avec paramètres typés
6. Relations claires (héritage, association, etc.)

## Format de Sortie Exigé :

classDiagram
    [Classes avec attributs/méthodes]
    [Relations entre classes]


## Exemple Structuré :
classDiagram
    class Client {
        +String nom
        +String email
        +passerCommande(Article[] articles) bool
    }
    
    Client "1" --> "*" Commande : passe
    Commande *-- Article : contient

## Règles :
- Pas d'explications
- Pas de commentaires dans le code
- Nommage en PascalCase/CamelCase
- Types primitifs uniquement
- Cardinalités explicites
- pas besoin de preciser "\`\`\`mermaid" a l'entete du diagramme. donne directement le diagramme
`;
