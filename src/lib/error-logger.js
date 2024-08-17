// This is a mock error logging service. In a real application, you would
// use a proper error logging service like Sentry or LogRocket.

export function logError(error, context = {}) {
  console.error('Error logged:', error, 'Context:', context);
  
  // In a real application, you would send this error to your logging service
  // For example, if using Sentry:
  // Sentry.captureException(error, { extra: context });
}

export function logInfo(message, data = {}) {
  console.log('Info logged:', message, 'Data:', data);
  
  // In a real application, you would send this info to your logging service
  // For example, if using Sentry:
  // Sentry.captureMessage(message, { level: 'info', extra: data });
}

// You can add more logging functions as needed, such as logWarning, logDebug, etc.