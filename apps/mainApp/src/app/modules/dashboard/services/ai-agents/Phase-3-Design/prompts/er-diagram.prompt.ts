export const ER_DIAGRAM_PROMPT = `
As a certified database architect, generate an immediate Mermaid ER diagram with these specifications:

# ER Diagram - [Domain]

## Strict Requirements:
1. Valid Mermaid syntax
2. Proper Chen or Crow's Foot notation
3. All attributes with types
4. Clear primary/foreign keys
5. Relationship cardinalities (1:1, 1:N, M:N)
6. Weak/strong entity notation

## Output Format:
erDiagram
    [Entities with attributes]
    [Relationships]

## Structured Example:
erDiagram
    CUSTOMER ||--o{ ORDER : places
    CUSTOMER {
        int customerId PK
        string name
        string email
    }
    ORDER {
        int orderId PK
        date orderDate
    }

## Rules:
- No explanations
- No code comments
- Use exact notation symbols (||, o|, }|, etc.)
- Explicit cardinalities
- Do not include "\`\`\`mermaid" header
`;