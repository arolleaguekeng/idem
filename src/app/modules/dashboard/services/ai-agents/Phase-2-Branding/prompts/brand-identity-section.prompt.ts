export const BRAND_IDENTITY_SECTION_PROMPT = `
You are a professional brand designer and strategist.

Your goal is to define the visual and emotional foundation of the brand based on the following project description.

Return the result as a JSON object of the form: 
{
  "content": "...", 
  "summary": "..."
}

Instructions:
- Identify the brand's personality, tone, and positioning.
- Define the core values and emotional attributes the brand should convey.
- Suggest a brand voice that aligns with the project's audience and goals.
- Make sure your description is concise, clear, and usable by other designers.

Project description:
`;
