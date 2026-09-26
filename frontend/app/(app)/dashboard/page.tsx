"use client";

import { AppHeader } from "@/components/app-header";
import { DailyLimitBadge } from "@/components/daily-limit-badge";
import { useDailyRemaining } from "@/lib/use-daily-remaining";
import { useI18n } from "@/lib/i18n";
import { saveOfferDraft } from "@/lib/offer-draft";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, History, Sparkles, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function greetingKey() {
  const hour = new Date().getHours();
  if (hour < 13) return "dashboard.morning" as const;
  if (hour < 20) return "dashboard.afternoon" as const;
  return "dashboard.evening" as const;
}

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const { t } = useI18n();
  const [firstName, setFirstName] = useState("");
  const [offer, setOffer] = useState("");
  const [remaining] = useDailyRemaining();
  const limitReached = remaining === 0;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setFirstName(data.user?.user_metadata?.full_name?.split(" ")[0] ?? "");
    });
  }, []);

  function openSession() {
    const text = offer.trim();
    if (text) saveOfferDraft(text);
    router.push("/session");
  }

  const shortcuts = [
    { href: "/history", icon: History, title: t("dashboard.historyTitle"), text: t("dashboard.historyText") },
    { href: "/profile", icon: User, title: t("dashboard.profileTitle"), text: t("dashboard.profileText") },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <AppHeader />

      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-white/80 text-2xl font-light tracking-tight">
              {t(greetingKey())}
              {firstName && (
                <>
                  , <span className="text-white font-medium">{firstName}</span>
                </>
              )}
            </h1>
            <p className="text-white/50 text-sm mt-2">{t("dashboard.subtitle")}</p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 backdrop-blur-sm focus-within:border-blue-400/50 transition-colors">
            <textarea
              autoFocus
              value={offer}
              onChange={(event) => setOffer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && offer.trim() && !limitReached) {
                  openSession();
                }
              }}
              placeholder={t("dashboard.placeholder")}
              rows={6}
              className="rolent-scroll block w-full resize-none bg-transparent px-5 py-4 text-sm text-white/90 placeholder-white/35 outline-none"
            />
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-white/10">
              <span className="text-white/40 text-xs font-mono">{t("dashboard.hint")}</span>
              <button
                type="button"
                onClick={openSession}
                disabled={!offer.trim() || limitReached}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-600 disabled:opacity-40"
              >
                <Sparkles size={15} strokeWidth={1.75} />
                {t("dashboard.analyze")}
              </button>
            </div>
          </div>

          <div className="mt-3 flex justify-center">
            <DailyLimitBadge remaining={remaining} />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {shortcuts.map(({ href, icon: Icon, title, text }) => (
              <button
                key={href}
                type="button"
                onClick={() => router.push(href)}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors hover:border-blue-400/40"
              >
                <span className="flex w-9 h-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <span className="flex-1">
                  <span className="block text-sm text-white/90">{title}</span>
                  <span className="block text-xs text-white/50">{text}</span>
                </span>
                <ArrowRight
                  size={15}
                  className="text-white/40 transition-transform group-hover:translate-x-0.5"
                />
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
