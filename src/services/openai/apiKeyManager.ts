
/**
 * Manages the OpenAI API key storage and retrieval
 */
class ApiKeyManager {
  private apiKey: string | null = null;

  constructor() {
    // Always prioritize env variables first
    this.loadApiKey();
  }
  
  // Load the API key from environment or localStorage
  private loadApiKey(): void {
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
    // Always check env variable first in case it was updated
    const envApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (envApiKey) {
      return envApiKey;
    }
    // Fall back to stored key
    return this.apiKey;
  }

  // Check if key appears to be valid format
  isValidKeyFormat(): boolean {
    const apiKey = this.getApiKey();
    if (!apiKey) return false;
    
    // Check if it's a project key (starts with sk-proj-) or a standard key (starts with sk-)
    return apiKey.startsWith('sk-proj-') || apiKey.startsWith('sk-');
  }
  
  // Check if the API key is a project key (starts with sk-proj-)
  isProjectKey(): boolean {
    const apiKey = this.getApiKey();
    if (!apiKey) return false;
    
    return apiKey.startsWith('sk-proj-');
  }
  
  // Create headers for OpenAI API requests with proper authentication
  createHeaders(): Record<string, string> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error("API key not set");
    }
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    };
    
    // Add the beta header for project API keys
    if (this.isProjectKey()) {
      headers['OpenAI-Beta'] = 'assistants=v1';
    }
    
    return headers;
  }
}

export const apiKeyManager = new ApiKeyManager();
