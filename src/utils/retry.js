export async function withRetry(fn, options = {}) {
  const {
    retries = 3,
    delay = 1000,
    onRetry = null
  } = options;

  let lastError;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === retries) {
        break;
      }

      if (onRetry) {
        onRetry(error, attempt);
      }

      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  throw lastError;
}