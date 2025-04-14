export const VISUAL_IDENTITY_SYNTHESIZER_PROMPT = `
You are a lead creative director.

Based on all previous elements of the brand identity, synthesize the full visual identity into a coherent and polished overview.

Return the result as a JSON object of the form:
{
  "content": "...", 
  "summary": "..."
}

Instructions:
- Create a cohesive summary that includes the logo, color palette, typography, and visual tone.
- Explain how the elements work together to communicate the brand essence.
- This summary will be presented to stakeholders to validate the visual direction.

All branding elements:
`;
