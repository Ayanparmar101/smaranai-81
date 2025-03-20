import { toast } from "sonner";

// OpenAI API interface
interface OpenAICompletion {
  model: string;
  messages: Array<{
    role: "system" | "user" | "assistant";
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

// OpenAI completion options
interface CompletionOptions {
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
  onChunk?: (chunk: string) => void;
}

class OpenAIService {
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

  async createCompletion(
    systemPrompt: string,
    userPrompt: string,
    options: CompletionOptions = {}
  ): Promise<string> {
    if (!this.apiKey) {
      throw new Error("API key not set");
    }

    const { temperature = 0.7, max_tokens = 1000, stream = false, onChunk } = options;

    const payload: OpenAICompletion = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature,
      max_tokens,
      stream,
    };

    try {
      if (stream && onChunk) {
        return await this.streamCompletion(payload, onChunk);
      } else {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error?.message || "Error calling OpenAI API");
        }

        const data = await response.json();
        return data.choices[0].message.content;
      }
    } catch (error) {
      console.error("OpenAI API error:", error);
      toast.error("Error: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    }
  }

  private async streamCompletion(
    payload: OpenAICompletion,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({ ...payload, stream: true }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Error calling OpenAI API");
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullText = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value);
        const lines = chunk
          .split("\n")
          .filter((line) => line.trim() !== "" && line.trim() !== "data: [DONE]");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6);
            try {
              const json = JSON.parse(jsonStr);
              const content = json.choices[0]?.delta?.content;
              if (content) {
                fullText += content;
                onChunk(content);
              }
            } catch (e) {
              console.error("Error parsing JSON from stream:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error reading stream:", error);
      throw error;
    }

    return fullText;
  }

  async generateImage(prompt: string, size: "1024x1024" | "1024x1792" | "1792x1024" = "1024x1024"): Promise<string> {
    if (!this.apiKey) {
      throw new Error("API key not set");
    }

    try {
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size,
          quality: "standard",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Error generating image");
      }

      const data = await response.json();
      return data.data[0].url;
    } catch (error) {
      console.error("Image generation error:", error);
      toast.error("Error generating image: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    }
  }
}

// Create and export a single instance
export const openaiService = new OpenAIService();
