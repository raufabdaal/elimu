"use client";

import { useEffect, useState } from "react";
import { CloudCheck, CloudOff, CloudUpload } from "lucide-react";
import { getQueuedAnswerEventCount } from "@/lib/sync";

export default function SyncStatus() {
  const [online, setOnline] = useState(true);
  const [queuedCount, setQueuedCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      setOnline(typeof navigator === "undefined" ? true : navigator.onLine);
      setQueuedCount(getQueuedAnswerEventCount());
    };

    refresh();
    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);
    window.addEventListener("elimu-sync-queue-changed", refresh);
    const interval = window.setInterval(refresh, 10000);

    return () => {
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);
      window.removeEventListener("elimu-sync-queue-changed", refresh);
      window.clearInterval(interval);
    };
  }, []);

  const synced = online && queuedCount === 0;
  const title = !online
    ? queuedCount > 0
      ? `${queuedCount} answer${queuedCount === 1 ? "" : "s"} waiting for internet`
      : "Offline — progress stays on this device until internet returns"
    : queuedCount > 0
    ? `${queuedCount} answer${queuedCount === 1 ? "" : "s"} waiting to save online`
    : "Saved online";

  return (
    <div
      title={title}
      aria-label={title}
      className={`relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border shadow-2xs ${
        synced
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : online
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-slate-200 bg-slate-100 text-slate-500"
      }`}
    >
      {synced ? (
        <CloudCheck className="h-4.5 w-4.5" />
      ) : online ? (
        <CloudUpload className="h-4.5 w-4.5" />
      ) : (
        <CloudOff className="h-4.5 w-4.5" />
      )}
      {queuedCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-black text-white ring-2 ring-white">
          {queuedCount > 9 ? "9+" : queuedCount}
        </span>
      )}
    </div>
  );
}
