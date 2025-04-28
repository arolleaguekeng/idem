export const ARCHITECTURE_DIAGRAM_PROMPT = `
As a certified solutions architect, generate an immediate Mermaid block diagram with these specifications:

# Architecture Diagram - [SystemName]

## Strict Requirements:
1. Must use Mermaid's "block-beta" syntax
2. Columns and spans must be explicitly defined
3. Minimum 3 visual elements (blocks, DBs, queues)
4. Connection arrows with clear directions
5. Style annotations for key components
6. Space management with "space" keyword

## Output Format:
block-beta
    [Column definition]
    [Block hierarchy]
    [Connections]
    [Styles]

## Structured Example:
block-beta
    columns 3
    auth["Auth Service"]:2
    space down1<[" "]>(down)
    
    block:e:3
        api["API Gateway"]
        processor["Event Processor"]
        logger["Logging"]
    end
    
    space down2<[" "]>(down)
    db[("PostgreSQL")]:3
    
    style auth fill:#9f9,stroke:#333
    style processor fill:#d6d,stroke-width:4px
    
    auth --> api
    processor --> db
    logger --> db

## Rules:
- No explanations
- No code comments
- Use exact block types: [" "], (""), [(" ")]
- Arrow directions must be explicit (--> vs <--)
- Include column spans (e.g., :2, :3)
- Do not include "\`\`\`mermaid" header
- Must include at least one style directive
`;