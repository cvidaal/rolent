"use client";

import { takeOfferDraft } from "@/lib/offer-draft";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Verdict = "apply" | "negotiate" | "skip";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  verdict?: Verdict;
};

const STAMPS: Record<Verdict, { label: string; className: string }> = {
  apply: {
    label: "Válido",
    className:
      "border-emerald-400 bg-emerald-400/10 text-emerald-300 shadow-[0_0_28px_rgba(52,211,153,0.45)]",
  },
  negotiate: {
    label: "A medias",
    className:
      "border-amber-400 bg-amber-400/10 text-amber-300 shadow-[0_0_28px_rgba(251,191,36,0.45)]",
  },
  skip: {
    label: "No",
    className: "border-red-400 bg-red-400/10 text-red-300 shadow-[0_0_28px_rgba(248,113,113,0.45)]",
  },
};

export default function SessionPage() {
  const [offer, setOffer] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = takeOfferDraft();
    if (saved) setOffer(saved);
  }, []);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [messages, loading]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    if (!offer.trim()) {
      setError("Paste the job offer first.");
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setDraft("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offer, messages: nextMessages }),
      });
      const data = (await response.json()) as {
        reply?: string;
        verdict?: Verdict;
        error?: string;
      };
      if (!response.ok || !data.reply) {
        setError(data.error ?? "Rolent could not answer.");
        return;
      }
      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.reply, verdict: data.verdict },
      ]);
    } catch {
      setError("Rolent could not answer. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-white/40 text-xs font-mono tracking-widest uppercase">
            Rolent
          </span>
        </Link>
        <Link href="/dashboard" className="text-white/30 hover:text-white/60 text-xs font-mono">
          ← dashboard
        </Link>
      </header>

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 py-6 grid gap-4 lg:grid-cols-2 lg:h-[calc(100vh-5.5rem)] min-h-0">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex flex-col min-h-[52vh] lg:min-h-0">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
            <span className="text-white/45 text-xs ml-2 font-mono">rolent — offer</span>
          </div>
          <textarea
            value={offer}
            onChange={(event) => setOffer(event.target.value)}
            placeholder="Paste the job offer here. A public URL works too, but the full text gives a better read."
            className="rolent-scroll flex-1 min-h-[320px] w-full bg-transparent px-5 py-4 text-sm text-white/90 placeholder-white/35 outline-none resize-y"
          />
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex flex-col min-h-[52vh] lg:min-h-0">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-white/45 text-xs font-mono">rolent — analyst</span>
          </div>

          <div ref={threadRef} className="rolent-scroll flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-white/30 text-sm leading-relaxed">
                Paste an offer, then ask whether it fits you. Rolent uses your profile and does
                not invent salary numbers.
              </p>
            )}
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "max-w-[85%] bg-blue-500/15 text-blue-100 border border-blue-500/20"
                      : "w-full bg-white/[0.04] text-white/90 border border-white/10"
                  }`}
                >
                  {message.verdict && (
                    <p
                      className={`rolent-stamp mb-4 inline-block rounded-full border-2 px-4 py-1.5 font-mono text-sm tracking-widest uppercase ${STAMPS[message.verdict].className}`}
                    >
                      {STAMPS[message.verdict].label}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && <p className="text-white/30 text-xs font-mono">reading the offer…</p>}
          </div>

          {error && <p className="px-5 text-amber-400/90 text-xs">{error}</p>}

          <form
            className="flex items-center gap-3 px-4 py-3 border-t border-white/5"
            onSubmit={(event) => {
              event.preventDefault();
              const text = draft.trim() || (messages.length === 0 ? "¿Esta oferta encaja conmigo?" : "");
              if (!text) return;
              void sendMessage(text);
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about this offer…"
              className="flex-1 bg-transparent text-sm text-white/80 placeholder-white/20 outline-none"
            />
            <button
              type="submit"
              disabled={loading || !offer.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-40"
            >
              {messages.length === 0 ? "Analyze" : "Send"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
