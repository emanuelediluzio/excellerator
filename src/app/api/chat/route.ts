import { NextRequest, NextResponse } from "next/server";
import { model } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const { message, data, history } = await req.json();

        const prompt = `
      You are an intelligent data assistant helping a user manage an Excel-like dataset.
      
      CURRENT DATA:
      ${JSON.stringify(data)}

      USER REQUEST: "${message}"

      CHAT HISTORY:
      ${JSON.stringify(history)}

      INSTRUCTIONS:
      1. Analyze the user's request.
      2. If the user asks to modify the data (e.g., "Change row 1 price to 500", "Fix the typo in Name"), PERFORM THE MODIFICATION on the dataset.
      3. If the user asks a question (e.g., "What is the total?", "Who has the highest score?"), answer it.
      4. RETURN A JSON OBJECT with the following structure:
         {
           "response": "Your conversational response to the user.",
           "updatedData": [ ... the modified dataset ... ] // ONLY include this if you modified the data. If no changes, set to null or omit.
         }
      5. BE STRICT: "updatedData" must be the COMPLETE dataset with changes applied. Do not output partial rows.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        let parsedResult;
        try {
            parsedResult = JSON.parse(jsonString);
        } catch (e) {
            // Fallback if model just returns text
            parsedResult = { response: text };
        }

        return NextResponse.json(parsedResult);

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
    }
}
