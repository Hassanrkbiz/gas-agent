/**
 * Available provider names
 */
export type ProviderName = 'OpenAI' | 'GoogleAI' | 'DeepSeek' | 'OpenRouter' | 'Groq' | 'OpenAILike';

/**
 * Message structure for chat history
 */
export interface Message {
  role: string;
  content: string;
}

/**
 * Configuration options for AI providers
 */
export interface ProviderConfig {
  apiKey?: string;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  max_tokens?: number;
  messages?: Message[];
  referer?: string;
  title?: string;
}

/**
 * Response structure from AI providers
 */
export interface ProviderResponse {
  status: number;
  error?: string;
  response?: string;
}

/**
 * Provider interface that all AI providers must implement
 */
export interface Provider {
  generateResponse(input: string, config: ProviderConfig): ProviderResponse;
}

/**
 * Agent instance methods
 */
export interface Agent {
  messageHistory: Message[];
  systemPrompt: string;
  setSystemPrompt(prompt: string): void;
  clearHistory(): void;
  getHistory(): Message[];
  query(input: string, keepHistory?: boolean): ProviderResponse;
}