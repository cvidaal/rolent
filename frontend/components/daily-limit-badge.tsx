"use client";

import { DAILY_LIMIT } from "@/lib/daily-limit";
import { useI18n } from "@/lib/i18n";

export function DailyLimitBadge({ remaining }: { remaining: number | null }) {
  const { t } = useI18n();
  if (remaining === null) return null;

  if (remaining === 0) {
    return <p className="text-xs text-amber-500">{t("limit.reached", { total: DAILY_LIMIT })}</p>;
  }

  return (
    <p className="flex items-center gap-2 text-xs text-white/50">
      <span className="flex gap-1">
        {Array.from({ length: DAILY_LIMIT }, (_, index) => (
          <span
            key={index}
            className={`h-1.5 w-1.5 rounded-full ${index < remaining ? "bg-blue-500" : "bg-blue-500/20"}`}
          />
        ))}
      </span>
      {t("limit.remaining", { n: remaining, total: DAILY_LIMIT })}
    </p>
  );
}
