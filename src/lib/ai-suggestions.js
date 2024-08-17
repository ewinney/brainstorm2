import { logError } from './error-logger';

export async function getAISuggestion(prompt, context) {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Use the context to generate more relevant suggestions
    const contextKeywords = context.toLowerCase().split(' ');
    const suggestions = [
      "Consider the impact on different stakeholders.",
      "Think about potential long-term consequences.",
      "Explore alternative approaches to this problem.",
      "Identify any assumptions you're making and challenge them.",
      "Consider how this idea aligns with the overall strategy.",
      `Have you thought about how ${contextKeywords[Math.floor(Math.random() * contextKeywords.length)]} relates to this?`,
      `What if we combine this idea with ${contextKeywords[Math.floor(Math.random() * contextKeywords.length)]}?`,
      "How does this idea fit into the bigger picture?",
      "What are the potential risks and how can we mitigate them?",
      "How can we measure the success of this idea?",
    ];

    // Simple keyword matching to improve relevance
    const relevantSuggestions = suggestions.filter(suggestion => 
      contextKeywords.some(keyword => suggestion.toLowerCase().includes(keyword))
    );

    if (relevantSuggestions.length > 0) {
      return relevantSuggestions[Math.floor(Math.random() * relevantSuggestions.length)];
    } else {
      return suggestions[Math.floor(Math.random() * suggestions.length)];
    }
  } catch (error) {
    logError(error, { prompt, context });
    throw new Error('Failed to get AI suggestion');
  }
}