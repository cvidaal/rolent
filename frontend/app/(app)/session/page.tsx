"use client";

import { AppHeader } from "@/components/app-header";
import { DailyLimitBadge } from "@/components/daily-limit-badge";
import { DAILY_LIMIT } from "@/lib/daily-limit";
import { useDailyRemaining } from "@/lib/use-daily-remaining";
import { useI18n } from "@/lib/i18n";
import { takeOfferDraft } from "@/lib/offer-draft";
import { FileText, Lock, Plus, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Verdict = "apply" | "negotiate" | "skip";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  verdict?: Verdict;
};

const STAMP_STYLES: Record<Verdict, string> = {
  apply:
    "border-emerald-400 bg-emerald-400/10 text-emerald-300 shadow-[0_0_28px_rgba(52,211,153,0.45)]",
  negotiate:
    "border-amber-400 bg-amber-400/10 text-amber-300 shadow-[0_0_28px_rgba(251,191,36,0.45)]",
  skip: "border-red-400 bg-red-400/10 text-red-300 shadow-[0_0_28px_rgba(248,113,113,0.45)]",
};

export default function SessionPage() {
  const { t } = useI18n();
  const [offer, setOffer] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useDailyRemaining();
  const blocked = messages.length === 0 && remaining === 0;
  const analyzed = messages.some((message) => message.role === "assistant");
  const threadRef = useRef<HTMLDivElement>(null);
  const offerRef = useRef<HTMLTextAreaElement>(null);

  function startNewOffer() {
    setOffer("");
    setMessages([]);
    setDraft("");
    setError("");
    offerRef.current?.focus();
  }

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
      setError(t("session.needOffer"));
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
        code?: string;
        remaining?: number;
      };
      if (typeof data.remaining === "number") setRemaining(data.remaining);
      if (data.code === "daily_limit") {
        setRemaining(0);
        setMessages(messages);
        setError(t("limit.reached", { total: DAILY_LIMIT }));
        return;
      }
      if (!response.ok || !data.reply) {
        setError(data.error ?? t("session.error"));
        return;
      }
      const isFirstReply = !messages.some((message) => message.role === "assistant");
      setMessages([
        ...nextMessages,
        { role: "assistant", content: data.reply, verdict: isFirstReply ? data.verdict : undefined },
      ]);
    } catch {
      setError(t("session.error"));
    } finally {
      setLoading(false);
    }
  }

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.content));
  const suggestions = (
    ["session.suggestGaps", "session.suggestInterview", "session.suggestNegotiate"] as const
  )
    .map((key) => t(key))
    .filter((text) => !asked.has(text));
  const showSuggestions = messages.length > 0 && !loading && suggestions.length > 0;

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <AppHeader />

      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 py-6 grid gap-4 lg:grid-cols-2 lg:h-[calc(100vh-4.5rem)] min-h-0">
        <section className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex flex-col min-h-[52vh] lg:min-h-0">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 text-white/70">
            <FileText size={15} strokeWidth={1.75} />
            <span className="text-sm">{t("session.offer")}</span>
            {analyzed && (
              <span className="flex items-center gap-1 text-xs text-white/50">
                <Lock size={12} strokeWidth={1.75} />
                {t("session.locked")}
              </span>
            )}
            {(analyzed || offer) && (
              <button
                type="button"
                onClick={startNewOffer}
                disabled={loading}
                className="ml-auto flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1 text-xs text-white/70 transition-colors hover:border-blue-400/60 hover:text-white disabled:opacity-40"
              >
                <Plus size={13} strokeWidth={2} />
                {t("session.newOffer")}
              </button>
            )}
          </div>
          <textarea
            ref={offerRef}
            value={offer}
            onChange={(event) => setOffer(event.target.value)}
            readOnly={analyzed}
            placeholder={t("session.offerPlaceholder")}
            className={`rolent-scroll flex-1 min-h-[320px] w-full bg-transparent px-5 py-4 text-sm placeholder-white/35 outline-none resize-none ${
              analyzed ? "text-white/60" : "text-white/90"
            }`}
          />
        </section>

        <section className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden flex flex-col min-h-[52vh] lg:min-h-0">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 text-white/70">
            <Sparkles size={15} strokeWidth={1.75} className="text-blue-400" />
            <span className="text-sm">{t("session.analyst")}</span>
          </div>

          <div ref={threadRef} className="rolent-scroll flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-white/50 text-sm leading-relaxed">{t("session.empty")}</p>
            )}
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "max-w-[85%] bg-blue-500 text-white"
                      : "w-full bg-white/[0.04] text-white/90 border border-white/10"
                  }`}
                >
                  {message.verdict && (
                    <p
                      className={`rolent-stamp mb-4 inline-block rounded-full border-2 px-4 py-1.5 font-mono text-sm tracking-widest uppercase ${STAMP_STYLES[message.verdict]}`}
                    >
                      {t(`verdict.${message.verdict}`)}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}
            {loading && <p className="text-white/50 text-xs font-mono animate-pulse">{t("session.loading")}</p>}

            {showSuggestions && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((text) => (
                  <button
                    key={text}
                    type="button"
                    onClick={() => void sendMessage(text)}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-blue-400/60 hover:text-white"
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error ? (
            <p className="px-5 pb-2 text-amber-500 text-xs">{error}</p>
          ) : (
            messages.length === 0 && (
              <div className="px-5 pb-2">
                <DailyLimitBadge remaining={remaining} />
              </div>
            )
          )}

          <form
            className="flex items-center gap-3 px-4 py-3 border-t border-white/10"
            onSubmit={(event) => {
              event.preventDefault();
              const text = draft.trim() || (messages.length === 0 ? t("session.firstQuestion") : "");
              if (!text) return;
              void sendMessage(text);
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={messages.length === 0 ? t("session.firstQuestion") : t("session.askPlaceholder")}
              className="flex-1 bg-transparent text-sm text-white/90 placeholder-white/35 outline-none"
            />
            <button
              type="submit"
              disabled={loading || !offer.trim() || blocked}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-40"
            >
              {messages.length === 0 ? t("session.analyze") : t("session.send")}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
