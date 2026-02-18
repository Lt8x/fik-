"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RouteMe() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return router.push("/");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error || !profile?.role) return router.push("/");

      const role = profile.role;
      if (role === "admin") return router.push("/admin");
      if (role === "operator") return router.push("/operator");
      if (role === "driver") return router.push("/driver");
      if (role === "advertiser") return router.push("/advertiser");
      return router.push("/passenger");
    })();
  }, [router]);

  return <div className="p-6">Routing…</div>;
}
