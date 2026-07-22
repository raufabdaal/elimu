"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasCompletedOnboarding, loadState } from "@/lib/store";

export default function EntryRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (hasCompletedOnboarding()) {
      const state = loadState();
      router.replace(state.profile.role === "parent" ? "/parent/" : "/home/");
    } else {
      router.replace("/onboarding/");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center text-muted">
      <div className="text-center">
        <div className="logo-mark mx-auto mb-4">E</div>
        <p className="text-sm font-medium">Loading Elimu…</p>
      </div>
    </div>
  );
}
