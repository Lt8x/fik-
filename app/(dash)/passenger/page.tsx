"use client";

import { RequireAuth } from "@/components/RequireAuth";
import { TopNav } from "@/components/TopNav";

export default function PassengerPage() {
  return (
    <RequireAuth>
      <TopNav title="Passenger Dashboard" />
      <div className="mx-auto max-w-5xl p-5">
        <div className="rounded-2xl bg-black/50 border border-white/10 p-5">
          <h2 className="text-lg font-semibold text-blue-300">Passenger</h2>
          <p className="text-sm opacity-80">Next: route discovery + join trip + loyalty points.</p>
        </div>
      </div>
    </RequireAuth>
  );
}
