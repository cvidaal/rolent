"use client";

import { createClient } from "@/lib/supabase/client";
import { saveOfferDraft } from "@/lib/offer-draft";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<{
    email?: string;
    user_metadata?: { full_name?: string; avatar_url?: string };
  } | null>(null);

  const [query, setQuery] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/"); // Redirigimos al usuario a la página de inicio.
  }

  function openSession() {
    const text = query.trim();
    if (text) saveOfferDraft(text);
    router.push("/session");
  }

  function handleCommand(e: React.KeyboardEvent) {
    if (e.key === "Enter" && query.trim()) {
      openSession();
    }
  }

  const firstName = user?.user_metadata?.full_name?.split(" ")[0]; // "John Doe" -> "John"

  return (
    <div className="min-h-screen bg-[#080808] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-white/40 text-sm font-mono tracking-widest uppercase text-xs">
            Rolent
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user?.user_metadata?.avatar_url && (
            <img
              src={user.user_metadata.avatar_url}
              alt="avatar"
              className="w-7 h-7 rounded-full opacity-80"
            />
          )}
          <button
            onClick={handleLogout}
            className=" bg-red-500 rounded-lg px-3 py-1 text-white/80 hover:bg-red-600 text-xs transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main window */}
      <div className="w-full max-w-2xl relative z-10">
        {/* Greeting */}
        <div className="mb-8 text-center">
          <h1 className="text-white/80 text-2xl font-light tracking-tight">
            Good morning,{" "}
            <span className="text-white font-medium">{firstName}</span>
          </h1>
          <p className="text-white/30 text-sm mt-1">
            What are you working on today?
          </p>
        </div>

        {/* Command window */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 backdrop-blur-sm">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <span className="text-white/20 text-xs ml-2 font-mono">
              rolent — command
            </span>
          </div>

          {/* Search input */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
            <svg
              className="w-4 h-4 text-white/30 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              autoFocus
              type="text"
              placeholder="Paste a job offer URL or type a command..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleCommand}
              className="flex-1 bg-transparent text-white/80 placeholder-white/20 text-sm outline-none"
            />
            <kbd className="text-white/20 text-xs border border-white/10 rounded px-1.5 py-0.5 font-mono">
              ↵
            </kbd>
          </div>

          {/* Quick actions */}
          <div className="p-2">
            <button
              onClick={openSession}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors">
                  Analyze job offer
                </p>
                <p className="text-white/25 text-xs">Paste a URL or raw text</p>
              </div>
              <kbd className="text-white/20 text-xs border border-white/10 rounded px-1.5 py-0.5 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </kbd>
            </button>

            <button
              onClick={() => router.push("/history")}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
                <svg
                  className="w-4 h-4 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1 text-left">
                <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors">
                  History
                </p>
                <p className="text-white/25 text-xs">View past analyses</p>
              </div>
              <kbd className="text-white/20 text-xs border border-white/10 rounded px-1.5 py-0.5 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                →
              </kbd>
            </button>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
            <span className="text-white/20 text-xs font-mono">
              ESC to close
            </span>
            <span className="text-white/20 text-xs font-mono">
              ↑↓ navigate · ↵ select
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
