"use client";

import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("rolent-theme", theme);
}

const ICON = "col-start-1 row-start-1 transition-all duration-400 ease-out";
const SHOWN = "opacity-100 rotate-0 scale-100";
const HIDDEN = "opacity-0 -rotate-90 scale-50";

export function ThemeSwitch() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
      title={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
      className="theme-toggle grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:text-white"
    >
      <Moon size={16} strokeWidth={1.75} className={`${ICON} ${theme === "dark" ? SHOWN : HIDDEN}`} />
      <Sun size={16} strokeWidth={1.75} className={`${ICON} ${theme === "light" ? SHOWN : HIDDEN}`} />
    </button>
  );
}
