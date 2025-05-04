// utils/ai/google.ts

import { createGoogleGenerativeAI } from '@ai-sdk/google';

export function getGeminiModel(apiKey: string) {
  const gemini = createGoogleGenerativeAI({
    apiKey,
  });

  return gemini('gemini-2.0-flash');
}
