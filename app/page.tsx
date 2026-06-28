import ReactMarkdown from 'react-markdown';
"use client";
import { useState } from "react";
import ReactMarkdown from 'react-markdown';

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const sendChat = async () => {
    if (!input) return;
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);
    const res = await fetch("/api/chat", { method: "POST", body: JSON.stringify({ message: userMsg }), headers: {"Content-Type": "application/json"} });
    const data = await res.json();
    setMessages(prev => [...prev, { role: "ai", text: data.reply }]);
    setLoading(false);
  };

  const generateAddon = async () => {
    setLoading(true);
    const res = await fetch("/api/generate", { method: "POST", body: JSON.stringify({ prompt: input }), headers: {"Content-Type": "application/json"} });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "custom_mod.mcaddon"; a.click();
    setLoading(false);
  };

  return (
    <main className="flex h-screen flex-col bg-zinc-900 text-white">
      <header className="p-4 bg-zinc-950 border-b border-zinc-800 text-center">
        <h1 className="text-2xl font-bold text-green-400">Add-on Co-Pilot</h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[90%] p-4 rounded-2xl ${msg.role === "user" ? "bg-green-600" : "bg-zinc-800 border border-zinc-700"}`}>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-zinc-950 border-t border-zinc-800">
        <textarea className="w-full p-3 rounded-xl bg-zinc-800 mb-2 outline-none" rows={3} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type here..." />
        <div className="flex gap-2">
          <button onClick={sendChat} className="flex-1 py-3 bg-zinc-700 rounded-xl font-bold">💬 Chat</button>
          <button onClick={generateAddon} className="flex-1 py-3 bg-green-600 rounded-xl font-bold">📦 Build Add-on</button>
        </div>
      </div>
    </main>
  );
}
