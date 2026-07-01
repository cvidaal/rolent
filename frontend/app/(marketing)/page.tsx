"use client"; // Para que el componente sea un cliente.

import { createClient } from "@/lib/supabase/client";
import { error } from "console";

export default function LandingPage() {
  const supabase = createClient();

  async function handleGoogleLogin() {
    await supabase.auth
      .signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      .then(({ error }) => {
        if (error) {
          console.error(error);
        }
      });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Rolent</h1>
      <p className="text-text-secondary mb-8">
        Analyze tech offers and apply with strategies.
      </p>
      <button
        onClick={handleGoogleLogin}
        className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover"
      >
        Continue with Google
      </button>
    </main>
  );
}
