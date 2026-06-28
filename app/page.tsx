"use client";
import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const generateAddon = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      // This grabs the virtual ZIP file and triggers a browser download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "custom_ai_mod.mcaddon";
      a.click();
    } catch (error) {
      alert("Oops! The AI got confused. Try again.");
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-2 text-green-400">AI Add-on Maker</h1>
      <p className="text-zinc-400 mb-8 text-center">Describe a mob or item, get a .mcaddon file.</p>
      
      <textarea 
        className="w-full max-w-md p-4 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none mb-4"
        rows={4}
        placeholder="E.g., Make a super fast zombie that drops diamonds..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      
      <button 
        onClick={generateAddon}
        disabled={loading || !prompt}
        className="px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 rounded-full font-bold transition-all w-full max-w-md"
      >
        {loading ? "Crafting Add-on..." : "Generate & Download"}
      </button>
    </main>
  );
}
