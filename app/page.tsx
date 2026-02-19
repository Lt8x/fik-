import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-white text-white">
      <div className="mx-auto max-w-5xl p-8">
        <div className="rounded-3xl border border-white/15 bg-black/60 p-8">
          <h1 className="text-4xl font-bold text-blue-400">Fiká</h1>
          <p className="mt-2 text-lg opacity-85">Arrive.</p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-blue-300">Mobility Network</h2>
              <p className="mt-2 text-sm opacity-85">
                Trips, drivers, operators, routes — and ad playback validation on vehicles.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-blue-300">Venue Network</h2>
              <p className="mt-2 text-sm opacity-85">
                Salons, print shops, lounges and high-foot-traffic spaces become media distribution points.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 font-semibold"
            >
              Login / Sign up
            </Link>
            <Link
              href="/route-me"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 font-semibold"
            >
              Go to dashboard
            </Link>
          </div>

          <p className="mt-6 text-xs opacity-70">
            Botswana theme: 🔵 Blue • 🖤 Black • 🤍 White
          </p>
        </div>
      </div>
    </main>
  );
}
