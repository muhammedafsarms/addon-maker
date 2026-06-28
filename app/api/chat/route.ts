import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Give the chat AI a different personality than the generator AI
    const systemInstruction = `You are a friendly and expert Minecraft Bedrock Add-on developer assistant. 
    The user will ask you for suggestions, debugging help, or how things work in Minecraft. 
    Keep your answers concise, helpful, and format any code examples clearly. Do NOT generate a zip file here, just talk to the user.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: message,
        config: {
            systemInstruction: systemInstruction,
        }
    });

    return NextResponse.json({ reply: response.text });
    
  } catch (error) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Failed to chat" }, { status: 500 });
  }
}
