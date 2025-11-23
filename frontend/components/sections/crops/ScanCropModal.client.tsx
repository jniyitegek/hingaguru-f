"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Camera, Image as ImageIcon, Send, ArrowRight } from "lucide-react";
import Input from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useLocale } from "@/context/LocaleContext";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ScanCropModal({ isOpen, onClose }: Props) {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t } = useLocale();

  if (!isOpen) return null;

  function pickImage() {
    fileRef.current?.click();
  }

  function useCamera() {
    cameraRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageDataUrl(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function analyze() {
    if (!imageDataUrl) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemini",
          messages: [{ role: "user", content: note || "Analyze this crop image for diseases and give treatment advice." }],
          imageDataUrl,
        }),
      });
      const data = await res.json();
      setAnswer(data?.reply || "No answer.");
    } catch {
      setAnswer("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function openInAiTools() {
    try {
      const raw = localStorage.getItem("hingaguru_ai_chat");
      const list = raw ? JSON.parse(raw) : [];
      const userMsg = {
        id: crypto.randomUUID(),
        role: "user",
        text: note || "Analyze this crop image for diseases and give treatment advice.",
        imageDataUrl,
        createdAt: Date.now(),
      };
      localStorage.setItem("hingaguru_ai_chat", JSON.stringify([...list, userMsg]));
    } catch {}
    router.push("/dashboard/ai-tools");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{t("common.scanCrop")}</h3>
          <button aria-label="Close" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex gap-2">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
            <Button variant="outline" onClick={pickImage}><ImageIcon className="mr-2" /> {t("buttons.upload")}</Button>
            <Button variant="outline" onClick={useCamera}><Camera className="mr-2" /> {t("buttons.useCamera")}</Button>
          </div>
          {imageDataUrl && (
            <div className="flex items-center gap-3">
              <img src={imageDataUrl} alt="preview" className="h-24 w-24 object-cover rounded" />
              <button className="text-sm text-red-600" onClick={() => setImageDataUrl(null)}>{t("buttons.remove")}</button>
            </div>
          )}
          <Input id="scan-note" label={t("common.scanCrop") + " - " + "Notes (optional)"} value={note} onChange={setNote} placeholder={t("crops.searchPlaceholder")} />
          <div className="flex gap-2">
            <Button onClick={analyze} disabled={!imageDataUrl || loading}><Send className="mr-2" /> {loading ? t("crops.analyzing") : t("crops.analyzeOnDashboard")}</Button>
            <Button variant="outline" onClick={openInAiTools} disabled={!imageDataUrl}><ArrowRight className="mr-2" /> {t("buttons.openInAiTools")}</Button>
          </div>
          {answer && (
            <div className="mt-3 p-3 border rounded-lg bg-gray-50 text-gray-800 whitespace-pre-wrap">
              {answer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


