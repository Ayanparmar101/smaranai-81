
/**
 * Manages the OpenAI API key storage and retrieval
 */
class ApiKeyManager {
  private apiKey: string | null = null;

  constructor() {
    // Try to get the API key from env
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envApiKey) {
      this.apiKey = envApiKey;
    } else {
      // If no key is set in env, try to get from localStorage as fallback
      const savedApiKey = localStorage.getItem("openaiApiKey");
      if (savedApiKey) {
        this.apiKey = savedApiKey;
      }
    }
  }

  setApiKey(key: string): void {
    this.apiKey = key;
    localStorage.setItem("openaiApiKey", key);
  }

  getApiKey(): string | null {
    return this.apiKey;
  }

  // Check if key appears to be valid format
  isValidKeyFormat(): boolean {
    const apiKey = this.getApiKey();
    if (!apiKey) return false;
    
    // Check if it's a project key (starts with sk-proj-) or a standard key (starts with sk-)
    return apiKey.startsWith('sk-proj-') || apiKey.startsWith('sk-');
  }
}

export const apiKeyManager = new ApiKeyManager();
