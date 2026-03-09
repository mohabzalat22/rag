import { MessageService } from "./message.service";
import { Actor } from "@/prisma/generated/enums";
import prisma from "@/prisma/prisma";

export const OpenaiService = {
  /**
   * Generate a streaming response from Ollama based on chat context
   * @param chatId - The chat ID to get message context from
   * @returns ReadableStream with Ollama response
   */
  respond: async (chatId: number) => {
    // Get all messages from specific chat for context
    const messages = await MessageService.getAll(chatId);

    if (!messages) {
      throw new Error("Unable to fetch messages for context");
    }

    // Format messages for conversation context
    const conversationHistory = messages
      .map((m) => `${m.actor === Actor.USER ? "User" : "Assistant"}: ${m.message}`)
      .join("\n");

    const prompt = await prisma.prompt.findFirst();

    const userPrompt = `preprompt: ${prompt?.prompt || ""}. Previous conversation:\n${conversationHistory}\n\n`;

    // Create a ReadableStream that streams Ollama response in SSE format
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // Generate content with streaming from Ollama
          const response = await fetch("http://127.0.0.1:11434/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "minimax-m2.5:cloud", // Using the model currently available in Ollama
              prompt: userPrompt,
              stream: true,
            }),
          });
          
          if (!response.ok || !response.body) {
            throw new Error("Cannot establish a connection to Ollama.");
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split("\n");

            for (const line of lines) {
              if (line.trim() === "") continue;
              try {
                const parsed = JSON.parse(line);
                if (parsed.response) {
                  // Send each chunk in SSE format
                  const sseMessage = `data: ${JSON.stringify({ content: parsed.response })}\n\n`;
                  controller.enqueue(encoder.encode(sseMessage));
                }
              } catch (e) {
                // Ignore parse errors on incomplete chunks
              }
            }
          }

          // Send done signal
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));

          // Close the stream
          controller.close();
        } catch (error) {
          console.error("Ollama streaming error:", error);
          controller.error(error);
        }
      },
    });

    return stream;
  },

  /**
   * Save the complete AI response to the database
   * @param chatId - The chat ID to save the message to
   * @param message - The complete AI response message
   */
  saveResponse: async (chatId: number, message: string) => {
    const messageData = {
      chatId,
      actor: Actor.ASSISTANT,
      message,
    };

    return await MessageService.create(messageData);
  },
};