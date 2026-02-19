"use client";

import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { TopNav } from "@/components/TopNav";
import { supabase } from "@/lib/supabase";

type Venue = {
  id: string;
  name: string;
  category: string | null;
  city: string | null;
  area: string | null;
  status: string;
};

export default function VenuePage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [venue, setVenue] = useState<Venue | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("Gaborone");
  const [area, setArea] = useState("");

  async function load() {
    setMsg(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;

    const v = await supabase
      .from("venues")
      .select("id,name,category,city,area,status")
      .eq("owner_user_id", u.user.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const row = (v.data?.[0] as Venue | undefined) ?? null;
    setVenue(row);
  }

  async function createVenue() {
    setMsg(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;

    const { error } = await supabase.from("venues").insert({
      owner_user_id: u.user.id,
      name,
      category,
      city,
      area,
      status: "pending",
    });

    if (error) setMsg(error.message);
    setName(""); setCategory(""); setCity("Gaborone"); setArea("");
    await load();
  }

  useEffect(() => { load(); }, []);

  const locked = venue && venue.status !== "approved";

  return (
    <RequireAuth>
      <TopNav title="Venue Dashboard" />
      <div className="mx-auto max-w-5xl p-5">
        {msg && <div className="mb-4 rounded-xl bg-white/10 p-3 border border-white/10">{msg}</div>}

        {!venue && (
          <div className="rounded-2xl bg-black/50 border border-white/10 p-5 mb-6">
            <h2 className="text-lg font-semibold text-blue-300">Create Venue Profile</h2>
            <p className="text-sm opacity-80 mb-4">
              This is for salons, print shops, lounges, etc. It will be pending until Admin approves.
            </p>

            <div className="grid gap-2 md:grid-cols-2">
              <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                     placeholder="Venue name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                     placeholder="Category (salon, lounge, printshop)" value={category} onChange={(e) => setCategory(e.target.value)} />
              <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                     placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                     placeholder="Area (Broadhurst, Westgate, Main Mall…)" value={area} onChange={(e) => setArea(e.target.value)} />
            </div>

            <button onClick={createVenue} className="mt-3 w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
              Submit Venue
            </button>
          </div>
        )}

        {venue && (
          <div className="rounded-2xl bg-black/50 border border-white/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{venue.name}</h2>
                <p className="text-sm opacity-80">
                  {venue.category ?? "venue"} • {venue.area ?? "Area"} • {venue.city ?? "Botswana"}
                </p>
                <p className="text-sm opacity-80 mt-1">
                  Status: <span className="text-blue-300 font-semibold">{venue.status}</span>
                </p>
              </div>
              <button onClick={load} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm">
                Refresh
              </button>
            </div>

            {locked ? (
              <div className="mt-4 rounded-xl bg-white/10 p-3 border border-white/10 text-sm">
                Your venue is not approved yet. Admin must approve before it becomes an official media point.
              </div>
            ) : (
              <div className="mt-4 rounded-xl bg-white/10 p-3 border border-white/10 text-sm">
                Approved ✅ Next: Venue playback mode + ad play logging for this location.
              </div>
            )}
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
