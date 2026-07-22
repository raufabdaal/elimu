"use client";

import React, { useEffect, useState } from "react";
import { Download, WifiOff, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAControls() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Service Worker registered successfully:", reg.scope))
        .catch((err) => console.warn("Service Worker registration failed:", err));
    }

    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone;
    setIsStandalone(!!standalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem("elimu_pwa_dismissed");
      if (!dismissed && !standalone) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallBanner(false);
      }
      setInstallPrompt(null);
    } else {
      alert(
        "To install Elimu App on your phone/tablet:\n\n• On iPhone/iPad (Safari): Tap the Share button below and select 'Add to Home Screen'.\n• On Android (Chrome): Tap the 3 dots menu at top right and select 'Install app' or 'Add to Home Screen'."
      );
    }
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    try {
      localStorage.setItem("elimu_pwa_dismissed", "true");
    } catch {}
  };

  return (
    <>
      {isOffline && (
        <div className="fixed left-1/2 z-[100] flex max-w-[calc(100vw-24px)] -translate-x-1/2 items-center justify-center gap-2 rounded-full border border-amber-300/70 bg-amber-600/95 px-3.5 py-2 text-center text-[11px] font-black text-white shadow-lg backdrop-blur-md top-[calc(env(safe-area-inset-top,0px)+10px)]">
          <WifiOff className="h-3.5 w-3.5 shrink-0 animate-pulse" />
          <span className="min-w-0 truncate">Offline mode — saved lessons ready</span>
        </div>
      )}

      {!isStandalone && showInstallBanner && (
        <div className="fixed inset-x-0 bottom-0 z-[95] px-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
          <div className="mx-auto flex w-full max-w-[460px] items-center justify-between gap-3 rounded-[24px] border border-emerald-400/40 bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 px-3.5 py-3 text-white shadow-2xl sm:max-w-[768px]">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-xl font-black text-emerald-800 shadow-sm">
                E
              </div>
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="truncate text-sm font-black text-white">Download Elimu App</span>
                  <span className="hidden shrink-0 rounded-md border border-emerald-400/30 bg-emerald-500/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-100 sm:inline-flex">
                    Offline
                  </span>
                </div>
                <p className="truncate text-xs font-semibold text-emerald-100/90">
                  Install for 1-tap learning anytime.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={handleInstallClick}
                className="inline-flex min-h-0 items-center justify-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-emerald-900 shadow-sm transition-all hover:bg-emerald-50 active:scale-95"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Install</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/20 text-white/80 transition-colors hover:bg-black/40 hover:text-white"
                title="Dismiss"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
