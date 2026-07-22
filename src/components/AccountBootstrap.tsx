"use client";

import { useEffect } from "react";
import { ensureCloudProfile, syncLocalSnapshotToCloud } from "@/lib/cloud-profile";
import { getSupabaseClient } from "@/lib/supabase";

export default function AccountBootstrap() {
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    let cancelled = false;

    const syncIfSignedIn = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session || cancelled) return;
        await ensureCloudProfile();
        if (navigator.onLine) {
          await syncLocalSnapshotToCloud().catch(() => null);
        }
      } catch {
        // Keep the app offline-first. Auth/sync errors must never block local learning.
      }
    };

    syncIfSignedIn();

    const handleOnline = () => syncIfSignedIn();
    window.addEventListener("online", handleOnline);

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        syncIfSignedIn();
      }
    });

    return () => {
      cancelled = true;
      window.removeEventListener("online", handleOnline);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return null;
}
