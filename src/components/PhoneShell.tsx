"use client";

import { ReactNode } from "react";
import StatusBar from "./StatusBar";
import TabBar from "./TabBar";

interface PhoneShellProps {
  children: ReactNode;
  activeTab?: "home" | "subjects" | "practice" | "parent";
  showTabBar?: boolean;
  noScrollPad?: boolean;
}

export default function PhoneShell({
  children,
  activeTab,
  showTabBar = true,
  noScrollPad = false,
}: PhoneShellProps) {
  return (
    <div className="app-shell">
      <div className="app-container">
        <StatusBar />
        <div className={noScrollPad ? "scroll no-tab" : "scroll"}>{children}</div>
        {showTabBar && activeTab && <TabBar active={activeTab} />}
      </div>
    </div>
  );
}
