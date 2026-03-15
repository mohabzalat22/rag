import { MessageService } from "./message.service";
import { Actor } from "@/prisma/generated/enums";
import prisma from "@/prisma/prisma";

export const AIService = {
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

    const prompt = await prisma.prompt.findFirst();

    // Format messages for conversation context as an array of structured objects
    const formattedMessages: { role: string; content: string }[] = [];
    
    if (prompt?.prompt) {
      formattedMessages.push({
        role: "system",
        content: prompt.prompt
      });
    }

    const conversationHistory = messages.map((m) => ({
      role: m.actor === Actor.USER ? "user" : "assistant",
      content: m.message
    }));

    formattedMessages.push(...conversationHistory);

    // Create a ReadableStream that streams Ollama response in SSE format
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          const requestBody = {
            model: process.env.OLLAMA_MODEL || "minimax-m2.5:cloud", // Using the model currently available in Ollama
            messages: formattedMessages,
            stream: true,
          };
          console.log("SENDING TO OLLAMA:", JSON.stringify(requestBody, null, 2));

          // Generate content with streaming from Ollama using the chat endpoint
          const response = await fetch(`${process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434"}/api/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          });
          
          if (!response.ok || !response.body) {
            console.error("Ollama Response Not OK:", response.status, response.statusText);
            throw new Error(`Cannot establish a connection to Ollama connect on ${process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434"}.`);
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
                if (parsed.message?.content !== undefined) {
                  // Send each chunk in SSE format
                  const sseMessage = `data: ${JSON.stringify({ content: parsed.message.content })}\n\n`;
                  controller.enqueue(encoder.encode(sseMessage));
                }
              } catch (e) {
                // Ignore parse errors on incomplete chunks
                console.error("Parse error on chunk:", line);
              }
            }
          }

          console.log("OLLAMA STREAM DONE");

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