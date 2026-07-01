"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SENIORITIES = ["Junior", "Mid", "Senior"];
const HEADLINE_SUGGESTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Mobile Developer",
  "Data Engineer",
  "DevOps Engineer",
  "Security Engineer",
  "AI Engineer",
];
const EXPERIENCE = ["0-1", "1-3", "3-5", "5-10", "10+"];
const SKILLS = [
  "React",
  "Next.js",
  "Tailwind",
  "TypeScript",
  "JavaScript",
  "HTML",
  "CSS",
  "Python",
  "Java",
  "C#",
  "PHP",
  "SQL",
  "NoSQL",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "GCP",
]; //todo: Add more skills
const WORK_TYPES = ["Remote", "Hybrid", "Onsite"];
const SALARY_MIN = 18;
const SALARY_MAX = 120;
const SALARY_PRESETS = [
  { label: "20–30k", min: 20, max: 30 },
  { label: "30–45k", min: 30, max: 45 },
  { label: "45–60k", min: 45, max: 60 },
  { label: "60–80k", min: 60, max: 80 },
  { label: "80k+", min: 80, max: 100 },
];

function formatSalaryRange(min: number, max: number) {
  return `${min}k-${max}k EUR`;
}

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [salaryMin, setSalaryMin] = useState(30);
  const [salaryMax, setSalaryMax] = useState(45);
  const [salarySkipped, setSalarySkipped] = useState(false);

  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const [customSkill, setCustomSkill] = useState("");
  const [submitError, setSubmitError] = useState("");

  const [form, setForm] = useState({
    headline: "",
    seniority: "",
    years_of_experience: "",
    location: "",
    skills: [] as string[],
    summary: "",
    work_type: [] as string[],
  });

  function setSalaryRange(min: number, max: number) {
    const clampedMin = Math.max(SALARY_MIN, Math.min(min, SALARY_MAX));
    const clampedMax = Math.max(clampedMin, Math.min(max, SALARY_MAX));
    setSalaryMin(clampedMin);
    setSalaryMax(clampedMax);
    setSalarySkipped(false);
  }

  function toggleItem(field: "skills" | "work_type", value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value],
    }));
  }

  function removeSkill(skill: string) {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  }

  function addCustomSkill() {
    const skill = customSkill.trim();
    if (!skill) return;

    const exists = form.skills.some(
      (s) => s.toLowerCase() === skill.toLowerCase(),
    );
    if (!exists) {
      setForm((p) => ({ ...p, skills: [...p.skills, skill] }));
    }
    setCustomSkill("");
  }

  function canContinue(): boolean {
    if (step === 1) {
      return !!form.seniority && !!form.years_of_experience;
    }
    if (step === 2) {
      return form.skills.length > 0;
    }
    return true;
  }

  const availableSkills = SKILLS.filter((s) => !form.skills.includes(s));

  async function handleUseLocation() {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Your browser doesn't support geolocation");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "es" } },
          );

          if (!res.ok) throw new Error("Could not resolve location");

          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "";
          const country = data.address?.country || "";
          const location = [city, country].filter(Boolean).join(", ");

          if (!location) throw new Error("Could not resolve location");
          setForm((p) => ({ ...p, location }));
        } catch {
          setLocationError("Could not detect your city. Type it manually.");
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setLocationLoading(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError("Location permission denied. Type it manually.");
        } else {
          setLocationError("Could not get your location. Try again.");
        }
      },
    );
  }

  async function handleSubmit() {
    setLoading(true);
    setSubmitError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: user.user_metadata.full_name ?? null,
      headline: form.headline,
      seniority: form.seniority,
      years_of_experience: form.years_of_experience,
      location: form.location || null,
      skills: form.skills,
      summary: form.summary || null,
      work_type: form.work_type,
      salary_range: salarySkipped
        ? null
        : formatSalaryRange(salaryMin, salaryMax),
      onboarding_completed: true,
    });

    if (error) {
      console.error("Error updating profile:", error.message);
      setSubmitError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    setLoading(false);
  }
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
        <span className="text-white/20 text-xs font-mono">
          Step {step} of 4
        </span>
      </div>

      <div className="w-full max-w-lg relative z-10">
        {/* Progress */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-blue-500" : "bg-white/10"}`}
            />
          ))}
        </div>

        {/* Window */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 backdrop-blur-sm">
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <div className="w-3 h-3 rounded-full bg-white/10" />
            <span className="text-white/20 text-xs ml-2 font-mono">
              rolent — onboarding
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Step 1 - Basics */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-white/90 text-xl font-medium tracking-tight">
                    Who are you as a developer?
                  </h2>
                  <p className="text-white/30 text-sm mt-1">
                    This helps us personalize every analysis.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-white/40 mb-3 text-xs font-mono uppercase tracking-wider">
                      What do you do?
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. Software Engineer"
                      value={form.headline}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, headline: e.target.value }))
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-colors"
                    />
                    <p className="text-white/20 text-xs mt-3 mb-3">
                      Suggestions
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {HEADLINE_SUGGESTIONS.map((suggestions) => (
                        <button
                          key={suggestions}
                          type="button"
                          onClick={() =>
                            setForm((p) => ({ ...p, headline: suggestions }))
                          }
                          className={`px-3 py-1.5 rounded-lg border text-sm transition-all  ${
                            form.headline === suggestions
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                              : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                          }`}
                        >
                          {suggestions}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 mb-3 text-xs font-mono uppercase tracking-wider">
                      Seniority
                    </p>
                    <div className="flex gap-2">
                      {SENIORITIES.map((s) => (
                        <button
                          key={s}
                          onClick={() =>
                            setForm((p) => ({ ...p, seniority: s }))
                          }
                          className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${form.seniority === s ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 mb-3 text-xs font-mono uppercase tracking-wider">
                      Years of experience
                    </p>
                    <div className="flex gap-2">
                      {EXPERIENCE.map((e) => (
                        <button
                          key={e}
                          onClick={() =>
                            setForm((p) => ({ ...p, years_of_experience: e }))
                          }
                          className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${form.years_of_experience === e ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 mb-3 text-xs font-mono uppercase tracking-wider">
                      Location{" "}
                      <span className="text-white/20 normal-case">
                        (optional)
                      </span>
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. Madrid, Spain"
                      value={form.location}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, location: e.target.value }))
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-colors"
                    />
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={handleUseLocation}
                      disabled={locationLoading}
                      className="text-sm text-blue-300/90 hover:text-blue-300 disabled:opacity-50 transition-colors font-mono"
                    >
                      {locationLoading ? "Detecting..." : "📍 Use my location"}
                    </button>
                  </div>
                  {locationError && (
                    <p className="text-amber-400/80 text-xs mt-2">
                      {locationError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2 - Stack */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-white/90 text-xl font-medium tracking-tight">
                    Your stack
                  </h2>
                  <p className="text-white/30 text-sm mt-1">
                    Select what you actually work with.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 min-h-[72px]">
                  <p className="text-xs font-mono text-white/30 uppercase tracking-wider mb-3">
                    Selected
                    {form.skills.length > 0 && (
                      <span className="text-white/20 normal-case ml-2">
                        ({form.skills.length})
                      </span>
                    )}
                  </p>
                  {form.skills.length === 0 ? (
                    <p className="text-white/25 text-sm">
                      Pick skills below or add your own.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {form.skills.map((skill) => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30 transition-all"
                        >
                          {skill}
                          <span className="text-blue-300/60 text-xs">×</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-white/40 mb-3 text-xs font-mono uppercase tracking-wider">
                      Popular skills
                    </p>
                    {availableSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {availableSkills.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => toggleItem("skills", s)}
                            className="px-3 py-1.5 rounded-lg border text-sm border-white/10 text-white/50 hover:border-white/20 hover:text-white/70 transition-all"
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/25 text-xs">
                        All suggestions added.
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-white/40 mb-3 text-xs font-mono uppercase tracking-wider">
                      Add your own
                    </p>
                    <input
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomSkill();
                        }
                      }}
                      placeholder="e.g. Golang, Rust, Figma..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 - Projects */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-white/90 text-xl font-medium tracking-tight">
                    Your experience
                  </h2>
                  <p className="text-white/30 text-sm mt-1">
                    Mention 2-3 projects and what you did - the AI uses this to
                    match offers.
                  </p>
                </div>

                <div>
                  <p className="text-white/40 mb-3 text-xs font-mono uppercase tracking-wider">
                    Summary
                  </p>
                  <textarea
                    rows={6}
                    placeholder="e.g. Junior Frontend at Top Doctors (React, Golang, Typescript). Personal portfolio with Next.js. Internship with Node and SQL..."
                    value={form.summary}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, summary: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-colors"
                  />
                  <p className="text-white/20 text-xs mt-2">
                    Optional but recommended - improves match accuracy.
                  </p>
                </div>
              </div>
            )}

            {/* Step 4 - Preferences */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-white/90 text-xl font-medium tracking-tight">
                    Your preferences
                  </h2>
                  <p className="text-white/30 text-sm mt-1">
                    Help us filter what actually fits you.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-white/40 mb-3 text-xs font-mono uppercase tracking-wider">
                      Work type
                    </p>
                    <div className="flex gap-2">
                      {WORK_TYPES.map((w) => (
                        <button
                          key={w}
                          onClick={() => toggleItem("work_type", w)}
                          className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${form.work_type.includes(w) ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"}`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 mb-3 text-xs font-mono uppercase tracking-wider">
                      Expected salary{" "}
                      <span className="text-white/20 normal-case">
                        (optional)
                      </span>
                    </p>

                    <div
                      className={`rounded-xl border p-4 transition-colors ${
                        salarySkipped
                          ? "border-white/5 bg-white/[0.01] opacity-50"
                          : "border-white/10 bg-white/[0.02]"
                      }`}
                    >
                      {!salarySkipped && (
                        <>
                          <div className="flex items-baseline justify-center gap-2 mb-4">
                            <span className="text-2xl font-medium text-white tabular-nums">
                              {salaryMin}k
                            </span>
                            <span className="text-white/25">—</span>
                            <span className="text-2xl font-medium text-white tabular-nums">
                              {salaryMax}k
                            </span>
                            <span className="text-white/35 text-xs ml-1">
                              EUR / year
                            </span>
                          </div>

                          <div className="relative h-1.5 bg-white/10 rounded-full mb-5">
                            <div
                              className="absolute h-full bg-blue-500/80 rounded-full transition-all duration-150"
                              style={{
                                left: `${((salaryMin - SALARY_MIN) / (SALARY_MAX - SALARY_MIN)) * 100}%`,
                                width: `${((salaryMax - salaryMin) / (SALARY_MAX - SALARY_MIN)) * 100}%`,
                              }}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs font-mono text-white/40">
                                <span>Min</span>
                                <span className="text-blue-300/80">
                                  {salaryMin}k
                                </span>
                              </div>
                              <input
                                type="range"
                                min={SALARY_MIN}
                                max={SALARY_MAX}
                                value={salaryMin}
                                onChange={(e) =>
                                  setSalaryRange(
                                    Number(e.target.value),
                                    salaryMax,
                                  )
                                }
                                className="w-full accent-blue-500 h-1"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs font-mono text-white/40">
                                <span>Max</span>
                                <span className="text-blue-300/80">
                                  {salaryMax}k
                                </span>
                              </div>
                              <input
                                type="range"
                                min={SALARY_MIN}
                                max={SALARY_MAX}
                                value={salaryMax}
                                onChange={(e) =>
                                  setSalaryRange(
                                    salaryMin,
                                    Number(e.target.value),
                                  )
                                }
                                className="w-full accent-blue-500 h-1"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <div className="flex flex-wrap gap-2 mt-4">
                        {SALARY_PRESETS.map((preset) => {
                          const isActive =
                            !salarySkipped &&
                            salaryMin === preset.min &&
                            salaryMax === preset.max;
                          return (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() =>
                                setSalaryRange(preset.min, preset.max)
                              }
                              className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                                isActive
                                  ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                                  : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"
                              }`}
                            >
                              {preset.label}
                            </button>
                          );
                        })}
                        <button
                          type="button"
                          onClick={() => setSalarySkipped((s) => !s)}
                          className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                            salarySkipped
                              ? "bg-white/10 text-white/70 border-white/20"
                              : "border-white/10 text-white/40 hover:border-white/20"
                          }`}
                        >
                          Prefer not to say
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="text-white/30 hover:text-white/60 text-sm transition-colors font-mono"
              >
                ← back
              </button>
            ) : (
              <div />
            )}

            <div className="flex flex-col items-end gap-2">
              {submitError && step === 4 && (
                <p className="text-red-400/90 text-xs max-w-xs text-right">
                  {submitError}
                </p>
              )}
              {step < 4 ? (
                <button
                  onClick={() => canContinue() && setStep((s) => s + 1)}
                  disabled={!canContinue()}
                  className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-5 py-2 rounded-lg text-sm hover:bg-blue-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-blue-500 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {loading ? "saving..." : "let's go →"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
