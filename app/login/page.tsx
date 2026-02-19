"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) router.push("/route-me");
    })();
  }, [router]);

  async function handleAuth() {
    setLoading(true);
    setMsg(null);
    try {
      if (!email || !password) throw new Error("Email and password required.");

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account created. Now login.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/route-me");
      }
    } catch (e: any) {
      setMsg(e?.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-black/65 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-blue-400">Fiká</h1>
          <p className="opacity-80">Arrive.</p>
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("login")}
            className={`px-4 py-2 rounded-xl ${
              mode === "login" ? "bg-blue-600" : "bg-white/10"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`px-4 py-2 rounded-xl ${
              mode === "signup" ? "bg-blue-600" : "bg-white/10"
            }`}
          >
            Sign up
          </button>
        </div>

        <input
          className="w-full mb-3 px-4 py-3 rounded-xl bg-white/10 outline-none border border-white/10 focus:border-blue-500"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10 outline-none border border-white/10 focus:border-blue-500"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          disabled={loading}
          onClick={handleAuth}
          className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold disabled:opacity-60"
        >
          {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Login"}
        </button>

        {msg && <p className="mt-4 text-sm opacity-90">{msg}</p>}
        <p className="mt-6 text-xs opacity-70">
          Botswana theme: 🔵 primary, 🖤 depth, 🤍 contrast.
        </p>
      </div>
    </main>
  );
}
