"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const supabase = createClient();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/"); // Redirigimos al usuario a la página de inicio.
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-800"
      >
        Logout
      </button>
    </main>
  );
}
