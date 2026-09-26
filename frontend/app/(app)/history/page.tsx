"use client";

import { AppHeader } from "@/components/app-header";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useState } from "react";

type Verdict = "apply" | "negotiate" | "skip";

type Analysis = {
  id: string;
  score: number | null;
  created_at: string;
  job_url: string;
  result: {
    offer?: string;
    reply?: string;
    verdict?: Verdict;
    title?: string;
    company?: string;
    platform?: string;
  } | null;
};

const STAMP_STYLES: Record<Verdict, string> = {
  apply: "text-emerald-400 border-emerald-400",
  negotiate: "text-amber-400 border-amber-400",
  skip: "text-red-400 border-red-400",
};

const FILTERS: (Verdict | "all")[] = ["all", "apply", "negotiate", "skip"];

function sameDay(iso: string, day: string) {
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}` === day;
}

export default function HistoryPage() {
  const supabase = createClient();
  const { lang, t } = useI18n();
  const [rows, setRows] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [verdictFilter, setVerdictFilter] = useState<Verdict | "all">("all");
  const [day, setDay] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase
      .from("analyses")
      .select("id, score, created_at, job_url, result")
      .order("created_at", { ascending: false })
      .then(({ data, error: queryError }) => {
        if (queryError) setError(queryError.message);
        else setRows((data ?? []) as Analysis[]);
        setLoading(false);
      });
  }, []);

  const visible = rows.filter((row) => {
    if (verdictFilter !== "all" && row.result?.verdict !== verdictFilter) return false;
    if (day && !sameDay(row.created_at, day)) return false;
    const haystack = [row.result?.title, row.result?.company, row.result?.platform, row.result?.offer]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (query.trim() && !haystack.includes(query.trim().toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <AppHeader />

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-4">
        <h1 className="text-xl font-medium">{t("history.title")}</h1>

        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setVerdictFilter(filter)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                verdictFilter === filter
                  ? "border-blue-400 bg-blue-500/10 text-blue-400"
                  : "border-white/15 text-white/60 hover:text-white/90"
              }`}
            >
              {filter === "all" ? t("history.all") : t(`verdict.${filter}`)}
            </button>
          ))}
          <input
            type="date"
            value={day}
            onChange={(event) => setDay(event.target.value)}
            className="rounded-full border border-white/15 bg-transparent px-3 py-1 text-xs text-white/70"
          />
          {day && (
            <button type="button" onClick={() => setDay("")} className="text-xs text-white/50 hover:text-white/90">
              {t("history.clearDay")}
            </button>
          )}
          <label className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-white/50 sm:ml-auto">
            <Search size={13} strokeWidth={1.75} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("history.search")}
              className="bg-transparent text-xs text-white/90 placeholder-white/35 outline-none"
            />
          </label>
        </div>

        {loading && <p className="text-white/50 text-sm">{t("history.loading")}</p>}
        {error && <p className="text-amber-400 text-sm">{error}</p>}
        {!loading && !error && visible.length === 0 && (
          <p className="text-white/50 text-sm">
            {rows.length === 0 ? t("history.empty") : t("history.noMatch")}
          </p>
        )}

        {visible.map((row) => {
          const verdict = row.result?.verdict;
          const title = row.result?.title || t("history.untitled");
          const company = row.result?.company || t("history.unknownCompany");
          const platform = row.result?.platform || t("history.unknownPlatform");
          const open = openId === row.id;
          const date = new Date(row.created_at).toLocaleString(lang === "es" ? "es-ES" : "en-GB", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <article
              key={row.id}
              className="rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-white/20"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : row.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  {verdict ? (
                    <span className={`rounded-full border px-3 py-1 text-xs font-mono uppercase ${STAMP_STYLES[verdict]}`}>
                      {t(`verdict.${verdict}`)}
                    </span>
                  ) : (
                    <span className="text-white/50 text-xs font-mono">{t("history.noVerdict")}</span>
                  )}
                  <span className="flex items-center gap-2 text-white/50 text-xs font-mono">
                    {date}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                    />
                  </span>
                </div>
                <h2 className="mt-3 text-base text-white/90">{title}</h2>
                <p className="mt-1 text-sm text-white/50">
                  {company} · {platform}
                </p>
              </button>

              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 space-y-3">
                    {row.score != null && (
                      <p className="text-xs font-mono text-white/50">
                        {t("history.fit")} {row.score}/100
                      </p>
                    )}
                    {row.result?.reply && (
                      <p className="text-sm leading-relaxed text-white/80 whitespace-pre-wrap">
                        {row.result.reply}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
}
