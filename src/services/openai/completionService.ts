
import { toast } from "sonner";
import { apiKeyManager } from "./apiKeyManager";
import { CompletionOptions, OpenAICompletion } from "./types";

/**
 * Handles text completions using OpenAI's API
 */
class CompletionService {
  async createCompletion(
    systemPrompt: string,
    userPrompt: string,
    options: CompletionOptions = {}
  ): Promise<string> {
    const apiKey = apiKeyManager.getApiKey();
    if (!apiKey) {
      throw new Error("API key not set");
    }

    const { temperature = 0.7, max_tokens = 1000, stream = false, onChunk } = options;

    const payload: OpenAICompletion = {
      model: "gpt-4o-mini", // Using the mini model for efficiency
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
        console.log(`Making request with max_tokens: ${max_tokens}`);
        
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("OpenAI API error response:", error);
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
    const apiKey = apiKeyManager.getApiKey();
    if (!apiKey) {
      throw new Error("API key not set");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
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
}

export const completionService = new CompletionService();
