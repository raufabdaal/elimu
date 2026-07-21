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
    // Register Service Worker for offline PWA capabilities
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Service Worker registered successfully:", reg.scope))
        .catch((err) => console.warn("Service Worker registration failed:", err));
    }

    // Check offline status
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Check standalone (installed app) status
    if (typeof window !== "undefined") {
      const standalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as unknown as { standalone?: boolean }).standalone;
      setIsStandalone(!!standalone);
    }

    // Capture install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Show prompt if not dismissed or installed
      const dismissed = localStorage.getItem("elimu_pwa_dismissed");
      if (!dismissed && !isStandalone) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, [isStandalone]);

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
        "To install Elimu App on your phone/tablet:\n\n• On iPhone/iPad (Safari): Tap the Share button (⎋) below and select 'Add to Home Screen' (➕).\n• On Android (Chrome): Tap the 3 dots menu (⋮) at top right and select 'Install app' or 'Add to Home Screen'."
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
      {/* Offline Status Banner (`Top Fixed Bar when Offline`) */}
      {isOffline && (
        <div className="w-full bg-amber-600 text-white font-extrabold text-xs py-2 px-4 text-center flex items-center justify-center gap-2 shadow-md z-[100] relative">
          <WifiOff className="w-4 h-4 shrink-0 animate-pulse" />
          <span>⚡ Offline Mode Active — All 4,435+ Questions & Local Storage Ready!</span>
        </div>
      )}

      {/* Install Elimu App Banner (`High-Visibility PWA Prompt`) */}
      {!isStandalone && showInstallBanner && (
        <div className="w-full bg-gradient-to-r from-emerald-700 via-teal-800 to-emerald-900 text-white px-4 py-3 shadow-md z-[90] relative border-b border-emerald-500/40">
          <div className="max-w-[768px] mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-white text-emerald-800 font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
                E
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-black text-sm text-white">Download Elimu App</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/40 text-emerald-100 px-2 py-0.5 rounded-md border border-emerald-400/30">
                    Offline Ready
                  </span>
                </div>
                <p className="text-xs text-emerald-100/90 font-semibold truncate sm:whitespace-normal">
                  Install on your phone or tablet for instant 1-tap access anytime!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleInstallClick}
                className="btn bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install App</span>
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white flex items-center justify-center transition-colors shrink-0"
                title="Dismiss"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
