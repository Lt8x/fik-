"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function TopNav({ title }: { title: string }) {
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="sticky top-0 z-20 border-b border-white/10 bg-black/50 backdrop-blur">
      <div className="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between">
        <div>
          <div className="text-blue-400 font-bold">Fiká</div>
          <div className="text-sm opacity-80">{title}</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push("/route-me")}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm"
          >
            Switch role view
          </button>
          <button
            onClick={logout}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
