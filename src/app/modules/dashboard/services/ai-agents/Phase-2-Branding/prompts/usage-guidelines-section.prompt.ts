export const USAGE_GUIDELINES_SECTION_PROMPT = `
You are a senior brand identity designer.

Based on the following brand assets and description, write clear and professional usage guidelines.

Return the result as a JSON object of the form:
{
  "content": "...", 
  "summary": "..."
}

Instructions:
- Explain how the logo should and should not be used (spacing, scaling, background).
- Define rules for color usage (combinations, accessibility).
- Give typography usage examples and spacing ratios.
- Add common "do and don't" examples for maintaining visual consistency.
- Make it useful for developers, designers, and marketers.
i want just html code it is a website for my app branding

Contextual branding summary:
`;
