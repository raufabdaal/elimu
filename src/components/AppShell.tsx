"use client";

import { ReactNode } from "react";
import TabBar from "./TabBar";

interface AppShellProps {
  children: ReactNode;
  activeTab?: "home" | "subjects" | "practice" | "parent" | "pair";
  showTabBar?: boolean;
  noScrollPad?: boolean;
  role?: "learner" | "parent";
}

export default function AppShell({
  children,
  activeTab,
  showTabBar = true,
  noScrollPad = false,
  role = "learner",
}: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="app-container">
        <div className={noScrollPad ? "scroll no-tab" : "scroll"}>{children}</div>
        {showTabBar && activeTab && <TabBar active={activeTab} role={role} />}
      </div>
    </div>
  );
}
