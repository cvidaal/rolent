"use client";

import { useI18n } from "@/lib/i18n";

export function LanguageSwitch() {
  const { lang, setLang, t } = useI18n();

  return (
    <button
      type="button"
      onClick={() => setLang(lang === "es" ? "en" : "es")}
      aria-label={t("lang.switch")}
      title={t("lang.switch")}
      className="h-8 rounded-full border border-white/15 px-2.5 text-[11px] font-mono uppercase tracking-wider text-white/70 transition-colors hover:text-white"
    >
      {lang === "es" ? "EN" : "ES"}
    </button>
  );
}
