"use client";

import { Question } from "@/lib/types";
import { ChevronUp, ChevronDown } from "lucide-react";

interface OrderingProps {
  question: Extract<Question, { type: "ordering" }>;
  order: string[];
  locked: boolean;
  onReorder: (order: string[]) => void;
}

export default function Ordering({ question, order, locked, onReorder }: OrderingProps) {
  const items = order.map((id) => question.items.find((i) => i.id === id)!).filter(Boolean);

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...order];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    onReorder(next);
  };

  return (
    <div className="stack-sm">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="choice flex items-center justify-between gap-2"
          style={{ marginBottom: 8, cursor: locked ? "default" : "grab" }}
        >
          <span className="font-medium">{item.text}</span>
          {!locked && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="icon-btn"
                style={{ width: 32, height: 32 }}
                disabled={idx === 0}
                onClick={() => move(idx, -1)}
                aria-label="Move up"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="icon-btn"
                style={{ width: 32, height: 32 }}
                disabled={idx === items.length - 1}
                onClick={() => move(idx, 1)}
                aria-label="Move down"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
