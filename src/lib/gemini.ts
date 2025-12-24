import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
// Ensure NEXT_PUBLIC_GEMINI_API_KEY is set in your .env.local file
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig: {
        temperature: 0.1, // Low temperature for factual data extraction
    }
});

// Helper for image to blob
export function fileToGenerativePart(base64Data: string, mimeType: string) {
    return {
        inlineData: {
            data: base64Data,
            mimeType
        },
    };
}
