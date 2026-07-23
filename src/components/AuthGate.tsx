"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase";

const PUBLIC_PATHS = ["/auth"];

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
      if (publicPath || !hasSupabaseConfig()) {
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
