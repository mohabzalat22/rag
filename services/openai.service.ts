import { MessageService } from "./message.service";
import { Actor } from "@/prisma/generated/enums";
import prisma from "@/prisma/prisma";
import { GoogleGenAI } from "@google/genai";

// Validate API key exists
if (!process.env.GOOGLE_SECRET) {
  throw new Error("GOOGLE_SECRET environment variable is not set");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_SECRET,
});

export const OpenaiService = {
  /**
   * Generate a streaming response from Google Gemini based on chat context
   * @param chatId - The chat ID to get message context from
   * @returns ReadableStream with Gemini response
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

    const userPrompt = `preprompt: ${prompt}. Previous conversation:\n${conversationHistory}\n\n`;

    // Create a ReadableStream that streams Gemini response in SSE format
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // Generate content with streaming
          const response = await ai.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: userPrompt,
          });

          // Stream the response character by character for better UX
          for await (const chunk of response) {
            const content = chunk.text;

            if (content) {
              // Split content into smaller chunks (words or characters) for smoother streaming
              const words = content.split(" ");
              
              for (const word of words) {
                if (word) {
                  // Send each word with a space in SSE format
                  const sseMessage = `data: ${JSON.stringify({ content: word + " " })}\n\n`;
                  controller.enqueue(encoder.encode(sseMessage));
                  
                  // Add a small delay between words for visible streaming effect
                  await new Promise((resolve) => setTimeout(resolve, 30));
                }
              }
            }
          }

          // Send done signal
          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));

          // Close the stream
          controller.close();
        } catch (error) {
          console.error("Google Gemini streaming error:", error);
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