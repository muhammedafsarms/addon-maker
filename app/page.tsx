"use client";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingAddon, setLoadingAddon] = useState(false);

  // Function 1: Handle normal chatting
  const sendChat = async () => {
    if (!input) return;
    const userMsg = input;
    setInput(""); // clear input box
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoadingChat(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "ai", text: data.reply || "Error." }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "ai", text: "Oops, connection failed." }]);
    }
    setLoadingChat(false);
  };

  // Function 2: Handle generating the Add-on
  const generateAddon = async () => {
    if (!input) return;
    setLoadingAddon(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) throw new Error("Failed to generate");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "custom_ai_mod.mcaddon";
      a.click();
    } catch (error) {
      alert("Failed to build the Add-on. Try tweaking your prompt.");
    }
    setLoadingAddon(false);
  };

  return (
    <main className="flex h-screen flex-col bg-zinc-900 text-white">
      {/* Header */}
      <header className="p-4 bg-zinc-950 border-b border-zinc-800 text-center shadow-md">
        <h1 className="text-2xl font-bold text-green-400">Add-on Co-Pilot</h1>
        <p className="text-xs text-zinc-400">Chat for ideas, or build to generate.</p>
      </header>

      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-zinc-500 text-center mt-10">
            Ask me how to make a custom mob, or describe what you want to build!
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === "user" ? "bg-green-600 text-white rounded-br-none" : "bg-zinc-800 text-zinc-200 rounded-bl-none border border-zinc-700 whitespace-pre-wrap"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loadingChat && (
          <div className="text-zinc-500 text-sm animate-pulse">AI is typing...</div>
        )}
      </div>

      {/* Input & Buttons Area */}
      <div className="p-4 bg-zinc-950 border-t border-zinc-800">
        <textarea 
          className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none mb-3 resize-none"
          rows={3}
          placeholder="E.g., How do I make a custom sword? OR Make a fire sword mod..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        
        <div className="flex gap-2">
          <button 
            onClick={sendChat}
            disabled={loadingChat || loadingAddon || !input}
            className="flex-1 py-3 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 rounded-xl font-bold transition-all"
          >
            💬 Chat
          </button>
          
          <button 
            onClick={generateAddon}
            disabled={loadingChat || loadingAddon || !input}
            className="flex-1 py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 rounded-xl font-bold transition-all"
          >
            {loadingAddon ? "Building..." : "📦 Build Add-on"}
          </button>
        </div>
      </div>
    </main>
  );
}
