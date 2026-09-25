"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
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

const STAMPS: Record<Verdict, { label: string; className: string }> = {
  apply: { label: "Válido", className: "text-emerald-300 border-emerald-400" },
  negotiate: { label: "A medias", className: "text-amber-300 border-amber-400" },
  skip: { label: "No", className: "text-red-300 border-red-400" },
};

const FILTERS: { id: Verdict | "all"; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "apply", label: "Válido" },
  { id: "negotiate", label: "A medias" },
  { id: "skip", label: "No" },
];

function sameDay(iso: string, day: string) {
  const date = new Date(iso);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}` === day;
}

export default function HistoryPage() {
  const supabase = createClient();
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
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <Link href="/dashboard" className="text-white/40 text-xs font-mono tracking-widest uppercase">
          Rolent
        </Link>
        <Link href="/dashboard" className="text-white/40 hover:text-white/70 text-xs font-mono">
          ← dashboard
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-4">
        <h1 className="text-xl font-medium">History</h1>

        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setVerdictFilter(filter.id)}
              className={`rounded-full border px-3 py-1 text-xs font-mono ${
                verdictFilter === filter.id
                  ? "border-blue-400 text-blue-200"
                  : "border-white/15 text-white/50"
              }`}
            >
              {filter.label}
            </button>
          ))}
          <input
            type="date"
            value={day}
            onChange={(event) => setDay(event.target.value)}
            className="rounded-full border border-white/15 bg-transparent px-3 py-1 text-xs text-white/70"
          />
          {day && (
            <button type="button" onClick={() => setDay("")} className="text-xs text-white/40 font-mono">
              limpiar día
            </button>
          )}
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Empresa o puesto"
            className="rounded-full border border-white/15 bg-transparent px-3 py-1 text-xs text-white/80 placeholder-white/30 outline-none"
          />
        </div>

        {loading && <p className="text-white/40 text-sm">Loading…</p>}
        {error && <p className="text-amber-300 text-sm">{error}</p>}
        {!loading && visible.length === 0 && (
          <p className="text-white/40 text-sm">No analyses yet.</p>
        )}

        {visible.map((row) => {
          const verdict = row.result?.verdict;
          const stamp = verdict ? STAMPS[verdict] : null;
          const title = row.result?.title || "Oferta sin título";
          const company = row.result?.company || "Empresa desconocida";
          const platform = row.result?.platform || "Plataforma desconocida";
          const open = openId === row.id;
          const date = new Date(row.created_at).toLocaleString("es-ES", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <article key={row.id} className="rounded-2xl border border-white/10 bg-white/[0.03]">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : row.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-center justify-between gap-3">
                  {stamp ? (
                    <span className={`rounded-full border px-3 py-1 text-xs font-mono uppercase ${stamp.className}`}>
                      {stamp.label}
                    </span>
                  ) : (
                    <span className="text-white/30 text-xs font-mono">Sin veredicto</span>
                  )}
                  <span className="text-white/35 text-xs font-mono">{date}</span>
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
                      <p className="text-xs font-mono text-white/40">Encaje {row.score}/100</p>
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
