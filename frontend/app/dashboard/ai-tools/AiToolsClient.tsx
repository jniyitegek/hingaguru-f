"use client";

import Nav from "@/components/common/Nav";
import AuthNav from "@/components/common/AuthNav";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import { Image as ImageIcon, Send, Bot, User as UserIcon, Sparkles } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  imageDataUrl?: string | null;
  createdAt: number;
};

const STORAGE_KEY = "hingaguru_ai_chat";

export default function AiToolsClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [model, setModel] = useState<"gemini">("gemini");
  const [isSending, setIsSending] = useState(false);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setMessages(raw ? JSON.parse(raw) : []);
    } catch {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isSending]);

  function pickImage() {
    fileRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  async function send() {
    if (!input.trim() && !imageDataUrl) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: input.trim(),
      imageDataUrl,
      createdAt: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setImageDataUrl(null);
    setIsSending(true);
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [...messages, userMsg].slice(-12).map(m => ({ role: m.role, content: m.text })),
          imageDataUrl: userMsg.imageDataUrl,
        }),
      });
      const data = await res.json();
      const assistantText: string = data?.reply ?? "I couldn't process this request right now.";
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: assistantText,
        createdAt: Date.now(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      const botMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        text: "Network error. Please try again.",
        createdAt: Date.now(),
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsSending(false);
    }
  }

  function quickAsk(text: string) {
    setInput(text);
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Nav />
      <main className="flex-1 overflow-hidden">
        <AuthNav />
        <div className="p-0 md:p-6 h-[calc(100vh-64px)] flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="text-green-600" />
              <div className="font-semibold text-gray-800">AI Tools</div>
              <div className="text-sm text-gray-500">Crop advisory and disease scanning</div>
            </div>
            <div className="w-48">
              <Input
                id="ai-model"
                label="Model"
                variant="select"
                value={model}
                onChange={(v) => setModel(v as "openai" | "gemini")}
                options={[
                  // { value: "openai", label: "GPT (OpenAI)" },
                  { value: "gemini", label: "Gemini" },
                ]}
              />
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollerRef} className="flex-1 overflow-auto bg-[url('/public/window.svg')] bg-white p-4 md:p-6">
            <div className="max-w-3xl mx-auto space-y-3">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`flex items-end gap-2 max-w-[82%]`}>
                    {m.role === "assistant" && <div className="rounded-full bg-green-100 text-green-700 p-2"><Bot size={18} /></div>}
                    <div className={`${m.role === "user" ? "bg-green-600 text-white rounded-l-xl rounded-tr-xl" : "bg-gray-100 text-gray-800 rounded-r-xl rounded-tl-xl"} px-3 py-2 shadow`}>
                      {m.imageDataUrl && (
                        <img src={m.imageDataUrl} alt="uploaded" className="rounded mb-2 max-h-64 object-cover" />
                      )}
                      <div className="whitespace-pre-wrap"><Markdown>{m.text}</Markdown></div>
                      <div className={`text-[10px] mt-1 ${m.role === "user" ? "text-white/80" : "text-gray-500"}`}>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    {m.role === "user" && <div className="rounded-full bg-gray-200 text-gray-600 p-2"><UserIcon size={18} /></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Composer */}
          <div className="border-t bg-white p-3">
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-2">
                <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded" onClick={() => quickAsk("What crop is suitable to plant this month in Musanze?")}>
                  Crop suggestion
                </button>
                <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded" onClick={() => quickAsk("My tomato leaves have spots and are yellowing. What could it be? How to treat?")}>
                  Diagnose disease
                </button>
                <button className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded" onClick={() => quickAsk("Give me a weekly schedule for fertilizing and irrigating maize for 8 weeks.")}>
                  Care schedule
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
                <Button variant="outline" onClick={pickImage}>
                  <ImageIcon className="mr-2" /> Image
                </Button>
                <div className="flex-1">
                  <Input id="ai-input" value={input} onChange={setInput} placeholder="Type a message..." />
                </div>
                <Button onClick={send} disabled={isSending || (!input.trim() && !imageDataUrl)}>
                  <Send className="mr-2" /> Send
                </Button>
              </div>
              {imageDataUrl && (
                <div className="mt-2 flex items-center gap-3">
                  <img src={imageDataUrl} alt="preview" className="h-16 w-16 object-cover rounded" />
                  <button className="text-sm text-red-600" onClick={() => setImageDataUrl(null)}>Remove</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


