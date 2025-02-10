# GAS Agent

A powerful Google Apps Script library for integrating AI agents with multiple Language Model providers. This library makes it easy to use various AI models in your Google Apps Script projects with a unified, simple interface.

## Features

- Support for multiple AI providers:
  - OpenAI (GPT-3.5, GPT-4)
  - Google AI (Gemini)
  - DeepSeek
  - OpenRouter
  - Groq
  - Custom OpenAI-compatible endpoints
- Conversation history management
- System prompt customization
- TypeScript support
- Easy integration with Google Apps Script

## Usage Approaches

There are two ways to use GAS Agent in your Google Apps Script projects:

### 1. Direct Google Apps Script IDE Integration

1. Create a new Google Apps Script project at [script.google.com](https://script.google.com)
2. Copy the contents of `gas/Code.gs` into your project
3. (Optional) Copy `gas/Example.gs` for reference implementations

This approach is ideal for:
- Quick prototyping
- Simple projects
- Users who prefer working directly in the Google Apps Script IDE

### 2. NPM Package with Clasp

1. Install the package:
```bash
npm install gas-agent
```

2. Set up clasp in your project:
```bash
npm install -g @google/clasp
clasp login
clasp create --type standalone
```

3. Push your changes to Google Apps Script:
```bash
npm run push
```

This approach is recommended for:
- Larger projects
- TypeScript development
- Version control integration
- Modern development workflow

## API Key Configuration

You have two options for configuring API keys:

### 1. Script Properties (Recommended)

Set up your API keys securely using Google Apps Script's Script Properties:

```javascript
function setupApiKeys() {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperties({
    'OPENAI_API_KEY': 'your-openai-api-key',
    'GOOGLEAI_API_KEY': 'your-googleai-api-key',
    'DEEPSEEK_API_KEY': 'your-deepseek-api-key',
    'OPENROUTER_API_KEY': 'your-openrouter-api-key',
    'GROQ_API_KEY': 'your-groq-api-key'
  });
}
```

### 2. Direct Configuration

Provide API keys directly in the agent configuration:

```javascript
const agent = gasAgent.createAgent('myAgent', 'OpenAI', {
  apiKey: 'your-openai-api-key',
  model: 'gpt-3.5-turbo'
});
```

**Note:** The Script Properties approach is more secure and recommended for production use.

## Usage Examples

### Basic Example
```typescript
function example() {
  const gasAgent = new GASAgent();
  
  // Create an agent with OpenAI
  const agent = gasAgent.createAgent('myAgent', 'OpenAI', {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    max_tokens: 100
  });

  // Query the agent
  const response = agent.query('What is the capital of France?');
  Logger.log(response);
}
```

### Chat Example with History
```typescript
function chatExample() {
  const gasAgent = new GASAgent();

  const agent = gasAgent.createAgent('chatAgent', 'OpenAI', {
    model: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful assistant who speaks in a friendly manner.'
  });

  // First interaction
  const response1 = agent.query('What is your favorite color?');
  
  // Second interaction (includes context from first interaction)
  const response2 = agent.query('Why do you like that color?');
  
  // View chat history
  const history = agent.getHistory();
  
  // Clear history if needed
  agent.clearHistory();
}
```

### Multiple Providers Example
```typescript
function multiProviderExample() {
  const gasAgent = new GASAgent();

  const openaiAgent = gasAgent.createAgent('openaiAgent', 'OpenAI', {
    model: 'gpt-4'
  });

  const geminiAgent = gasAgent.createAgent('geminiAgent', 'GoogleAI', {
    model: 'gemini-2.0-flash'
  });

  const groqAgent = gasAgent.createAgent('groqAgent', 'Groq', {
    model: 'mixtral-8x7b-32768'
  });

  // Compare responses
  const prompt = 'Explain quantum computing in simple terms.';
  const responses = {
    openai: openaiAgent.query(prompt),
    gemini: geminiAgent.query(prompt),
    groq: groqAgent.query(prompt)
  };
}
```

## API Reference

### GASAgent Class
- `createAgent(agentName: string, providerName: ProviderName, config: ProviderConfig): Agent`
- `listAgents(): string[]`
- `listProviders(): ProviderName[]`

### Agent Interface
- `setSystemPrompt(prompt: string): void`
- `clearHistory(): void`
- `getHistory(): Message[]`
- `query(input: string, keepHistory?: boolean): ProviderResponse`

### Provider Configuration
```typescript
interface ProviderConfig {
  apiKey?: string;
  model?: string;
  systemPrompt?: string;
  temperature?: number;
  max_tokens?: number;
  baseURL?: string;  // For OpenAILike provider
  referer?: string;  // For OpenRouter
  title?: string;    // For OpenRouter
}
```

## License

MIT

## Contributing

We welcome contributions to GAS Agent! Here's how you can help:

### Development Setup

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/gas-agent.git
cd gas-agent
```
3. Install dependencies:
```bash
npm install
```
4. Set up Google Apps Script development environment:
```bash
npm install -g @google/clasp
clasp login
clasp create --type standalone
```

### Development Workflow

1. Create a new branch for your feature/fix:
```bash
git checkout -b feature-name
```
2. Make your changes
3. Run tests:
```bash
npm test
```
4. Build the project:
```bash
npm run build
```
5. Push to Google Apps Script to test:
```bash
npm run push
```

### Coding Standards

- Write clean, readable, and well-documented code
- Follow TypeScript best practices
- Add appropriate JSDoc comments for new functions
- Maintain consistent code style with the existing codebase
- Write tests for new features

### Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation if you're adding or changing functionality
3. Ensure all tests pass
4. Create a Pull Request with a clear title and description

### Reporting Issues

- Use the GitHub issue tracker
- Provide a clear description of the issue
- Include steps to reproduce if applicable
- Mention your environment details

### Questions or Suggestions?

Feel free to open an issue for discussion or reach out through GitHub.