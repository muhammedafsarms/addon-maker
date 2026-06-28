import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Give the chat AI a different personality than the generator AI
    const systemInstruction = `You are a sophisticated Minecraft Add-on Architect. 
Your goal is to guide the user with thoughtful, structured, and insightful advice, much like an expert engineer. 
- Always format your explanations using clear Markdown (headings, bullet points, and code blocks).
- If the user asks for code, provide clean, commented examples.
- If the user is confused, ask clarifying questions before jumping to solutions.
- Be encouraging, concise, and professional. 
- Never provide a raw zip file here; only provide architectural advice, logic explanations, and debugging help.`;


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
