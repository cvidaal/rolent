"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ROLES = [
  "Frontend",
  "Backend",
  "Fullstack",
  "Mobile",
  "Data",
  "DevOps",
  "Security",
  "AI",
  "Other",
];
const SENIORITIES = ["Junior", "Mid", "Senior"];
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
const DEALBREAKERS = [
  "No relocation",
  "No on-call",
  "No overtime",
  "No legacy stack",
  "No office 5 days",
];

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    role: "",
    seniority: "",
    years_of_experience: "",
    location: "",
    top_skills: [] as string[],
    nice_to_have_skills: [] as string[],
    projects: [
      { name: "", description: "", stack: "" },
      { name: "", description: "", stack: "" },
    ],
    work_type: [] as string[],
    salary_range: "",
    dealbreakers: [] as string[],
  });

  function toggleItem(
    field: "top_skills" | "nice_to_have_skills" | "dealbreakers" | "work_type",
    value: string,
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value],
    }));
  }

  function toggleTopSkill(value: string) {
    setForm((prev) => {
      const isSelected = prev.top_skills.includes(value);
      return {
        ...prev,
        top_skills: isSelected
          ? prev.top_skills.filter((s) => s != value)
          : [...prev.top_skills, value],
        nice_to_have_skills: isSelected
          ? prev.nice_to_have_skills.filter((s) => s != value)
          : [...prev.nice_to_have_skills, value],
      };
    });
  }

  async function handleSubmit() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    try {
      if (!user) return;

      await supabase.from("profiles").upsert({
        id: user.id,
        ...form,
        onboarding_completed: true,
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
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
                      Role
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ROLES.map((r) => (
                        <button
                          key={r}
                          onClick={() => setForm((p) => ({ ...p, role: r }))}
                          className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${form.role === r ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"}`}
                        >
                          {r}
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

                <div className="space-y-4">
                  <div>
                    <p className="text-white/40 mb-3 text-xs font-mono uppercase tracking-wider">
                      Top skills
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SKILLS.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleItem("top_skills", s)}
                          className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${form.top_skills.includes(s) ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-white/40 mb-3 text-xs font-mono uppercase tracking-wider">
                      Nice to have{" "}
                      <span className="text-white/20 normal-case">
                        (optional)
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SKILLS.filter((s) => !form.top_skills.includes(s)).map(
                        (s) => (
                          <button
                            key={s}
                            onClick={() => toggleItem("nice_to_have_skills", s)}
                            className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${form.nice_to_have_skills.includes(s) ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"}`}
                          >
                            {s}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 - Projects */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-white/90 text-xl font-medium tracking-tight">
                    Your projects
                  </h2>
                  <p className="text-white/30 text-sm mt-1">
                    2-3 projects that represent you best.
                  </p>
                </div>

                {form.projects.map((project, i) => (
                  <div
                    key={i}
                    className="space-y-3 border border-white/10 rounded-xl p-4 bg-white/[0.02]"
                  >
                    <p className="text-xs font-mono text-white/30 uppercase tracking-wider">
                      Project {i + 1}
                    </p>
                    <input
                      type="text"
                      placeholder="Project name"
                      value={project.name}
                      onChange={(e) => {
                        const updated = [...form.projects];
                        updated[i].name = e.target.value;
                        setForm((p) => ({ ...p, projects: updated }));
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="One line description"
                      value={project.description}
                      onChange={(e) => {
                        const updated = [...form.projects];
                        updated[i].description = e.target.value;
                        setForm((p) => ({ ...p, projects: updated }));
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Stack used"
                      value={project.stack}
                      onChange={(e) => {
                        const updated = [...form.projects];
                        updated[i].stack = e.target.value;
                        setForm((p) => ({ ...p, projects: updated }));
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-colors"
                    />
                  </div>
                ))}
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
                      Salary range{" "}
                      <span className="text-white/20 normal-case">
                        (optional)
                      </span>
                    </p>
                    <input
                      type="text"
                      placeholder="e.g. 30k-40k EUR"
                      value={form.salary_range}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, salary_range: e.target.value }))
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white/70 placeholder-white/20 focus:outline-none focus:border-blue-500/40 transition-colors"
                    />
                  </div>

                  <div>
                    <p className="text-white/40 mb-3 text-xs font-mono uppercase tracking-wider">
                      Dealbreakers
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {DEALBREAKERS.map((d) => (
                        <button
                          key={d}
                          onClick={() => toggleItem("dealbreakers", d)}
                          className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${form.dealbreakers.includes(d) ? "bg-blue-500/20 text-blue-300 border-blue-500/40" : "border-white/10 text-white/50 hover:border-white/20 hover:text-white/70"}`}
                        >
                          {d}
                        </button>
                      ))}
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

            {step < 4 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-5 py-2 rounded-lg text-sm hover:bg-blue-500/30 transition-all"
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
  );
}
