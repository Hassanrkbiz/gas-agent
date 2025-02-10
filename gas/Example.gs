/**
 * Example usage of GAS Agent library
 */

function basicExample() {
  // Initialize the GAS Agent
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

function chatExample() {
  const gasAgent = new GASAgent();

  // Create an agent with OpenAI and a system prompt
  const agent = gasAgent.createAgent('chatAgent', 'OpenAI', {
    model: 'gpt-3.5-turbo',
    systemPrompt: 'You are a helpful assistant who speaks in a friendly and concise manner.'
  });

  // First interaction
  const response1 = agent.query('What is your favorite color?');
  Logger.log('First response:', response1);

  // Second interaction (will include context from first interaction)
  const response2 = agent.query('Why do you like that color?');
  Logger.log('Second response:', response2);

  // View message history
  const history = agent.getHistory();
  Logger.log('Chat history:', history);

  // Clear history if needed
  agent.clearHistory();
  Logger.log('History after clearing:', agent.getHistory());

  // Change system prompt
  agent.setSystemPrompt('You are now a professional color expert.');
  const response3 = agent.query('Tell me about the psychology of blue.');
  Logger.log('Response with new system prompt:', response3);

  // Example of a query without keeping history
  const response4 = agent.query('What is your favorite season?', false);
  Logger.log('Response without keeping history:', response4);
  Logger.log('History remains unchanged:', agent.getHistory());
}

function multiProviderExample() {
  const gasAgent = new GASAgent();

  // Create agents with different providers
  const openaiAgent = gasAgent.createAgent('openaiAgent', 'OpenAI', {
    model: 'gpt-4',
    temperature: 0.7,
    max_tokens: 150
  });

  const geminiAgent = gasAgent.createAgent('geminiAgent', 'GoogleAI', {
    temperature: 0.5,
    max_tokens: 200
  });

  const deepseekAgent = gasAgent.createAgent('deepseekAgent', 'DeepSeek', {
    model: 'deepseek-chat',
    temperature: 0.8
  });

  // Compare responses from different providers
  const prompt = 'Explain quantum computing in simple terms.';
  
  const responses = {
    openai: openaiAgent.query(prompt),
    gemini: geminiAgent.query(prompt),
    deepseek: deepseekAgent.query(prompt)
  };

  Logger.log('Responses from different providers:');
  Logger.log(responses);
}

function errorHandlingExample() {
  const gasAgent = new GASAgent();

  try {
    // Attempt to create an agent with invalid provider
    const invalidAgent = gasAgent.createAgent('invalidAgent', 'InvalidProvider', {});
  } catch (error) {
    Logger.log('Error creating agent:', error.message);
  }

  // Create a valid agent
  const agent = gasAgent.createAgent('validAgent', 'OpenAI', {
    model: 'gpt-3.5-turbo'
  });

  // Handle empty input
  const emptyResponse = agent.query('');
  Logger.log('Empty input response:', emptyResponse);

  // Handle valid input
  const validResponse = agent.query('Hello, how are you?');
  Logger.log('Valid input response:', validResponse);
}

function customConfigExample() {
  const gasAgent = new GASAgent();

  // OpenRouter with custom configuration
  const routerAgent = gasAgent.createAgent('routerAgent', 'OpenRouter', {
    model: 'openai/gpt-3.5-turbo',
    temperature: 0.7,
    max_tokens: 100,
    referer: 'https://my-app.com',
    title: 'Custom App'
  });

  // Groq with custom model
  const groqAgent = gasAgent.createAgent('groqAgent', 'Groq', {
    model: 'mixtral-8x7b-32768',
    temperature: 0.8,
    max_tokens: 200
  });

  // Test custom configurations
  const prompt = 'Write a short poem about technology.';
  
  const routerResponse = routerAgent.query(prompt);
  Logger.log('OpenRouter Response:', routerResponse);

  const groqResponse = groqAgent.query(prompt);
  Logger.log('Groq Response:', groqResponse);
}

function agentManagementExample() {
  const gasAgent = new GASAgent();

  // Create multiple agents
  const agents = [
    gasAgent.createAgent('agent1', 'OpenAI', { model: 'gpt-3.5-turbo' }),
    gasAgent.createAgent('agent2', 'GoogleAI', {}),
    gasAgent.createAgent('agent3', 'DeepSeek', { model: 'deepseek-chat' })
  ];

  // List all created agents
  const agentList = gasAgent.listAgents();
  Logger.log('Created agents:', agentList);

  // List available providers
  const providers = gasAgent.listProviders();
  Logger.log('Available providers:', providers);
}

/**
 * API Key Management Examples
 */

function setupApiKeysExample() {
  // Get the script's property store
  const scriptProperties = PropertiesService.getScriptProperties();
  
  // Set API keys (Replace these with your actual API keys)
  scriptProperties.setProperties({
    'OPENAI_API_KEY': 'your-openai-api-key',
    'GOOGLEAI_API_KEY': 'your-googleai-api-key',
    'DEEPSEEK_API_KEY': 'your-deepseek-api-key',
    'OPENROUTER_API_KEY': 'your-openrouter-api-key',
    'GROQ_API_KEY': 'your-groq-api-key'
  });
  
  Logger.log('API keys have been set successfully!');
}

function verifyApiKeysExample() {
  const providers = ['OPENAI', 'GOOGLEAI', 'DEEPSEEK', 'OPENROUTER', 'GROQ'];
  const scriptProperties = PropertiesService.getScriptProperties();
  const results = {};
  
  providers.forEach(provider => {
    const key = scriptProperties.getProperty(`${provider}_API_KEY`);
    results[provider] = key ? 'Set' : 'Not Set';
  });
  
  Logger.log('API Key Status:');
  Logger.log(results);
  
  return results;
}

function clearApiKeysExample() {
  const scriptProperties = PropertiesService.getScriptProperties();
  const providers = ['OPENAI', 'GOOGLEAI', 'DEEPSEEK', 'OPENROUTER', 'GROQ'];
  
  providers.forEach(provider => {
    scriptProperties.deleteProperty(`${provider}_API_KEY`);
  });
  
  Logger.log('All API keys have been cleared.');
}