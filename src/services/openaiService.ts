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

// OpenAI TTS options
interface TTSOptions {
  voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  speed?: number;
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
            Authorization: `Bearer ${this.apiKey}`,
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

  async generateStorySegments(storyText: string): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error("API key not set");
    }

    try {
      const systemPrompt = `You are a helpful assistant that divides stories into segments for illustration. 
      Given a story, divide it into exactly 4 segments of roughly equal length while ensuring each segment 
      has a clear event or scene that could be illustrated. The segments should flow naturally and maintain 
      the narrative structure. Return ONLY the 4 segments as a JSON array of strings, with no additional text.`;

      const result = await this.createCompletion(systemPrompt, storyText, { max_tokens: 2000 });
      
      try {
        // Try to parse as direct JSON
        return JSON.parse(result);
      } catch (e) {
        // If direct parsing fails, try to extract JSON from text
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Failed to parse story segments");
        }
      }
    } catch (error) {
      console.error("Error generating story segments:", error);
      toast.error("Failed to divide story into segments. Please try again.");
      throw error;
    }
  }

  async generateConsistentImagePrompts(storyText: string, segments: string[]): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error("API key not set");
    }

    try {
      const systemPrompt = `You are a helpful assistant that creates consistent art prompts for children's story illustrations.
      Given a full story and its 4 segments, create 4 detailed prompts that will generate consistent illustrations.
      
      Important guidelines:
      1. Extract character descriptions, settings, and mood from the whole story.
      2. Ensure the same characters appear across all illustrations with consistent appearance.
      3. Use consistent art style, colors, and background elements throughout.
      4. Each prompt should focus on illustrating the key event in its corresponding segment.
      5. All prompts should specify "colorful children's book illustration with doodle style"
      6. Keep each prompt under 200 characters.
      
      Return ONLY the 4 prompts as a JSON array of strings with no additional text.`;

      const userPrompt = `Full Story: ${storyText}
      
      Segment 1: ${segments[0]}
      Segment 2: ${segments[1]}
      Segment 3: ${segments[2]}
      Segment 4: ${segments[3]}`;

      const result = await this.createCompletion(systemPrompt, userPrompt, { max_tokens: 2000 });
      
      try {
        // Try to parse as direct JSON
        return JSON.parse(result);
      } catch (e) {
        // If direct parsing fails, try to extract JSON from text
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Failed to parse image prompts");
        }
      }
    } catch (error) {
      console.error("Error generating consistent image prompts:", error);
      toast.error("Failed to create consistent prompts. Please try again.");
      throw error;
    }
  }

  async generateMultipleImages(prompts: string[]): Promise<string[]> {
    if (!this.apiKey) {
      throw new Error("API key not set");
    }
    
    try {
      const imageUrls: string[] = [];
      
      for (const prompt of prompts) {
        const enhancedPrompt = prompt + ", children's book illustration style, colorful doodles, cute characters, happy mood";
        const imageUrl = await this.generateImage(enhancedPrompt);
        imageUrls.push(imageUrl);
      }
      
      return imageUrls;
    } catch (error) {
      console.error("Error generating multiple images:", error);
      toast.error("Failed to generate all images. Please try again.");
      throw error;
    }
  }

  async generateSpeech(text: string, options: TTSOptions = {}): Promise<ArrayBuffer> {
    if (!this.apiKey) {
      throw new Error("API key not set");
    }

    try {
      const { voice = "nova", speed = 1.0 } = options;
      
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "tts-1", // The OpenAI TTS model
          input: text,
          voice,
          speed,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Error generating speech");
      }

      const audioData = await response.arrayBuffer();
      return audioData;
    } catch (error) {
      console.error("Speech generation error:", error);
      toast.error("Error generating speech: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    }
  }
}

// Create and export a single instance
export const openaiService = new OpenAIService();
