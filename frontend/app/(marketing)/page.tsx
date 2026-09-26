"use client";

import { GoogleLoginButton } from "@/components/google-login-button";
import { LanguageSwitch } from "@/components/language-switch";
import { ThemeSwitch } from "@/components/theme-switch";
import { useI18n } from "@/lib/i18n";

const COPY = {
  es: {
    signIn: "Iniciar sesión",
    badge: "Beta gratuita · 5 análisis al día",
    heroStart: "Deja de postularte",
    heroEnd: "a ciegas.",
    heroText:
      "Rolent compara cada oferta con tu perfil real (skills, experiencia y preferencias) para que sepas si merece la pena antes de pasar otra hora con la carta de presentación.",
    google: "Continuar con Google",
    howLink: "Cómo funciona",
    tagline: "Para developers cansados de candidaturas sin respuesta.",
    howLabel: "Cómo funciona",
    howTitle: "Tres pasos. Una respuesta clara.",
    steps: [
      {
        title: "Crea tu perfil",
        description: "Skills, experiencia y preferencias: el contexto que la IA necesita para juzgar el encaje, no solo palabras clave.",
      },
      {
        title: "Pega la oferta",
        description: "Copia el texto de LinkedIn, InfoJobs o cualquier portal. Rolent lee el puesto y los requisitos.",
      },
      {
        title: "Recibe un veredicto claro",
        description: "Válido, a medias o no, con lo que te falta y si merece tu tiempo antes de reescribir el CV otra vez.",
      },
    ],
    whyLabel: "Por qué Rolent",
    whyTitle: "Hecho para la búsqueda de empleo que te quema.",
    features: [
      { title: "Veredicto de encaje", description: "Una respuesta directa: ¿encajo de verdad en este puesto?" },
      { title: "Lo que te falta", description: "Descubre los huecos antes de postularte, no después del silencio." },
      { title: "Postúlate mejor", description: "Deja de mandar CVs a todo. Céntrate en las ofertas donde tienes opciones reales." },
    ],
    ctaTitle: "¿Listo para postularte con claridad?",
    ctaText: "Únete a la beta. Crea tu perfil, pega tu primera oferta y comprueba si encajas.",
    ctaButton: "Empieza gratis",
    footer: "Encaja tu talento. Postúlate con confianza.",
    preview: {
      label: "Análisis",
      offer: "Oferta",
      role: "Senior Frontend Engineer",
      place: "Remoto · Madrid",
      match: "encaje",
      matched: "Tienes",
      gaps: "Te falta",
      note: "Buen encaje para frontend. Destaca tu experiencia con React en producción: el puesto le da mucho peso.",
    },
  },
  en: {
    signIn: "Sign in",
    badge: "Free beta · 5 analyses a day",
    heroStart: "Stop applying",
    heroEnd: "in the dark.",
    heroText:
      "Rolent analyzes job offers against your real profile (skills, experience and preferences) so you know if it's worth applying before you spend another hour on a cover letter.",
    google: "Continue with Google",
    howLink: "How it works",
    tagline: "For developers tired of ghosted applications.",
    howLabel: "How it works",
    howTitle: "Three steps. One clear answer.",
    steps: [
      {
        title: "Build your profile",
        description: "Skills, experience and preferences: the context the AI needs to judge fit, not just keywords.",
      },
      {
        title: "Paste the offer",
        description: "Copy the text from LinkedIn, InfoJobs or any board. Rolent reads the role and requirements.",
      },
      {
        title: "Get a clear verdict",
        description: "Fit, partial or no, with your gaps and whether it's worth your time before you rewrite your CV again.",
      },
    ],
    whyLabel: "Why Rolent",
    whyTitle: "Built for the job search that burns you out.",
    features: [
      { title: "Fit verdict", description: "A direct answer: do I actually fit this role?" },
      { title: "Skill gaps", description: "See what's missing before you apply, not after the silence." },
      { title: "Apply smarter", description: "Stop spraying CVs. Focus on offers where you have a real shot." },
    ],
    ctaTitle: "Ready to apply with clarity?",
    ctaText: "Join the beta. Create your profile, paste your first offer, and see if you actually fit.",
    ctaButton: "Get started free",
    footer: "Match your talent. Apply with confidence.",
    preview: {
      label: "Analysis",
      offer: "Offer",
      role: "Senior Frontend Engineer",
      place: "Remote · Madrid",
      match: "match",
      matched: "You have",
      gaps: "Gaps",
      note: "Strong fit for frontend. Mention production React experience in your application: the role weights it heavily.",
    },
  },
};

type Copy = (typeof COPY)["es"];

function AnalysisPreview({ copy }: { copy: Copy["preview"] }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-black/40 backdrop-blur-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
        <span className="w-2 h-2 rounded-full bg-blue-500" />
        <span className="text-white/50 text-xs font-mono">{copy.label}</span>
      </div>

      <div className="p-5 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-white/50 text-xs font-mono uppercase tracking-wider">{copy.offer}</p>
            <p className="text-white/90 text-sm mt-1">{copy.role}</p>
            <p className="text-white/50 text-xs mt-0.5">{copy.place}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-3xl font-semibold text-blue-500 tabular-nums">78%</p>
            <p className="text-white/50 text-xs">{copy.match}</p>
          </div>
        </div>

        <div className="h-1.5 bg-blue-500/15 rounded-full overflow-hidden">
          <div className="h-full w-[78%] bg-linear-to-r from-blue-600 to-blue-400 rounded-full" />
        </div>

        <div className="space-y-2">
          <p className="text-white/50 text-xs font-mono uppercase tracking-wider">{copy.matched}</p>
          <div className="flex flex-wrap gap-1.5">
            {["React", "TypeScript", "Next.js"].map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-md text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/25"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-white/50 text-xs font-mono uppercase tracking-wider">{copy.gaps}</p>
          <span className="inline-block px-2 py-0.5 rounded-md text-xs bg-amber-500/10 text-amber-500 border border-amber-500/25">
            Kubernetes
          </span>
        </div>

        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-2.5">
          <p className="text-white/60 text-xs leading-relaxed">{copy.note}</p>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { lang } = useI18n();
  const copy = COPY[lang];

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <header className="relative z-10 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <span className="text-white/70 text-xs font-mono tracking-widest uppercase">Rolent</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitch />
            <ThemeSwitch />
            <GoogleLoginButton variant="ghost" className="ml-2">
              {copy.signIn}
            </GoogleLoginButton>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="max-w-6xl mx-auto px-6 pt-16 pb-24 lg:pt-24 lg:pb-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/25 bg-blue-500/10 text-blue-500 text-xs font-mono mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                {copy.badge}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-medium tracking-tight leading-[1.1]">
                {copy.heroStart} <span className="text-white/40">{copy.heroEnd}</span>
              </h1>

              <p className="text-white/60 text-lg mt-6 leading-relaxed max-w-lg">{copy.heroText}</p>

              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <GoogleLoginButton variant="blue">{copy.google}</GoogleLoginButton>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/10 text-white/70 text-sm hover:border-white/20 hover:text-white transition-colors"
                >
                  {copy.howLink}
                </a>
              </div>

              <p className="text-white/40 text-xs mt-4 font-mono">{copy.tagline}</p>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-blue-500/10 rounded-3xl blur-2xl" />
              <div className="relative">
                <AnalysisPreview copy={copy.preview} />
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="text-white/50 text-xs font-mono uppercase tracking-widest mb-3">{copy.howLabel}</p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white/90 mb-12">{copy.howTitle}</h2>

            <div className="grid sm:grid-cols-3 gap-6">
              {copy.steps.map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 transition-colors"
                >
                  <span className="text-blue-500 text-xs font-mono">0{index + 1}</span>
                  <h3 className="text-white/90 font-medium mt-3 mb-2">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <p className="text-white/50 text-xs font-mono uppercase tracking-wider mb-3">{copy.whyLabel}</p>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white/90 mb-12">{copy.whyTitle}</h2>

            <div className="grid sm:grid-cols-3 gap-6">
              {copy.features.map((feature) => (
                <div key={feature.title} className="space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  </div>
                  <h3 className="text-white/90 font-medium">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10">
          <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white/90">{copy.ctaTitle}</h2>
            <p className="text-white/60 mt-3 max-w-md mx-auto text-sm">{copy.ctaText}</p>
            <div className="mt-8">
              <GoogleLoginButton variant="blue">{copy.ctaButton}</GoogleLoginButton>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            <span className="text-white/50 text-xs font-mono">Rolent</span>
          </div>
          <p className="text-white/40 text-xs">{copy.footer}</p>
        </div>
      </footer>
    </div>
  );
}
