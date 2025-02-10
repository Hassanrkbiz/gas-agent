/**
 * @class GASAgent
 * Represents the main class for managing AI agents and their interactions with various language model providers.
 * This class serves as a central hub for creating and managing AI agents, handling different provider implementations,
 * and maintaining conversation history. It supports multiple AI providers including OpenAI, Google AI, DeepSeek,
 * OpenRouter, and Groq.
 *
 * @example
 * const gasAgent = new GASAgent();
 * const agent = gasAgent.createAgent('myAgent', 'OpenAI', {
 *   model: 'gpt-3.5-turbo',
 *   temperature: 0.7
 * });
 */
class GASAgent {
  /**
   * Constructor for GASAgent.
   * Initializes the agents and providers.
   */
  constructor() {
    /** @private */
    this.agents = {};
    /** @private */
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
 * Creates a new AI agent with specified configuration and capabilities.
 * @param {string} agentName - Unique identifier for the agent. Must be a non-empty string and not already in use.
 * @param {'OpenAI'|'GoogleAI'|'DeepSeek'|'OpenRouter'|'Groq'|'OpenAILike'} providerName - The AI provider service to use for this agent.
 * @param {Object} config - Configuration options for customizing the agent's behavior.
 * @param {string} [config.apiKey] - API key for authentication with the provider. Optional if already set in Script Properties.
 * @param {string} [config.model] - The specific model to use from the provider (e.g., 'gpt-3.5-turbo' for OpenAI, 'gemini-2.0-flash' for GoogleAI).
 * @param {string} [config.systemPrompt] - Initial system prompt to establish the agent's behavior and context.
 * @param {number} [config.temperature=0.7] - Controls randomness in response generation. Higher values (0-1) make output more creative.
 * @param {number} [config.max_tokens=100] - Maximum number of tokens to generate in the response.
 * @param {string} [config.baseURL] - Base URL for API endpoint. Required only for OpenAILike provider.
 * @param {string} [config.referer] - HTTP referer for OpenRouter provider.
 * @param {string} [config.title] - Title for OpenRouter provider.
 * @returns {{setSystemPrompt: (prompt: string) => void, clearHistory: () => void, getHistory: () => Array<{role: string, content: string}>, query: (input: string, keepHistory?: boolean) => {status: number, response?: string, error?: string}}} Agent instance with methods
 * @throws {Error} If the provider is not registered or if agentName is invalid.
 */
  createAgent(agentName, providerName, config) {
    if (!agentName || typeof agentName !== 'string') {
      throw new Error('Agent name must be a non-empty string.');
    }
    if (this.agents[agentName]) {
      throw new Error(`Agent '${agentName}' already exists.`);
    }
    if (!this.providers[providerName]) {
      throw new Error(`Provider '${providerName}' not registered.`);
    }

    const agent = {
      /** @private */
      messageHistory: [],
      /** @private */
      systemPrompt: config.systemPrompt || '',

      /**
       * Sets the system prompt for the agent. The system prompt defines the agent's behavior and context
       * for all subsequent interactions. This prompt is prepended to every conversation.
       * 
       * @param {string} prompt - The system prompt to set. Must be a non-empty string that defines
       *                         the agent's role, behavior, or any specific instructions.
       * @throws {Error} If the prompt is not a string.
       * @example
       * agent.setSystemPrompt('You are a helpful assistant who speaks in a friendly manner.');
       */
      setSystemPrompt: (prompt) => {
        if (typeof prompt !== 'string') {
          throw new Error('System prompt must be a string.');
        }
        agent.systemPrompt = prompt;
      },

      /**
       * Clears the conversation history of the agent. This removes all previous interactions
       * while maintaining the system prompt. Useful when starting a new conversation thread
       * or when you want to free up memory.
       * 
       * @example
       * // After some interactions
       * agent.clearHistory(); // Conversation history is now empty
       */
      clearHistory: () => {
        agent.messageHistory = [];
      },

      /**
       * Retrieves the current conversation history of the agent. The history includes
       * all messages exchanged between the user and the agent in chronological order.
       * 
       * @returns {Array<{role: string, content: string}>} An array of message objects, where each object contains:
       *   - role: The sender of the message ('user' or 'assistant')
       *   - content: The actual message content
       * @example
       * const history = agent.getHistory();
       * console.log(history); // [{role: 'user', content: 'Hello'}, {role: 'assistant', content: 'Hi!'}]
       */
      getHistory: () => {
        return [...agent.messageHistory];
      },

      /**
       * Sends a query to the AI agent and receives a response. This method handles the communication
       * with the underlying AI provider while maintaining conversation history.
       * 
       * @param {string} input - The input query or message to send to the agent. Must be a non-empty string.
       * @param {boolean} [keepHistory=true] - Whether to store this interaction in the conversation history.
       *                                      Set to false for one-off queries that shouldn't affect the conversation flow.
       * @returns {Object} Response object containing:
       *   - status: HTTP status code (200 for success, 400 for invalid input, 500 for server errors)
       *   - response: The agent's response message (if status is 200)
       *   - error: Error message (if status is not 200)
       * @example
       * // Basic query with history
       * const response1 = agent.query('What is the weather today?');
       * console.log(response1); // {status: 200, response: 'I cannot provide real-time weather information...'}
       * 
       * // One-off query without affecting history
       * const response2 = agent.query('Calculate 2+2', false);
       * 
       * // Handling errors
       * const response3 = agent.query('');
       * console.log(response3); // {status: 400, error: 'Input must be a non-empty string.'}
       */
      query: (input, keepHistory = true) => {
        if (!input || typeof input !== 'string') {
          return { status: 400, error: 'Input must be a non-empty string.' };
        }

        try {
          // Prepare messages array with system prompt and history
          const messages = [];
          
          // Add system prompt if present
          if (agent.systemPrompt) {
            messages.push({ role: 'system', content: agent.systemPrompt });
          }
          
          // Add message history
          messages.push(...agent.messageHistory);
          
          // Add current input
          messages.push({ role: 'user', content: input });

          // Update config with messages
          const chatConfig = { ...config, messages };
          
          // Get response from provider
          const response = this.providers[providerName].generateResponse(input, chatConfig);
          
          // If successful and keepHistory is true, update message history
          if (response.status === 200 && keepHistory) {
            agent.messageHistory.push(
              { role: 'user', content: input },
              { role: 'assistant', content: response.response }
            );
          }
          
          return response;
        } catch (error) {
          return { status: 500, error: `Error during query execution: ${error.message}` };
        }
      }
    };

    this.agents[agentName] = agent;
    return agent;
  }

  /**
   * Lists all registered agents.
   * @returns {Array<string>} Array of agent names.
   */
  listAgents() {
    return Object.keys(this.agents);
  }

  /**
   * Lists all registered providers.
   * @returns {Array<string>} Array of provider names.
   */
  listProviders() {
    return Object.keys(this.providers);
  }
}

// Provider Implementations

/**
 * @class OpenAIProvider
 * Handles interactions with the OpenAI API for generating responses using their chat completion endpoint.
 * This provider supports various GPT models and handles API authentication, request formatting,
 * and response parsing. It includes built-in error handling for API failures and invalid responses.
 */
class OpenAIProvider {
  /**
   * Generates a response using the OpenAI API.
   * @param {string} input - The input query for the model.
   * @param {Object} config - Configuration options for the request.
   * @returns {Object} Response from the OpenAI API or an error object.
   */
  generateResponse(input, config) {
    const apiKey = config.apiKey || PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
    if (!apiKey) {
      return { status: 400, error: 'OpenAI API key is required.' };
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const payload = {
      model: config.model || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: input }],
      temperature: config.temperature || 0.7,
      max_tokens: config.max_tokens || 100
    };

    const options = {
      method: 'post',
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
      return { status: 500, error: `OpenAIProvider error: ${error.message}` };
    }
  }
}

/**
 * @class OpenAILikeProvider
 * Handles interactions with OpenAI-compatible APIs using custom base URLs.
 */
class OpenAILikeProvider {
  /**
   * Generates a response using an OpenAI-compatible API.
   * @param {string} input - The input query for the model.
   * @param {Object} config - Configuration options for the request.
   * @returns {Object} Response from the API or an error object.
   */
  generateResponse(input, config) {
    const apiKey = config.apiKey || PropertiesService.getScriptProperties().getProperty('OPENAI_LIKE_API_KEY');
    if (!apiKey) {
      return { status: 400, error: 'API key is required.' };
    }

    if (!config.baseURL) {
      return { status: 400, error: 'Base URL is required for OpenAILike provider.' };
    }

    const url = `${config.baseURL}/chat/completions`;
    const payload = {
      model: config.model || 'gpt-3.5-turbo',
      messages: config.messages || [{ role: 'user', content: input }],
      temperature: config.temperature || 0.7,
      max_tokens: config.max_tokens || 100
    };

    const options = {
      method: 'post',
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
      return { status: 500, error: `OpenAILikeProvider error: ${error.message}` };
    }
  }
}

/**
 * @class GoogleAIProvider
 * Placeholder for Google AI provider implementation.
 */
class GoogleAIProvider {
  /**
   * Generates a response using the Google AI API.
   * @param {string} input - The input query for the model.
   * @param {Object} config - Configuration options for the request.
   * @returns {Object} Response from the Google AI API or an error object.
   */
  generateResponse(input, config) {
    const apiKey = config.apiKey || PropertiesService.getScriptProperties().getProperty('GOOGLEAI_API_KEY');
    if (!apiKey) {
      return { status: 400, error: 'Google AI API key is required.' };
    }

    const model = config.model || 'gemini-2.0-flash';

    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent`;
    const payload = {
      contents: [{
        parts: [{
          text: input
        }]
      }],
      generationConfig: {
        temperature: config.temperature || 0.7,
        maxOutputTokens: config.max_tokens || 100
      }
    };

    const options = {
      method: 'post',
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
      return { status: 500, error: `GoogleAIProvider error: ${error.message}` };
    }
  }
}

/**
 * @class DeepSeekProvider
 * Placeholder for DeepSeek provider implementation.
 */
class DeepSeekProvider {
  /**
   * Generates a response using the DeepSeek API.
   * @param {string} input - The input query for the model.
   * @param {Object} config - Configuration options for the request.
   * @returns {Object} Response from the DeepSeek API or an error object.
   */
  generateResponse(input, config) {
    const apiKey = config.apiKey || PropertiesService.getScriptProperties().getProperty('DEEPSEEK_API_KEY');
    if (!apiKey) {
      return { status: 400, error: 'DeepSeek API key is required.' };
    }

    const url = 'https://api.deepseek.com/v1/chat/completions';
    const payload = {
      model: config.model || 'deepseek-chat',
      messages: [{ role: 'user', content: input }],
      temperature: config.temperature || 0.7,
      max_tokens: config.max_tokens || 100
    };

    const options = {
      method: 'post',
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
      return { status: 500, error: `DeepSeekProvider error: ${error.message}` };
    }
  }
}

/**
 * @class OpenRouterProvider
 * Placeholder for OpenRouter provider implementation.
 */
class OpenRouterProvider {
  /**
   * Generates a response using the OpenRouter API.
   * @param {string} input - The input query for the model.
   * @param {Object} config - Configuration options for the request.
   * @returns {Object} Response from the OpenRouter API or an error object.
   */
  generateResponse(input, config) {
    const apiKey = config.apiKey || PropertiesService.getScriptProperties().getProperty('OPENROUTER_API_KEY');
    if (!apiKey) {
      return { status: 400, error: 'OpenRouter API key is required.' };
    }

    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const payload = {
      model: config.model || 'openai/gpt-3.5-turbo',
      messages: [{ role: 'user', content: input }],
      temperature: config.temperature || 0.7,
      max_tokens: config.max_tokens || 100
    };

    const options = {
      method: 'post',
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
      return { status: 500, error: `OpenRouterProvider error: ${error.message}` };
    }
  }
}

/**
 * @class GroqProvider
 * Placeholder for Groq provider implementation.
 */
class GroqProvider {
  /**
   * Generates a response using the Groq API.
   * @param {string} input - The input query for the model.
   * @param {Object} config - Configuration options for the request.
   * @returns {Object} Response from the Groq API or an error object.
   */
  generateResponse(input, config) {
    const apiKey = config.apiKey || PropertiesService.getScriptProperties().getProperty('GROQ_API_KEY');
    if (!apiKey) {
      return { status: 400, error: 'Groq API key is required.' };
    }

    const url = 'https://api.groq.com/openai/v1/chat/completions';
    const payload = {
      model: config.model || 'mixtral-8x7b-32768',
      messages: [{ role: 'user', content: input }],
      temperature: config.temperature || 0.7,
      max_tokens: config.max_tokens || 100
    };

    const options = {
      method: 'post',
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
      return { status: 500, error: `GroqProvider error: ${error.message}` };
    }
  }
}