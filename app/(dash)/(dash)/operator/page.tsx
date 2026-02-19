"use client";

import { useEffect, useState } from "react";
import { RequireAuth } from "@/components/RequireAuth";
import { TopNav } from "@/components/TopNav";
import { supabase } from "@/lib/supabase";

type Operator = { id: string; name: string; status: string };
type Route = { id: string; name: string; origin: string; destination: string; active: boolean };
type Vehicle = { id: string; plate_number: string; capacity: number; status: string; route_id: string | null };

export default function OperatorPage() {
  const [me, setMe] = useState<{ userId: string } | null>(null);

  const [operator, setOperator] = useState<Operator | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [msg, setMsg] = useState<string | null>(null);

  // forms
  const [opName, setOpName] = useState("");
  const [routeName, setRouteName] = useState("");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [plate, setPlate] = useState("");
  const [capacity, setCapacity] = useState(15);
  const [vehicleRouteId, setVehicleRouteId] = useState<string>("");

  async function loadAll() {
    setMsg(null);
    const { data: u } = await supabase.auth.getUser();
    const user = u?.user;
    if (!user) return;

    setMe({ userId: user.id });

    const op = await supabase.from("operators").select("id,name,status").eq("owner_user_id", user.id).order("created_at", { ascending: false }).limit(1);
    const opRow = (op.data?.[0] as Operator | undefined) ?? null;
    setOperator(opRow);

    if (opRow) {
      const r = await supabase.from("routes").select("id,name,origin,destination,active").eq("operator_id", opRow.id).order("created_at", { ascending: false });
      if (!r.error) setRoutes((r.data ?? []) as Route[]);

      const v = await supabase.from("vehicles").select("id,plate_number,capacity,status,route_id").eq("operator_id", opRow.id).order("created_at", { ascending: false });
      if (!v.error) setVehicles((v.data ?? []) as Vehicle[]);
    } else {
      setRoutes([]);
      setVehicles([]);
    }
  }

  async function createOperator() {
    if (!me?.userId) return;
    setMsg(null);
    const { error } = await supabase.from("operators").insert({ owner_user_id: me.userId, name: opName, city: "Gaborone", status: "pending" });
    if (error) setMsg(error.message);
    setOpName("");
    await loadAll();
  }

  async function createRoute() {
    if (!operator) return;
    setMsg(null);
    const { error } = await supabase.from("routes").insert({
      operator_id: operator.id,
      name: routeName,
      origin,
      destination,
      active: true,
    });
    if (error) setMsg(error.message);
    setRouteName(""); setOrigin(""); setDestination("");
    await loadAll();
  }

  async function createVehicle() {
    if (!operator) return;
    setMsg(null);
    const { error } = await supabase.from("vehicles").insert({
      operator_id: operator.id,
      route_id: vehicleRouteId || null,
      plate_number: plate,
      capacity,
      status: "active",
    });
    if (error) setMsg(error.message);
    setPlate(""); setCapacity(15); setVehicleRouteId("");
    await loadAll();
  }

  useEffect(() => {
    loadAll();
  }, []);

  const locked = operator && operator.status !== "approved";

  return (
    <RequireAuth>
      <TopNav title="Operator Dashboard" />
      <div className="mx-auto max-w-5xl p-5">
        {msg && <div className="mb-4 rounded-xl bg-white/10 p-3 border border-white/10">{msg}</div>}

        {!operator && (
          <div className="rounded-2xl bg-black/50 border border-white/10 p-5 mb-6">
            <h2 className="text-lg font-semibold text-blue-300">Create Operator Profile</h2>
            <p className="text-sm opacity-80 mb-4">This will be pending until Admin approves.</p>
            <div className="flex gap-2 flex-wrap">
              <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none min-w-[260px]"
                     placeholder="Operator / Fleet name" value={opName} onChange={(e) => setOpName(e.target.value)} />
              <button onClick={createOperator} className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
                Submit
              </button>
            </div>
          </div>
        )}

        {operator && (
          <div className="rounded-2xl bg-black/50 border border-white/10 p-5 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">{operator.name}</h2>
                <p className="text-sm opacity-80">Status: <span className="text-blue-300 font-semibold">{operator.status}</span></p>
              </div>
              <button onClick={loadAll} className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-sm">Refresh</button>
            </div>

            {locked && (
              <div className="mt-4 rounded-xl bg-white/10 p-3 border border-white/10 text-sm">
                Your operator account is not approved yet. Admin must approve before you can add routes/vehicles.
              </div>
            )}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className={`rounded-2xl bg-black/50 border border-white/10 p-5 ${locked ? "opacity-60 pointer-events-none" : ""}`}>
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Routes</h3>
            <div className="space-y-2 mb-4">
              <input className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                     placeholder="Route name (e.g. Gabs → Tlokweng)" value={routeName} onChange={(e) => setRouteName(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                       placeholder="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                       placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
              </div>
              <button onClick={createRoute} className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
                Add Route
              </button>
            </div>

            <div className="space-y-3">
              {routes.map((r) => (
                <div key={r.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="font-semibold">{r.name}</div>
                  <div className="text-sm opacity-80">{r.origin} → {r.destination}</div>
                </div>
              ))}
              {routes.length === 0 && <div className="opacity-70 text-sm">No routes yet.</div>}
            </div>
          </div>

          <div className={`rounded-2xl bg-black/50 border border-white/10 p-5 ${locked ? "opacity-60 pointer-events-none" : ""}`}>
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Vehicles</h3>

            <div className="space-y-2 mb-4">
              <input className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                     placeholder="Plate number" value={plate} onChange={(e) => setPlate(e.target.value)} />
              <div className="grid grid-cols-2 gap-2">
                <input className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                       placeholder="Capacity" type="number" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value || "0", 10) || 0)} />
                <select className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 outline-none"
                        value={vehicleRouteId} onChange={(e) => setVehicleRouteId(e.target.value)}>
                  <option value="">No route</option>
                  {routes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>
              <button onClick={createVehicle} className="w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold">
                Add Vehicle
              </button>
            </div>

            <div className="space-y-3">
              {vehicles.map((v) => (
                <div key={v.id} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="font-semibold">{v.plate_number}</div>
                  <div className="text-sm opacity-80">Capacity: {v.capacity} • Status: {v.status}</div>
                </div>
              ))}
              {vehicles.length === 0 && <div className="opacity-70 text-sm">No vehicles yet.</div>}
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
