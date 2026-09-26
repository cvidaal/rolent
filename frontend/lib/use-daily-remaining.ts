"use client";

import { DAILY_LIMIT, startOfToday } from "@/lib/daily-limit";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export function useDailyRemaining() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { count } = await supabase
        .from("analyses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", data.user.id)
        .gte("created_at", startOfToday());
      setRemaining(Math.max(0, DAILY_LIMIT - (count ?? 0)));
    });
  }, []);

  return [remaining, setRemaining] as const;
}
