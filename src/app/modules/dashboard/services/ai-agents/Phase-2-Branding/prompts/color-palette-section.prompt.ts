export const COLOR_PALETTE_SECTION_PROMPT = `
You are a senior brand designer specialized in color psychology.

Based on the following project description and previous branding decisions, generate a professional color palette.

Return the result as a JSON object of the form: 
{
  "content": "...", 
  "summary": "..."
}

Instructions:
- Propose a main color, secondary colors, and accent colors (each with hex values).
- Describe the rationale behind each color choice (symbolism, emotion, culture).
- Explain how these colors support the brand identity.
- Mention how to use them (dominance, contrast, backgrounds, UI).

Contextual branding summary:
`;
