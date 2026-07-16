"use client";

import { ReactNode } from "react";
import TabBar from "./TabBar";

interface AppShellProps {
  children: ReactNode;
  activeTab?: "home" | "subjects" | "practice" | "parent";
  showTabBar?: boolean;
  noScrollPad?: boolean;
}

export default function AppShell({
  children,
  activeTab,
  showTabBar = true,
  noScrollPad = false,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <div className="app-container">
        <div className={noScrollPad ? "scroll no-tab" : "scroll"}>{children}</div>
        {showTabBar && activeTab && <TabBar active={activeTab} />}
      </div>
    </div>
  );
}
