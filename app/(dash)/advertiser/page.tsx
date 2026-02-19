"use client";

import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { TopNav } from "@/components/TopNav";
import { supabase } from "@/lib/supabase";

type Advertiser = { id: string; name: string; status: string };
type Campaign = { id: string; title: string; status: string; start_date: string; end_date: string; audio_url: string | null; budget_pula: number };

export default function AdvertiserPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [adv, setAdv] = useState<Advertiser | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const [advName, setAdvName] = useState("");
  const [title, setTitle] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [budget, setBudget] = useState<number>(0);

  async function load() {
    setMsg(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;

    const a = await supabase.from("advertisers").select("id,name,status").eq("owner_user_id", u.user.id).order("created_at", { ascending: false }).limit(1);
    const advRow = (a.data?.[0] as Advertiser | undefined) ?? null;
    setAdv(advRow);

    if (advRow) {
      const c = await supabase.from("campaigns")
        .select("id,title,status,start_date,end_date,audio_url,budget_pula")
        .eq("advertiser_id", advRow.id)
        .order("created_at", { ascending: false });

      if (!c.error) setCampaigns((c.data ?? []) as Campaign[]);
    } else {
      setCampaigns([]);
    }
  }

  async function createAdvertiser() {
    setMsg(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;

    const { error } = await supabase.from("advertisers").insert({
      owner_user_id: u.user.id,
      name: advName,
      status: "pending",
    });

    if (error) setMsg(error.message);
    setAdvName("");
    await load();
  }

  async function createCampaign() {
    if (!adv) return;
    setMsg(null);
    const { error } = await supabase.from("campaigns").insert({
      advertiser_id: adv.id,
      title,
      audio_url: audioUrl || null,
      start_date: start,
      end_date: end,
      budget_pula: budget,
      status: "pending",
    });

    if (error) setMsg(error.message);
    setTitle(""); setAudioUrl(""); setStart(""); setEnd(""); setBudget(0);
    await load();
  }

  useEffect(() => { load(); }, []);

  const locked = adv && adv.status !== "approved";

  return (
    <RequireAuth>
      <TopNav title="Advertiser Dashboard" />
      <div className="mx-auto max-w-5xl p-5">
        {msg && <div className="mb-4 rounded-xl bg-white/10 p-3 border border-white/10">{msg}</div>}

        {!adv && (
          <div className="rounded-2xl bg-black/50 border border-white/10 p-5 mb-6">
            <h2 className="text-lg font-semibold text-blue-300">Create Advertiser Profile</h2>
            <p className="text-sm opacity-80 mb-4">Pending until Admin approves.</p>
            <div className="flex gap-2 flex-wrap">
              <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none min-w-[260px]"
                     placeholder="Business name" value={advName} onChange={(e) => setAdvName(e.target.value)} />
              <button onClick={createAdvertiser} className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
                Submit
              </button>
            </div>
          </div>
        )}

        {adv && (
          <div className="rounded-2xl bg-black/50 border border-white/10 p-5 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{adv.name}</h2>
                <p className="text-sm opacity-80">Status: <span className="text-blue-300 font-semibold">{adv.status}</span></p>
              </div>
              <button onClick={load} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm">Refresh</button>
            </div>

            {locked && (
              <div className="mt-4 rounded-xl bg-white/10 p-3 border border-white/10 text-sm">
                Not approved yet. Admin must approve before campaigns can run.
              </div>
            )}
          </div>
        )}

        <div className={`rounded-2xl bg-black/50 border border-white/10 p-5 ${locked ? "opacity-60 pointer-events-none" : ""}`}>
          <h3 className="text-lg font-semibold text-blue-300 mb-3">Create Campaign</h3>
          <div className="grid gap-2 md:grid-cols-2">
            <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                   placeholder="Campaign title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                   placeholder="Audio URL (we’ll upload next)" value={audioUrl} onChange={(e) => setAudioUrl(e.target.value)} />
            <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                   placeholder="Start date (YYYY-MM-DD)" value={start} onChange={(e) => setStart(e.target.value)} />
            <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                   placeholder="End date (YYYY-MM-DD)" value={end} onChange={(e) => setEnd(e.target.value)} />
            <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                   placeholder="Budget (Pula)" type="number" value={budget}
                   onChange={(e) => setBudget(parseFloat(e.target.value || "0") || 0)} />
          </div>
          <button onClick={createCampaign} className="mt-3 w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
            Create Campaign
          </button>

          <div className="mt-6 space-y-3">
            {campaigns.map((c) => (
              <div key={c.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm opacity-80">
                  {c.start_date} → {c.end_date} • Status: {c.status} • Budget: P{c.budget_pula}
                </div>
              </div>
            ))}
            {campaigns.length === 0 && <div className="opacity-70 text-sm">No campaigns yet.</div>}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
