"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { hasExplicitlySignedOut, hasKnownSignedInSession } from "@/lib/auth";
import { getCloudProfile } from "@/lib/cloud-profile";
import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";
import { loadState } from "@/lib/store";

const PUBLIC_PATHS = ["/auth", "/onboarding"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export default function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const publicPath = isPublicPath(pathname);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (!publicPath && hasSupabaseConfig()) {
        setChecking(true);
      }

      if (publicPath || !hasSupabaseConfig()) {
        if (!cancelled) setChecking(false);
        return;
      }

      if (typeof navigator !== "undefined" && !navigator.onLine) {
        if (hasExplicitlySignedOut() || !hasKnownSignedInSession()) {
          const next = encodeURIComponent(pathname);
          router.replace(`/auth/?next=${next}`);
          return;
        }

        const localRole = loadState().profile.role;
        const parentOnlyPath = pathname.startsWith("/parent");
        const learnerOnlyPath =
          pathname === "/" ||
          pathname.startsWith("/home") ||
          pathname.startsWith("/subjects") ||
          pathname.startsWith("/practice") ||
          pathname.startsWith("/module");

        const teacherOnlyPath = pathname.startsWith("/teacher");

        if (localRole === "parent" && (learnerOnlyPath || teacherOnlyPath)) {
          router.replace("/parent/");
          return;
        }

        if (localRole === "teacher" && !teacherOnlyPath && !pathname.startsWith("/pricing")) {
          router.replace("/teacher/");
          return;
        }

        if (localRole === "learner" && (parentOnlyPath || teacherOnlyPath)) {
          router.replace("/home/");
          return;
        }

        if (!cancelled) setChecking(false);
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        if (!cancelled) setChecking(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      if (cancelled) return;

      if (!data.session) {
        const next = encodeURIComponent(pathname);
        router.replace(`/auth/?next=${next}`);
        return;
      }

      const profile = await getCloudProfile().catch(() => null);
      if (cancelled) return;

      const parentOnlyPath = pathname.startsWith("/parent");
      const learnerOnlyPath =
        pathname === "/" ||
        pathname.startsWith("/home") ||
        pathname.startsWith("/subjects") ||
        pathname.startsWith("/practice") ||
        pathname.startsWith("/module");

      const teacherOnlyPath = pathname.startsWith("/teacher");

      if (profile?.role === "parent" && (learnerOnlyPath || teacherOnlyPath)) {
        router.replace("/parent/");
        return;
      }

      if (profile?.role === "teacher" && !teacherOnlyPath && !pathname.startsWith("/pricing")) {
        router.replace("/teacher/");
        return;
      }

      if (profile?.role === "learner" && (parentOnlyPath || teacherOnlyPath)) {
        router.replace("/home/");
        return;
      }

      setChecking(false);
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [pathname, publicPath, router]);

  if (!publicPath && checking && hasSupabaseConfig()) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#E7EFEA] text-emerald-800">
        <div className="flex flex-col items-center gap-3 rounded-3xl bg-white px-6 py-5 shadow-sm border border-emerald-100">
          <Loader2 className="h-7 w-7 animate-spin" />
          <p className="text-sm font-black">Checking account...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
