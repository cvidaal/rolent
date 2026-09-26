"use client";

import { AppHeader } from "@/components/app-header";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const SENIORITIES = ["Junior", "Mid", "Senior"];
const EXPERIENCE = ["0-1", "1-3", "3-5", "5-10", "10+"];
const WORK_TYPES = ["Remote", "Hybrid", "Onsite"] as const;

type ProfileForm = {
  headline: string;
  seniority: string;
  years_of_experience: string;
  location: string;
  skills: string[];
  summary: string;
  work_type: string[];
  salary_range: string;
};

const EMPTY: ProfileForm = {
  headline: "",
  seniority: "",
  years_of_experience: "",
  location: "",
  skills: [],
  summary: "",
  work_type: [],
  salary_range: "",
};

const LABEL = "block text-xs font-mono text-white/60";
const INPUT =
  "mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 outline-none focus:border-blue-400/60 transition-colors";

function chipClass(selected: boolean) {
  return `rounded-lg border px-3 py-1.5 text-sm transition-colors ${
    selected ? "border-blue-400 bg-blue-500/10 text-blue-400" : "border-white/10 text-white/60 hover:text-white/90"
  }`;
}

export default function ProfilePage() {
  const supabase = createClient();
  const { t } = useI18n();
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [skillDraft, setSkillDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user;
      if (!user) {
        setLoading(false);
        return;
      }
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("headline, seniority, years_of_experience, location, skills, summary, work_type, salary_range")
        .eq("id", user.id)
        .single();
      if (error) setMessage(error.message);
      else if (profile) {
        setForm({
          headline: profile.headline ?? "",
          seniority: profile.seniority ?? "",
          years_of_experience: profile.years_of_experience ?? "",
          location: profile.location ?? "",
          skills: profile.skills ?? [],
          summary: profile.summary ?? "",
          work_type: profile.work_type ?? [],
          salary_range: profile.salary_range ?? "",
        });
      }
      setLoading(false);
    });
  }, []);

  function toggleWorkType(value: string) {
    setForm((current) => ({
      ...current,
      work_type: current.work_type.includes(value)
        ? current.work_type.filter((item) => item !== value)
        : [...current.work_type, value],
    }));
  }

  function addSkill() {
    const skill = skillDraft.trim();
    if (!skill) return;
    setForm((current) =>
      current.skills.some((item) => item.toLowerCase() === skill.toLowerCase())
        ? current
        : { ...current, skills: [...current.skills, skill] },
    );
    setSkillDraft("");
  }

  async function save() {
    setSaving(true);
    setMessage("");

    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) {
      setMessage(t("profile.signIn"));
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        headline: form.headline,
        seniority: form.seniority,
        years_of_experience: form.years_of_experience,
        location: form.location || null,
        skills: form.skills,
        summary: form.summary || null,
        work_type: form.work_type,
        salary_range: form.salary_range || null,
      })
      .eq("id", user.id);

    setMessage(error ? error.message : t("profile.saved"));
    setSaving(false);
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <AppHeader />

      {loading ? (
        <p className="max-w-xl mx-auto px-6 py-10 text-white/50 text-sm">{t("profile.loading")}</p>
      ) : (
        <main className="max-w-xl mx-auto px-6 py-10 space-y-6">
          <div>
            <h1 className="text-xl font-medium">{t("profile.title")}</h1>
            <p className="mt-1 text-sm text-white/50">{t("profile.subtitle")}</p>
          </div>

          <label className={LABEL}>
            {t("profile.role")}
            <input
              value={form.headline}
              onChange={(event) => setForm({ ...form, headline: event.target.value })}
              className={INPUT}
            />
          </label>

          <div>
            <p className={`${LABEL} mb-2`}>{t("profile.seniority")}</p>
            <div className="flex gap-2">
              {SENIORITIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setForm({ ...form, seniority: item })}
                  className={chipClass(form.seniority === item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className={`${LABEL} mb-2`}>{t("profile.years")}</p>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setForm({ ...form, years_of_experience: item })}
                  className={chipClass(form.years_of_experience === item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <label className={LABEL}>
            {t("profile.location")}
            <input
              value={form.location}
              onChange={(event) => setForm({ ...form, location: event.target.value })}
              className={INPUT}
            />
          </label>

          <div>
            <p className={`${LABEL} mb-2`}>{t("profile.skills")}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => setForm({ ...form, skills: form.skills.filter((item) => item !== skill) })}
                  className="flex items-center gap-1 rounded-lg border border-blue-400/40 px-3 py-1 text-sm text-blue-400 hover:border-blue-400"
                >
                  {skill}
                  <X size={13} />
                </button>
              ))}
            </div>
            <input
              value={skillDraft}
              onChange={(event) => setSkillDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSkill();
                }
              }}
              placeholder={t("profile.skillPlaceholder")}
              className={`${INPUT} mt-0 placeholder-white/35`}
            />
          </div>

          <label className={LABEL}>
            {t("profile.summary")}
            <textarea
              value={form.summary}
              onChange={(event) => setForm({ ...form, summary: event.target.value })}
              rows={5}
              className={`${INPUT} rolent-scroll`}
            />
          </label>

          <div>
            <p className={`${LABEL} mb-2`}>{t("profile.workType")}</p>
            <div className="flex gap-2">
              {WORK_TYPES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleWorkType(item)}
                  className={chipClass(form.work_type.includes(item))}
                >
                  {t(`work.${item}`)}
                </button>
              ))}
            </div>
          </div>

          <label className={LABEL}>
            {t("profile.salary")}
            <input
              value={form.salary_range}
              onChange={(event) => setForm({ ...form, salary_range: event.target.value })}
              placeholder="30k-45k EUR"
              className={`${INPUT} placeholder-white/35`}
            />
          </label>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 disabled:opacity-40"
            >
              {saving ? t("profile.saving") : t("profile.save")}
            </button>
            {message && <p className="text-sm text-white/60">{message}</p>}
          </div>
        </main>
      )}
    </div>
  );
}
