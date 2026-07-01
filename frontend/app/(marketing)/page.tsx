import { GoogleLoginButton } from "@/components/google-login-button";

const STEPS = [
  {
    step: "01",
    title: "Build your profile",
    description:
      "Skills, experience, and preferences — the context the AI needs to judge fit, not just keywords.",
  },
  {
    step: "02",
    title: "Paste a job URL",
    description:
      "Drop a link from LinkedIn, InfoJobs, or any board. Rolent reads the role and requirements.",
  },
  {
    step: "03",
    title: "Get a clear verdict",
    description:
      "Match score, skill gaps, and whether it's worth your time before you rewrite your CV again.",
  },
];

const FEATURES = [
  {
    title: "Match score",
    description: "A single number that answers: do I actually fit this role?",
  },
  {
    title: "Skill gaps",
    description: "See what's missing before you apply, not after the silence.",
  },
  {
    title: "Apply smarter",
    description: "Stop spraying CVs. Focus on offers where you have a real shot.",
  },
];

function AnalysisPreview() {
  return (
    <div className="bg-white/3 border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/60 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        <span className="text-white/20 text-xs ml-2 font-mono">
          rolent — analysis
        </span>
      </div>

      <div className="p-5 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-white/30 text-xs font-mono uppercase tracking-wider">
              Offer
            </p>
            <p className="text-white/80 text-sm mt-1">
              Senior Frontend Engineer
            </p>
            <p className="text-white/35 text-xs mt-0.5">Remote · Madrid</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-semibold text-blue-400 tabular-nums">
              78%
            </p>
            <p className="text-white/30 text-xs">match</p>
          </div>
        </div>

        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full w-[78%] bg-linear-to-r from-blue-600 to-blue-400 rounded-full" />
        </div>

        <div className="space-y-2">
          <p className="text-white/30 text-xs font-mono uppercase tracking-wider">
            Matched
          </p>
          <div className="flex flex-wrap gap-1.5">
            {["React", "TypeScript", "Next.js"].map((s) => (
              <span
                key={s}
                className="px-2 py-0.5 rounded-md text-xs bg-emerald-500/10 text-emerald-400/90 border border-emerald-500/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-white/30 text-xs font-mono uppercase tracking-wider">
            Gaps
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded-md text-xs bg-amber-500/10 text-amber-400/90 border border-amber-500/20">
              Kubernetes
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2.5">
          <p className="text-white/50 text-xs leading-relaxed">
            Strong fit for frontend. Mention production React experience in
            your application — the role weights it heavily.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Nav */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-white/50 text-xs font-mono tracking-widest uppercase">
              Rolent
            </span>
          </div>
          <GoogleLoginButton variant="ghost">Sign in</GoogleLoginButton>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10">
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-300/90 text-xs font-mono mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Free during beta · Built in public
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-medium tracking-tight leading-[1.1]">
                Stop applying{" "}
                <span className="text-white/40">in the dark.</span>
              </h1>

              <p className="text-white/45 text-lg mt-6 leading-relaxed max-w-lg">
                Rolent analyzes job offers against your real profile — skills,
                experience, and preferences — so you know if it&apos;s worth
                applying before you spend another hour on a cover letter.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <GoogleLoginButton variant="primary">
                  Continue with Google
                </GoogleLoginButton>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/10 text-white/60 text-sm hover:border-white/20 hover:text-white/80 transition-colors"
                >
                  How it works
                </a>
              </div>

              <p className="text-white/25 text-xs mt-4 font-mono">
                For developers tired of ghosted applications.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/10 rounded-3xl blur-2xl" />
              <div className="relative">
                <AnalysisPreview />
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="border-t border-white/5 bg-white/1"
        >
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-3">
              How it works
            </p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white/90 mb-12">
              Three steps. One clear answer.
            </h2>

            <div className="grid sm:grid-cols-3 gap-6">
              {STEPS.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl border border-white/8 bg-white/2 p-6 hover:border-white/12 transition-colors"
                >
                  <span className="text-blue-400/80 text-xs font-mono">
                    {item.step}
                  </span>
                  <h3 className="text-white/85 font-medium mt-3 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="text-white/30 text-xs font-mono uppercase tracking-wider mb-3">
              Why Rolent
            </p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white/90 mb-12">
              Built for the job search that burns you out.
            </h2>

            <div className="grid sm:grid-cols-3 gap-6">
              {FEATURES.map((feature) => (
                <div key={feature.title} className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </div>
                  <h3 className="text-white/80 font-medium">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white/90">
              Ready to apply with clarity?
            </h2>
            <p className="text-white/40 mt-3 max-w-md mx-auto text-sm">
              Join the beta. Create your profile, paste your first offer, and
              see if you actually fit.
            </p>
            <div className="mt-8">
              <GoogleLoginButton variant="blue">Get started free</GoogleLoginButton>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
            <span className="text-white/25 text-xs font-mono">Rolent</span>
          </div>
          <p className="text-white/20 text-xs">
            Match your talent. Apply with confidence.
          </p>
        </div>
      </footer>
    </div>
  );
}
