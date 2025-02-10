import { ProviderName, Message, ProviderConfig, ProviderResponse, Provider, Agent } from './types';

/**
 * OpenAI provider implementation
 */
export class OpenAIProvider implements Provider {
  generateResponse(input: string, config: ProviderConfig): ProviderResponse {
    const apiKey = config.apiKey || PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    if (!apiKey) {
      return { status: 400, error: 'OpenAI API key is required.' };
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const payload = {
      model: config.model || 'gpt-3.5-turbo',
      messages: config.messages || [{ role: 'user', content: input }],
      temperature: config.temperature || 0.7,
      max_tokens: config.max_tokens || 100
    };

    const options = {
      method: 'post' as const,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      const result = JSON.parse(response.getContentText());
      if (result.error) {
        return { status: 500, error: `OpenAI API error: ${result.error.message}` };
      }
      return {
        status: 200,
        response: result.choices[0]?.message?.content || 'No response from OpenAI.'
      };
    } catch (error) {
      return { 
        status: 500, 
        error: `OpenAIProvider error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}

/**
 * GoogleAI provider implementation
 */
export class GoogleAIProvider implements Provider {
  generateResponse(input: string, config: ProviderConfig): ProviderResponse {
    const apiKey = config.apiKey || PropertiesService.getScriptProperties().getProperty('GOOGLEAI_API_KEY');
    if (!apiKey) {
      return { status: 400, error: 'Google AI API key is required.' };
    }

    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
    const payload = {
      contents: [{
        parts: [{
          text: input
        }]
      }]
    };

    const options = {
      method: 'post' as const,
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      payload: JSON.stringify(payload)
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      const result = JSON.parse(response.getContentText());
      if (result.error) {
        return { status: 500, error: `Google AI API error: ${result.error.message}` };
      }
      return {
        status: 200,
        response: result.candidates[0]?.content?.parts[0]?.text || 'No response from Google AI.'
      };
    } catch (error) {
      return { 
        status: 500, 
        error: `GoogleAIProvider error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}

/**
 * DeepSeek provider implementation
 */
export class DeepSeekProvider implements Provider {
  generateResponse(input: string, config: ProviderConfig): ProviderResponse {
    const apiKey = config.apiKey || PropertiesService.getScriptProperties().getProperty('DEEPSEEK_API_KEY');
    if (!apiKey) {
      return { status: 400, error: 'DeepSeek API key is required.' };
    }

    const url = 'https://api.deepseek.com/v1/chat/completions';
    const payload = {
      model: config.model || 'deepseek-chat',
      messages: config.messages || [{ role: 'user', content: input }],
      temperature: config.temperature || 0.7,
      max_tokens: config.max_tokens || 100
    };

    const options = {
      method: 'post' as const,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      const result = JSON.parse(response.getContentText());
      if (result.error) {
        return { status: 500, error: `DeepSeek API error: ${result.error.message}` };
      }
      return {
        status: 200,
        response: result.choices[0]?.message?.content || 'No response from DeepSeek.'
      };
    } catch (error) {
      return { 
        status: 500, 
        error: `DeepSeekProvider error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}

/**
 * OpenRouter provider implementation
 */
export class OpenRouterProvider implements Provider {
  generateResponse(input: string, config: ProviderConfig): ProviderResponse {
    const apiKey = config.apiKey || PropertiesService.getScriptProperties().getProperty('OPENROUTER_API_KEY');
    if (!apiKey) {
      return { status: 400, error: 'OpenRouter API key is required.' };
    }

    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const payload = {
      model: config.model || 'openai/gpt-3.5-turbo',
      messages: config.messages || [{ role: 'user', content: input }],
      temperature: config.temperature || 0.7,
      max_tokens: config.max_tokens || 100
    };

    const options = {
      method: 'post' as const,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': config.referer || 'https://script.google.com',
        'X-Title': config.title || 'GAS Agent',
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      const result = JSON.parse(response.getContentText());
      if (result.error) {
        return { status: 500, error: `OpenRouter API error: ${result.error.message}` };
      }
      return {
        status: 200,
        response: result.choices[0]?.message?.content || 'No response from OpenRouter.'
      };
    } catch (error) {
      return { 
        status: 500, 
        error: `OpenRouterProvider error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}

/**
 * Groq provider implementation
 */
export class GroqProvider implements Provider {
  generateResponse(input: string, config: ProviderConfig): ProviderResponse {
    const apiKey = config.apiKey || PropertiesService.getScriptProperties().getProperty('GROQ_API_KEY');
    if (!apiKey) {
      return { status: 400, error: 'Groq API key is required.' };
    }

    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const payload = {
      model: config.model || 'mixtral-8x7b-32768',
      messages: config.messages || [{ role: 'user', content: input }],
      temperature: config.temperature || 0.7,
      max_tokens: config.max_tokens || 100
    };

    const options = {
      method: 'post' as const,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      const result = JSON.parse(response.getContentText());
      if (result.error) {
        return { status: 500, error: `Groq API error: ${result.error.message}` };
      }
      return {
        status: 200,
        response: result.choices[0]?.message?.content || 'No response from Groq.'
      };
    } catch (error) {
      return { 
        status: 500, 
        error: `GroqProvider error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}

/**
 * OpenAI-like provider implementation for compatible APIs
 */
export class OpenAILikeProvider implements Provider {
  generateResponse(input: string, config: ProviderConfig): ProviderResponse {
    const apiKey = config.apiKey || PropertiesService.getScriptProperties().getProperty('OPENAI_LIKE_API_KEY');
    if (!apiKey) {
      return { status: 400, error: 'API key is required.' };
    }

    const url = config.model || 'https://api.example.com/v1/chat/completions';
    const payload = {
      messages: config.messages || [{ role: 'user', content: input }],
      temperature: config.temperature || 0.7,
      max_tokens: config.max_tokens || 100
    };

    const options = {
      method: 'post' as const,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify(payload)
    };

    try {
      const response = UrlFetchApp.fetch(url, options);
      const result = JSON.parse(response.getContentText());
      if (result.error) {
        return { status: 500, error: `API error: ${result.error.message}` };
      }
      return {
        status: 200,
        response: result.choices[0]?.message?.content || 'No response from API.'
      };
    } catch (error) {
      return { 
        status: 500, 
        error: `Provider error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}

/**
 * Main class for managing AI agents and their interactions with various LLM providers.
 */
export class GASAgent {
  private agents: Record<string, Agent> = {};
  private providers: Record<ProviderName, Provider>;

  constructor() {
    this.providers = {
      'OpenAI': new OpenAIProvider(),
      'GoogleAI': new GoogleAIProvider(),
      'DeepSeek': new DeepSeekProvider(),
      'OpenRouter': new OpenRouterProvider(),
      'Groq': new GroqProvider(),
      'OpenAILike': new OpenAILikeProvider()
    };
  }

  /**
   * Creates a new AI agent with specified configuration.
   */
  createAgent(agentName: string, providerName: ProviderName, config: ProviderConfig): Agent {
    if (!agentName || typeof agentName !== 'string') {
      throw new Error('Agent name must be a non-empty string.');
    }
    if (this.agents[agentName]) {
      throw new Error(`Agent '${agentName}' already exists.`);
    }
    if (!this.providers[providerName]) {
      throw new Error(`Provider '${providerName}' not registered.`);
    }

    const agent: Agent = {
      messageHistory: [] as Message[],
      systemPrompt: config.systemPrompt || '',

      setSystemPrompt: (prompt: string) => {
        if (typeof prompt !== 'string') {
          throw new Error('System prompt must be a string.');
        }
        agent.systemPrompt = prompt;
      },

      clearHistory: () => {
        agent.messageHistory = [];
      },

      getHistory: () => {
        return [...agent.messageHistory];
      },

      query: (input: string, keepHistory = true): ProviderResponse => {
        if (!input || typeof input !== 'string') {
          return { status: 400, error: 'Input must be a non-empty string.' };
        }

        try {
          const messages: Message[] = [];
          
          if (agent.systemPrompt) {
            messages.push({ role: 'system', content: agent.systemPrompt });
          }
          
          messages.push(...agent.messageHistory);
          messages.push({ role: 'user', content: input });

          const chatConfig = { ...config, messages };
          const response = this.providers[providerName].generateResponse(input, chatConfig);
          
          if (response.status === 200 && keepHistory && response.response) {
            agent.messageHistory.push(
              { role: 'user', content: input },
              { role: 'assistant', content: response.response }
            );
          }
          
          return response;
        } catch (error) {
          return { 
            status: 500, 
            error: `Error during query execution: ${error instanceof Error ? error.message : 'Unknown error'}` 
          };
        }
      }
    };

    this.agents[agentName] = agent;
    return agent;
  }
}