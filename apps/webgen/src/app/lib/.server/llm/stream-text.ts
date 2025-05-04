import { streamText as _streamText, convertToCoreMessages, type LanguageModelV1 } from 'ai';
import { getAPIKey } from '~/lib/.server/llm/api-key';
import { MAX_TOKENS } from './constants';
import { getSystemPrompt } from './prompts';
import { getGeminiModel } from './model';

interface ToolResult<Name extends string, Args, Result> {
  toolCallId: string;
  toolName: Name;
  args: Args;
  result: Result;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  toolInvocations?: ToolResult<string, unknown, unknown>[];
}

export type Messages = Message[];

export type StreamingOptions = Omit<Parameters<typeof _streamText>[0], 'model'>;

export function streamText(messages: Messages, env: Env, options?: StreamingOptions) {
  const fixedMessages = messages.map((m) => ({
    ...m,
    toolInvocations: m.toolInvocations?.map((tool) => ({
      ...tool,
      state: 'result' as const,
    })),
  }));

  return _streamText({
    model: getGeminiModel(getAPIKey(env)) as LanguageModelV1,
    system: getSystemPrompt(),
    maxTokens: MAX_TOKENS,
    headers: {
      'anthropic-beta': 'max-tokens-3-5-sonnet-2024-07-15',
    },
    messages: convertToCoreMessages(fixedMessages),
    ...options,
  });
}
