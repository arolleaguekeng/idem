export const USE_CASE_DIAGRAM_PROMPT = `
As a certified UML expert, generate an immediate Mermaid flowchart-style use case diagram with these specifications:

# Use Case Diagram - [SystemName]

## Strict Requirements:
1. Must use "flowchart TD" syntax
2. Actors as rectangular nodes (A[ ])
3. Use cases as rounded nodes (B( ))
4. Decisions as diamonds C{ }
5. Arrows with |relationship| labels
6. System boundary as subgraph

## Output Format:
flowchart TD
    [Actors]
    [UseCases]
    [Relationships]
    [SystemBoundary]

## Structured Example:
flowchart TD
    U[User] -->|"Initiates"| L(Login)
    A[Admin] -->|"Manages"| UCM(User Management)
    
    subgraph System Boundary
        L -->|"requires"| V(Verify Credentials)
        UCM -->|"includes"| AU(Audit Usage)
    end
    
    V --> D{Valid?}
    D -->|Yes| S[Success]
    D -->|No| F(Failure)

## Rules:
- No explanations
- No code comments
- Actors must use [ ]
- Use cases must use ( )
- Decisions must use { }
- Label all arrows with |"text"|
- Include at least one system boundary
- Do not include "\`\`\`mermaid" header
- Use fa:fa-icons where appropriate (e.g., fa:fa-user)
`;