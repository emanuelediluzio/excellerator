import { NextRequest, NextResponse } from "next/server";
import { model, fileToGenerativePart } from "@/lib/gemini";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;
        const promptInstructions = formData.get("prompt") as string || "";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = buffer.toString("base64");

        // Prepare parts for Gemini
        const imagePart = fileToGenerativePart(base64Data, file.type);

        // Robust prompt for extraction
        const prompt = `
      You are an expert data entry AI. Your task is to extract data from this document image into a structured JSON format that can be easily converted to an Excel spreadsheet.
      
      RULES:
      1. Analyze the document structure (tables, lists, forms).
      2. If it's a table, return an array of objects where keys are headers.
      3. If it's a form, return a flat object or nested objects if logical.
      4. Handle handwritten text carefully. If illegible, use "[?]" or make a best guess.
      5. Consolidate specific instructions from the user: "${promptInstructions}"
      6. OUTPUT MUST BE PURE JSON. No markdown backticks, no explanatory text.
      7. The root of the JSON should be an object with a "data" property containing the main array of rows, or key-value pairs if not tabular.
         Example format: { "data": [ { "Column1": "Value1", "Column2": "Value2" }, ... ] }
    `;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean up markdown if Gemini adds it despite instructions
        const jsonString = text.replace(/```json/g, "").replace(/```/g, "").trim();

        const data = JSON.parse(jsonString);

        return NextResponse.json(data);

    } catch (error) {
        console.error("Error processing document:", error);
        return NextResponse.json({ error: "Failed to process document" }, { status: 500 });
    }
}
