import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import JSZip from "jszip";

// Connect to Gemini using your hidden key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    // 1. Give Gemini strict instructions
    const systemInstruction = `You are an expert Minecraft Bedrock Add-on generator. 
    The user will give you a prompt. You must generate the required JSON files to make that prompt a reality. 
    You must output EXACTLY a JSON object where the keys are the strict file paths (e.g., "behavior_pack/manifest.json", "resource_pack/manifest.json", "behavior_pack/entities/custom.json") and the values are the stringified file content. 
    ALWAYS include valid manifest.json files with unique UUIDs for both the behavior_pack and resource_pack. Do not output any markdown or explanation, ONLY the JSON object.`;

    // 2. Send the prompt to the AI
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
        }
    });

    // 3. Parse the AI's output
    const responseText = response.text || "{}";
    const generatedFiles = JSON.parse(responseText);

    // 4. Create a virtual ZIP file (.mcaddon)
    const zip = new JSZip();
    for (const [filePath, fileContent] of Object.entries(generatedFiles)) {
      zip.file(filePath, fileContent as string);
    }
    const zipBuffer = await zip.generateAsync({ type: "uint8array" });

    // 5. Send the finished .mcaddon file back to the user
    return new NextResponse(zipBuffer, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": "attachment; filename=ai-generated.mcaddon",
      },
    });
    
  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate add-on" }, { status: 500 });
  }
}
