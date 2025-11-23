import { NextRequest, NextResponse } from "next/server";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

export async function POST(req: NextRequest) {
  try {
    const { model, messages, imageDataUrl } = await req.json();

    const useOpenAI = model === "openai";
    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = "AIzaSyDRcJ8BU2gezrH8u3EpLmoymRPnFncs3LI";

    if (useOpenAI && openaiKey) {
      const payload: any = {
        model: "gpt-4o-mini",
        messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
        temperature: 0.4,
      };
      if (imageDataUrl) {
        payload.messages[payload.messages.length - 1].content = [
          { type: "text", text: messages[messages.length - 1].content || "" },
          { type: "image_url", image_url: { url: imageDataUrl } },
        ];
      }
      const resp = await fetch(OPENAI_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await resp.json();
      console.log("OpenAI raw response:", data);
      const reply = data?.choices?.[0]?.message?.content ?? "I couldn't generate a response.";
      console.log("OpenAI response:", data);
      return NextResponse.json({ reply });
    }

    if (!useOpenAI && geminiKey) {
const systemPrompt = {
    role: "user",
    parts: [
        {
            text:
                "Be concise and straight to the point. No lengthy responses. " +
                "You are an expert in agriculture and agricultural business management. " +
                "Every response must be strictly about agriculture or agricultural management " +
                "(crops, livestock, soil, agronomy, farm finance, farm operations, labor management, etc). " +
                "If the question is not related to agriculture or agricultural business management, respond: " +
                "\"I only answer agriculture and agricultural-management questions.\""
        }
    ]
};

const parts = [
    { text: messages[messages.length - 1]?.content || "" },
    imageDataUrl
        ? {
              inline_data: {
                  mime_type: "image/jpeg",
                  data: imageDataUrl.split(",")[1]
              }
          }
        : undefined
].filter(Boolean);

const payload = {
    contents: [
        systemPrompt,
        ...messages.slice(0, -1).map((m) => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
        })),
        { role: "user", parts }
    ]
};

const resp = await fetch(`${GEMINI_URL}?key=${geminiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
});
      const data = await resp.json();
      console.log("Gemini raw response:", data);
      const reply = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("\n") ?? "I couldn't generate a response.";
      return NextResponse.json({ reply });
    }

    // Fallback mock if keys are not configured
    const fallback = imageDataUrl
      ? "I received your image. It may show signs of disease; ensure clear, well-lit photos for accurate analysis."
      : "AI is not configured yet (set OPENAI_API_KEY or GEMINI_API_KEY). Here's a sample tip: Rotate crops and mulch to conserve moisture.";
    return NextResponse.json({ reply: fallback });
  } catch (e) {
    return NextResponse.json({ reply: "Server error processing AI request." }, { status: 500 });
  }
}


