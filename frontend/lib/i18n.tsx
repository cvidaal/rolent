"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "es" | "en";

const STORAGE_KEY = "rolent-lang";

const dictionary = {
  es: {
    "nav.analyze": "Analizar",
    "nav.history": "Historial",
    "menu.profile": "Mi perfil",
    "menu.signOut": "Cerrar sesión",
    "theme.toLight": "Cambiar a modo claro",
    "theme.toDark": "Cambiar a modo oscuro",
    "lang.switch": "Switch to English",

    "dashboard.morning": "Buenos días",
    "dashboard.afternoon": "Buenas tardes",
    "dashboard.evening": "Buenas noches",
    "dashboard.subtitle": "Pega una oferta y te digo si encaja con tu perfil.",
    "dashboard.placeholder": "Pega aquí el texto completo de la oferta…",
    "dashboard.hint": "Ctrl + Enter para analizar",
    "dashboard.analyze": "Analizar oferta",
    "dashboard.historyTitle": "Historial",
    "dashboard.historyText": "Revisa las ofertas que ya analizaste",
    "dashboard.profileTitle": "Mi perfil",
    "dashboard.profileText": "Tus skills, experiencia y salario esperado",

    "verdict.apply": "Válido",
    "verdict.negotiate": "A medias",
    "verdict.skip": "No",

    "session.offer": "Oferta",
    "session.analyst": "Analista",
    "session.newOffer": "Nueva oferta",
    "session.locked": "Analizada",
    "session.offerPlaceholder": "Pega aquí el texto de la oferta. Cuanto más completo, mejor el análisis.",
    "session.empty": "Pega la oferta y pulsa Analizar. Rolent la compara con tu perfil y nunca se inventa salarios.",
    "session.loading": "Leyendo la oferta…",
    "session.askPlaceholder": "Pregunta sobre esta oferta…",
    "session.analyze": "Analizar",
    "session.send": "Enviar",
    "session.firstQuestion": "¿Esta oferta encaja conmigo?",
    "session.suggestGaps": "¿Qué me falta para este puesto?",
    "session.suggestInterview": "¿Qué debería preparar para la entrevista?",
    "session.suggestNegotiate": "¿Qué puedo negociar?",
    "session.needOffer": "Pega primero la oferta.",
    "session.error": "Rolent no ha podido responder. Inténtalo de nuevo.",

    "history.title": "Historial",
    "history.all": "Todas",
    "history.search": "Empresa o puesto",
    "history.clearDay": "Quitar fecha",
    "history.loading": "Cargando…",
    "history.empty": "Todavía no hay análisis.",
    "history.noMatch": "Ningún análisis coincide con los filtros.",
    "history.untitled": "Oferta sin título",
    "history.unknownCompany": "Empresa desconocida",
    "history.unknownPlatform": "Plataforma desconocida",
    "history.noVerdict": "Sin veredicto",
    "history.fit": "Encaje",

    "profile.title": "Mi perfil",
    "profile.subtitle": "Rolent usa estos datos en cada análisis.",
    "profile.loading": "Cargando perfil…",
    "profile.role": "Puesto",
    "profile.seniority": "Seniority",
    "profile.years": "Años de experiencia",
    "profile.location": "Ubicación",
    "profile.skills": "Skills",
    "profile.skillPlaceholder": "Escribe una skill y pulsa Enter",
    "profile.summary": "Resumen",
    "profile.workType": "Modalidad",
    "profile.salary": "Salario esperado",
    "profile.save": "Guardar",
    "profile.saving": "Guardando…",
    "profile.saved": "Guardado. El próximo análisis usará este perfil.",
    "profile.signIn": "Vuelve a iniciar sesión.",
    "work.Remote": "Remoto",
    "work.Hybrid": "Híbrido",
    "work.Onsite": "Presencial",

    "limit.remaining": "Te quedan {n} de {total} análisis hoy",
    "limit.reached": "Has usado tus {total} análisis de hoy. Mañana tendrás {total} más.",
  },
  en: {
    "nav.analyze": "Analyze",
    "nav.history": "History",
    "menu.profile": "My profile",
    "menu.signOut": "Sign out",
    "theme.toLight": "Switch to light mode",
    "theme.toDark": "Switch to dark mode",
    "lang.switch": "Cambiar a español",

    "dashboard.morning": "Good morning",
    "dashboard.afternoon": "Good afternoon",
    "dashboard.evening": "Good evening",
    "dashboard.subtitle": "Paste a job offer and I'll tell you if it fits your profile.",
    "dashboard.placeholder": "Paste the full job offer text here…",
    "dashboard.hint": "Ctrl + Enter to analyze",
    "dashboard.analyze": "Analyze offer",
    "dashboard.historyTitle": "History",
    "dashboard.historyText": "Review the offers you already analyzed",
    "dashboard.profileTitle": "My profile",
    "dashboard.profileText": "Your skills, experience and expected salary",

    "verdict.apply": "Fit",
    "verdict.negotiate": "Partial",
    "verdict.skip": "No",

    "session.offer": "Offer",
    "session.analyst": "Analyst",
    "session.newOffer": "New offer",
    "session.locked": "Analyzed",
    "session.offerPlaceholder": "Paste the job offer text here. The more complete, the better the analysis.",
    "session.empty": "Paste the offer and press Analyze. Rolent compares it with your profile and never makes up salaries.",
    "session.loading": "Reading the offer…",
    "session.askPlaceholder": "Ask about this offer…",
    "session.analyze": "Analyze",
    "session.send": "Send",
    "session.firstQuestion": "Does this offer fit me?",
    "session.suggestGaps": "What am I missing for this role?",
    "session.suggestInterview": "What should I prepare for the interview?",
    "session.suggestNegotiate": "What can I negotiate?",
    "session.needOffer": "Paste the job offer first.",
    "session.error": "Rolent could not answer. Try again.",

    "history.title": "History",
    "history.all": "All",
    "history.search": "Company or role",
    "history.clearDay": "Clear date",
    "history.loading": "Loading…",
    "history.empty": "No analyses yet.",
    "history.noMatch": "No analyses match these filters.",
    "history.untitled": "Untitled offer",
    "history.unknownCompany": "Unknown company",
    "history.unknownPlatform": "Unknown platform",
    "history.noVerdict": "No verdict",
    "history.fit": "Fit",

    "profile.title": "My profile",
    "profile.subtitle": "Rolent uses this data in every analysis.",
    "profile.loading": "Loading profile…",
    "profile.role": "Role",
    "profile.seniority": "Seniority",
    "profile.years": "Years of experience",
    "profile.location": "Location",
    "profile.skills": "Skills",
    "profile.skillPlaceholder": "Type a skill and press Enter",
    "profile.summary": "Summary",
    "profile.workType": "Work type",
    "profile.salary": "Expected salary",
    "profile.save": "Save",
    "profile.saving": "Saving…",
    "profile.saved": "Saved. The next analysis will use this profile.",
    "profile.signIn": "Sign in again.",
    "work.Remote": "Remote",
    "work.Hybrid": "Hybrid",
    "work.Onsite": "Onsite",

    "limit.remaining": "{n} of {total} analyses left today",
    "limit.reached": "You've used your {total} analyses for today. You'll get {total} more tomorrow.",
  },
} as const;

export type TranslationKey = keyof (typeof dictionary)["es"];

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function setLang(next: Lang) {
    localStorage.setItem(STORAGE_KEY, next);
    setLangState(next);
  }

  function t(key: TranslationKey, vars?: Record<string, string | number>) {
    let text: string = dictionary[lang][key];
    for (const [name, value] of Object.entries(vars ?? {})) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
    return text;
  }

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside LanguageProvider");
  return value;
}
