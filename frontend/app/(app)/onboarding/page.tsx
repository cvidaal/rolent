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
    <main className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`}
            />
          ))}
        </div>

        {/* Step 1 - Basics */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Who are you as a developer?</h2>

            <div>
              <p className="text-text-secondary mb-3 text-sm">Role</p>
              <div className="flex flex-wrap gap-2">
                {ROLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setForm((p) => ({ ...p, role: r }))}
                    className={`px-4 py-2 rounded-lg border text-sm ${form.role === r ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-text-secondary mb-3 text-sm">Seniority</p>
              <div className="flex gap-2">
                {SENIORITIES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm((p) => ({ ...p, seniority: s }))}
                    className={`px-4 py-2 rounded-lg border text-sm ${form.seniority === s ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-text-secondary mb-3 text-sm">
                Years of experience
              </p>
              <div className="flex gap-2">
                {EXPERIENCE.map((e) => (
                  <button
                    key={e}
                    onClick={() =>
                      setForm((p) => ({ ...p, years_of_experience: e }))
                    }
                    className={`px-4 py-2 rounded-lg border text-sm ${form.years_of_experience === e ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-text-secondary mb-3 text-sm">
                Location (optional)
              </p>
              <input
                type="text"
                placeholder="e.g. Madrid, Spain"
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        )}

        {/* Step 2 - Stack */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your stack</h2>

            <div>
              <p className="text-text-secondary mb-3 text-sm">Top Skills</p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleTopSkill(s)}
                    className={`px-4 py-2 rounded-lg border text-sm ${form.top_skills.includes(s) ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-text-secondary mb-3 text-sm">
                Nice to have skills (optional)
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.filter((s) => !form.top_skills.includes(s)).map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleItem("nice_to_have_skills", s)}
                    className={`px-4 py-2 rounded-lg border text-sm ${form.nice_to_have_skills.includes(s) ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 - Projects */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your projects</h2>
            <p className="text-text-secondary text-sm">
              2-3 projects that represent your best work
            </p>

            {form.projects.map((project, i) => (
              <div
                key={i}
                className="space-y-3 border border-border rounded-lg p-4"
              >
                <p className="text-sm text-text-secondary">Project {i + 1}</p>
                <input
                  type="text"
                  placeholder="Project name"
                  value={project.name}
                  onChange={(e) => {
                    const updated = [...form.projects];
                    updated[i].name = e.target.value;
                    setForm((p) => ({ ...p, projects: updated }));
                  }}
                  className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
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
                  className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
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
                  className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>
        )}

        {/* Step 4 - Work type */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Your preferences</h2>

            <div>
              <p className="text-text-secondary mb-3 text-sm">Work type</p>
              <div className="flex gap-2">
                {WORK_TYPES.map((w) => (
                  <button
                    key={w}
                    onClick={() => toggleItem("work_type", w)}
                    className={`px-4 py-2 rounded-lg border text-sm ${form.work_type.includes(w) ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-text-secondary mb-3 text-sm">
                Salary range target (optional)
              </p>
              <input
                type="text"
                placeholder="e.g. 30k-40k EUR"
                value={form.salary_range}
                onChange={(e) =>
                  setForm((p) => ({ ...p, salary_range: e.target.value }))
                }
                className="w-full bg-surface border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            <div>
              <p className="text-text-secondary mb-3 text-sm">Dealbreakers</p>
              <div className="flex flex-wrap gap-2">
                {DEALBREAKERS.map((d) => (
                  <button
                    key={d}
                    onClick={() => toggleItem("dealbreakers", d)}
                    className={`px-4 py-2 rounded-lg border text-sm ${form.dealbreakers.includes(d) ? "bg-primary text-white border-primary" : "border-border hover:border-primary"}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="text-text-secondary hover:text-white text-sm"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover disabled:opacity-50"
            >
              {loading ? "Saving..." : "Let's go →"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
