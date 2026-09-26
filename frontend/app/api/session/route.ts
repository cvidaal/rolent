import { DAILY_LIMIT, startOfToday } from "@/lib/daily-limit";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

type Verdict = "apply" | "negotiate" | "skip";

function parseVerdict(
  raw: string,
): { verdict: Verdict; reply: string; score: number; title: string; company: string; platform: string } | null {
  const cleaned = raw.replace(/^```json\s*|\s*```$/g, "").trim();
  try {
    const parsed = JSON.parse(cleaned) as {
      verdict?: string;
      reply?: string;
      score?: number;
      title?: string;
      company?: string;
      platform?: string;
    };
    if (
      (parsed.verdict !== "apply" &&
        parsed.verdict !== "negotiate" &&
        parsed.verdict !== "skip") ||
      !parsed.reply?.trim()
    ) {
      return null;
    }

    const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
    const fallback = parsed.verdict === "apply" ? 80 : parsed.verdict === "negotiate" ? 55 : 20;
    const score = Number(parsed.score);
    return {
      verdict: parsed.verdict,
      reply: parsed.reply.trim(),
      score: Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : fallback,
      title: text(parsed.title),
      company: text(parsed.company),
      platform: text(parsed.platform),
    };
  } catch {
    return null;
  }
}

async function answerFollowUp(apiKey: string, context: string, chat: ChatMessage[]) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.5,
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: `You are Rolent, a fit analyst for developers in Spain.
The verdict on this offer was already given earlier in the conversation. Now the person asks a follow-up question.

Rules
- Answer ONLY the latest question. Do not repeat the verdict, the description of the role, the list of matching skills or the pay sentence. The person already read them.
- Bring new, concrete information. Generic advice ("keep learning", "highlight your strengths") is not allowed.
- If they ask what they are missing: list each missing requirement of the offer and, for each one, one concrete way to cover or frame it (a small project, a certification, how to explain related experience in the interview).
- If they ask how to prepare the interview: list the specific topics and likely questions this offer points to, based on its requirements.
- If they ask what they can negotiate: name the levers the offer leaves open (salary if stated, remote days, start date, training budget, seniority level) and what in the profile supports each one.
- For any other question, answer it directly using the offer and the profile.
- Use a short list when it helps readability. At most 8 lines.
- Write in the same language as the job offer, no matter the language of the question.
- Plain text only. No JSON, no markdown headings.

${context}`,
        },
        ...chat,
      ],
    }),
  });

  if (!response.ok) {
    console.error("OpenAI error", response.status, await response.text());
    return NextResponse.json(
      { error: "The model could not answer. Check the API key and try again." },
      { status: 502 },
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const reply = data.choices?.[0]?.message?.content?.trim();
  if (!reply) {
    return NextResponse.json({ error: "The model returned an empty reply." }, { status: 502 });
  }
  return NextResponse.json({ reply });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in to talk to Rolent." }, { status: 401 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY in frontend/.env." },
      { status: 500 },
    );
  }

  const body = (await request.json()) as {
    offer?: string;
    messages?: ChatMessage[];
  };

  const offer = body.offer?.trim() ?? "";
  const messages = (body.messages ?? []).filter(
    (message) =>
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim(),
  );

  if (!offer) {
    return NextResponse.json({ error: "Paste a job offer first." }, { status: 400 });
  }

  if (messages.length === 0) {
    return NextResponse.json({ error: "Write a message first." }, { status: 400 });
  }

  const isNewAnalysis = messages.filter((message) => message.role === "user").length === 1;

  let usedToday = 0;
  if (isNewAnalysis) {
    const { count } = await supabase
      .from("analyses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfToday());

    usedToday = count ?? 0;
    if (usedToday >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: `Daily limit reached. You can analyze ${DAILY_LIMIT} offers a day.`, code: "daily_limit" },
        { status: 429 },
      );
    }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "headline, seniority, years_of_experience, location, skills, summary, work_type, salary_range",
    )
    .eq("id", user.id)
    .single();

  const context = `Who is who
- Profile: what the person ALREADY has (skills, years, seniority, summary, expected salary, remote preference).
- Offer: what the role REQUIRES.
Do not swap them. Never write "the profile is looking for a developer". The profile is not hiring. The role asks, the person has.

Pay
Do not invent market salaries or Spain-wide bands. If the offer states pay, you may quote it. Never estimate a number the offer does not give.

Profile:
${JSON.stringify(profile ?? {})}

Job offer:
${offer}`;

  const chat = messages.map((message) => ({ role: message.role, content: message.content }));

  if (!isNewAnalysis) {
    return answerFollowUp(apiKey, context, chat);
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are Rolent, a fit analyst for developers in Spain.
Decide whether THIS person should pursue THIS offer. Do not encourage applying. Do not rewrite the CV. Do not invent facts.

Return only this JSON:
{"verdict":"apply"|"negotiate"|"skip","score":0,"title":"","company":"","platform":"","reply":"..."}
title is the role name. company is the employer. platform is where the offer was posted (LinkedIn, InfoJobs, company site). Use "" if the offer does not say it. Do not invent them.

How to score
score is an integer from 0 to 100 and must fall inside the verdict band.
- apply 70-100: the offer's main language and type of work are already in the profile. Missing pieces are details, not the core.
- negotiate 40-69: the core matches, and named requirements are missing but could be covered or negotiated.
- skip 0-39: the core does not match. If the offer's domain (healthcare, banking, SAP) or primary language is absent from the profile, score 5-20, not close to 40.
A generic skill ("Integraciones", "Cloud") does not count as the offer's specific technology (HL7, FHIR, Java, Kafka).

If the offer states pay, compare it with the profile salary_range. If it does not, say so in one sentence.

reply
Write the reply in the same language as the job offer. If the offer is in Spanish, reply in Spanish. If the offer is in English, reply in English. Ignore the language of the user's message.
At most 5 sentences. Do not repeat the same requirement twice.
1) one sentence on the role the offer is hiring for;
2) technologies the person already has that the offer asks for;
3) only the gaps not already named in sentence 1;
4) pay, only if the offer states it, or one sentence saying it does not;
5) whether to continue, negotiate, or walk away.

${context}`,
        },
        ...chat,
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("OpenAI error", response.status, detail);
    return NextResponse.json(
      { error: "The model could not answer. Check the API key and try again." },
      { status: 502 },
    );
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const parsed = parseVerdict(data.choices?.[0]?.message?.content?.trim() ?? "");

  if (!parsed) {
    return NextResponse.json({ error: "The model returned an empty reply." }, { status: 502 });
  }

  if (isNewAnalysis) {
    const { error } = await supabase.from("analyses").insert({
      user_id: user.id,
      job_url: offer.slice(0, 500),
      score: parsed.score,
      result: {
        offer,
        verdict: parsed.verdict,
        score: parsed.score,
        reply: parsed.reply,
        title: parsed.title,
        company: parsed.company,
        platform: parsed.platform,
      },
    });
    if (error) console.error("Could not save analysis", error.message);
    else usedToday += 1;
  }

  return NextResponse.json({ ...parsed, remaining: Math.max(0, DAILY_LIMIT - usedToday) });
}
