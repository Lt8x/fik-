"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/route-me");
      }
    };
    checkSession();
  }, [router]);

  async function handleAuth() {
    setLoading(true);
    setMsg(null);

    try {
      if (!email || !password) throw new Error("Email and password required.");

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Account created. You can now login.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/route-me");
      }
    } catch (e: any) {
      setMsg(e.message ?? "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-black to-white p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-black/60 p-8 text-white">
        <h1 className="text-3xl font-bold text-blue-400">Fiká</h1>
        <p className="mb-6 opacity-80">Arrive.</p>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode("signup")}
            className={`px-4 py-2 rounded-xl ${
              mode === "signup"
                ? "bg-blue-600 text-white"
                : "bg-white/10"
            }`}
          >
            Sign up
          </button>
          <button
            onClick={() => setMode("login")}
            className={`px-4 py-2 rounded-xl ${
              mode === "login"
                ? "bg-blue-600 text-white"
                : "bg-white/10"
            }`}
          >
            Login
          </button>
        </div>

        <input
          className="w-full mb-3 px-4 py-3 rounded-xl bg-white/10 outline-none"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-4 px-4 py-3 rounded-xl bg-white/10 outline-none"
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
          {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
        </button>

        {msg && <p className="mt-4">{msg}</p>}
      </div>
    </main>
  );
          }
