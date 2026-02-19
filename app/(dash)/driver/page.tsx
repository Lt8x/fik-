"use client";

import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { TopNav } from "@/components/TopNav";
import { supabase } from "@/lib/supabase";

type Assignment = { operator_id: string; vehicle_id: string | null };
type Trip = { id: string; status: string; started_at: string; ended_at: string | null; operator_id: string; vehicle_id: string; route_id: string | null };

export default function DriverPage() {
  const [msg, setMsg] = useState<string | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

  async function load() {
    setMsg(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;

    const a = await supabase.from("driver_assignments")
      .select("operator_id,vehicle_id")
      .eq("driver_user_id", u.user.id)
      .eq("status", "active")
      .limit(1);

    const row = (a.data?.[0] as Assignment | undefined) ?? null;
    setAssignment(row);

    const t = await supabase.from("trips")
      .select("id,status,started_at,ended_at,operator_id,vehicle_id,route_id")
      .eq("driver_user_id", u.user.id)
      .eq("status", "active")
      .order("started_at", { ascending: false })
      .limit(1);

    setActiveTrip((t.data?.[0] as Trip | undefined) ?? null);
  }

  async function startTrip() {
    setMsg(null);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    if (!assignment?.operator_id || !assignment?.vehicle_id) {
      setMsg("No active assignment with a vehicle. Operator must assign you.");
      return;
    }

    const { error } = await supabase.from("trips").insert({
      operator_id: assignment.operator_id,
      vehicle_id: assignment.vehicle_id,
      route_id: null,
      driver_user_id: u.user.id,
      status: "active",
    });

    if (error) setMsg(error.message);
    await load();
  }

  async function endTrip() {
    setMsg(null);
    if (!activeTrip) return;

    const { error } = await supabase.from("trips").update({
      status: "completed",
      ended_at: new Date().toISOString(),
    }).eq("id", activeTrip.id);

    if (error) setMsg(error.message);
    await load();
  }

  async function logAdPlay() {
    setMsg(null);
    if (!activeTrip) return setMsg("Start a trip first.");

    // For MVP: you can log ad plays against any existing campaign_id later.
    // For now we’ll require a campaign id input in next iteration (or auto-pick active campaign).
    setMsg("Next step: add campaign picker + validate. (Your trip logging works.)");
  }

  useEffect(() => { load(); }, []);

  return (
    <RequireAuth>
      <TopNav title="Driver Dashboard" />
      <div className="mx-auto max-w-5xl p-5">
        {msg && <div className="mb-4 rounded-xl bg-white/10 p-3 border border-white/10">{msg}</div>}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-black/50 border border-white/10 p-5">
            <h2 className="text-lg font-semibold text-blue-300 mb-2">Your Assignment</h2>
            {!assignment && <p className="text-sm opacity-80">No assignment yet. Operator must assign you.</p>}
            {assignment && (
              <div className="text-sm opacity-90">
                <div>Operator: {assignment.operator_id}</div>
                <div>Vehicle: {assignment.vehicle_id ?? "Not set"}</div>
              </div>
            )}
            <button onClick={load} className="mt-4 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm">Refresh</button>
          </div>

          <div className="rounded-2xl bg-black/50 border border-white/10 p-5">
            <h2 className="text-lg font-semibold text-blue-300 mb-2">Trip Control</h2>

            {!activeTrip ? (
              <>
                <p className="text-sm opacity-80 mb-4">No active trip.</p>
                <button onClick={startTrip} className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
                  Start Trip
                </button>
              </>
            ) : (
              <>
                <p className="text-sm opacity-80">Active Trip: {activeTrip.id}</p>
                <p className="text-xs opacity-70 mb-4">Started: {new Date(activeTrip.started_at).toLocaleString()}</p>

                <div className="flex gap-2">
                  <button onClick={logAdPlay} className="flex-1 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 font-semibold">
                    Log Ad Play
                  </button>
                  <button onClick={endTrip} className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
                    End Trip
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
