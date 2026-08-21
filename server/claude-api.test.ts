import { describe, it, expect } from "vitest";
import Anthropic from "@anthropic-ai/sdk";

describe("Claude API Integration", () => {
  it("should validate API key by making a test request", async () => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }

    const client = new Anthropic({ apiKey });

    try {
      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 100,
        messages: [
          {
            role: "user",
            content: "Say 'API key is valid' if you can read this.",
          },
        ],
      });

      expect(response).toBeDefined();
      expect(response.content).toBeDefined();
      expect(response.content.length).toBeGreaterThan(0);
    } catch (error: any) {
      if (error.status === 401) {
        throw new Error("Invalid Claude API key - authentication failed");
      }
      throw error;
    }
  });
});
