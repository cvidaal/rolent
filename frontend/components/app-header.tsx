"use client";

import { LanguageSwitch } from "@/components/language-switch";
import { ThemeSwitch } from "@/components/theme-switch";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { History, LogOut, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type HeaderUser = {
  email?: string;
  user_metadata?: { full_name?: string; avatar_url?: string };
};

export function AppHeader() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useI18n();
  const [user, setUser] = useState<HeaderUser | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const links = [
    { href: "/session", label: t("nav.analyze"), icon: Sparkles },
    { href: "/history", label: t("nav.history"), icon: History },
  ];

  return (
    <header className="relative z-20 flex items-center justify-between gap-4 px-6 sm:px-8 py-4 border-b border-white/10">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-white/70 text-xs font-mono tracking-widest uppercase">Rolent</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                  active ? "bg-white/5 text-white" : "text-white/50 hover:text-white/90"
                }`}
              >
                <Icon size={15} strokeWidth={1.75} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitch />
        <ThemeSwitch />

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={t("menu.profile")}
            className="rounded-full border border-blue-400/40 hover:border-blue-300 transition-colors"
          >
            {user?.user_metadata?.avatar_url && !avatarFailed ? (
              <img
                src={user.user_metadata.avatar_url}
                alt=""
                referrerPolicy="no-referrer"
                onError={() => setAvatarFailed(true)}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <span className="flex w-8 h-8 items-center justify-center text-blue-300">
                <User size={16} strokeWidth={1.75} />
              </span>
            )}
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                aria-label="Close menu"
                className="fixed inset-0 z-20 cursor-default"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-11 z-30 w-56 rounded-xl border border-white/10 bg-[#111111] shadow-2xl shadow-black/50 overflow-hidden">
                <div className="px-3 py-2.5 border-b border-white/10">
                  <p className="text-sm text-white/90 truncate">{user?.user_metadata?.full_name}</p>
                  <p className="text-xs text-white/50 truncate">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => router.push("/profile")}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-white/80 hover:bg-white/5"
                >
                  <User size={15} strokeWidth={1.75} />
                  {t("menu.profile")}
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-red-400 hover:bg-white/5 border-t border-white/10"
                >
                  <LogOut size={15} strokeWidth={1.75} />
                  {t("menu.signOut")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
