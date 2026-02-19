"use client";

import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { TopNav } from "@/components/TopNav";
import { supabase } from "@/lib/supabase";

type Operator = { id: string; name: string; status: string; city: string | null; created_at: string };
type Advertiser = { id: string; name: string; status: string; created_at: string };

export default function AdminPage() {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    setMsg(null);
    const ops = await supabase.from("operators").select("id,name,status,city,created_at").order("created_at", { ascending: false });
    const ads = await supabase.from("advertisers").select("id,name,status,created_at").order("created_at", { ascending: false });

    if (!ops.error) setOperators((ops.data ?? []) as Operator[]);
    if (!ads.error) setAdvertisers((ads.data ?? []) as Advertiser[]);
  }

  async function setOperatorStatus(id: string, status: string) {
    const { error } = await supabase.from("operators").update({ status }).eq("id", id);
    if (error) setMsg(error.message);
    await load();
  }

  async function setAdvertiserStatus(id: string, status: string) {
    const { error } = await supabase.from("advertisers").update({ status }).eq("id", id);
    if (error) setMsg(error.message);
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <RequireAuth>
      <TopNav title="Admin Dashboard" />
      <div className="mx-auto max-w-5xl p-5">
        {msg && <div className="mb-4 rounded-xl bg-white/10 p-3 border border-white/10">{msg}</div>}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-black/50 border border-white/10 p-5">
            <h2 className="text-lg font-semibold text-blue-300 mb-3">Operators</h2>
            <div className="space-y-3">
              {operators.map((o) => (
                <div key={o.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="font-semibold">{o.name}</div>
                  <div className="text-sm opacity-80">Status: {o.status} • {o.city ?? "Botswana"}</div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <button onClick={() => setOperatorStatus(o.id, "approved")} className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm">Approve</button>
                    <button onClick={() => setOperatorStatus(o.id, "rejected")} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm">Reject</button>
                    <button onClick={() => setOperatorStatus(o.id, "suspended")} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm">Suspend</button>
                  </div>
                </div>
              ))}
              {operators.length === 0 && <div className="opacity-70 text-sm">No operators yet.</div>}
            </div>
          </div>

          <div className="rounded-2xl bg-black/50 border border-white/10 p-5">
            <h2 className="text-lg font-semibold text-blue-300 mb-3">Advertisers</h2>
            <div className="space-y-3">
              {advertisers.map((a) => (
                <div key={a.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="font-semibold">{a.name}</div>
                  <div className="text-sm opacity-80">Status: {a.status}</div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <button onClick={() => setAdvertiserStatus(a.id, "approved")} className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm">Approve</button>
                    <button onClick={() => setAdvertiserStatus(a.id, "rejected")} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm">Reject</button>
                    <button onClick={() => setAdvertiserStatus(a.id, "suspended")} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm">Suspend</button>
                  </div>
                </div>
              ))}
              {advertisers.length === 0 && <div className="opacity-70 text-sm">No advertisers yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
                               }
