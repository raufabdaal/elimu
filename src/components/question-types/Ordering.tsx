"use client";

import { Question } from "@/lib/types";
import { ChevronUp, ChevronDown, ArrowUpDown, CheckCircle2, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderingProps {
  question: Extract<Question, { type: "ordering" }>;
  order: string[];
  locked: boolean;
  onReorder: (order: string[]) => void;
}

export default function Ordering({ question, order, locked, onReorder }: OrderingProps) {
  const items = order.map((id) => question.items.find((i) => i.id === id)!).filter(Boolean);

  const move = (idx: number, dir: -1 | 1) => {
    if (locked) return;
    const next = [...order];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= next.length) return;
    [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
    onReorder(next);
  };

  const isCorrectOrder = locked && JSON.stringify(order) === JSON.stringify(question.correctOrder);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5" />
          Arrange in the correct sequence
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {items.map((item, idx) => {
            const isItemCorrectPosition = locked && question.correctOrder[idx] === item.id;

            let cardClass = "choice justify-between items-center py-3.5 px-4 mb-0";
            if (locked && isCorrectOrder) {
              cardClass += " correct";
            } else if (locked && !isItemCorrectPosition) {
              cardClass += " wrong";
            } else if (locked && isItemCorrectPosition) {
              cardClass += " correct";
            }

            return (
              <motion.div
                key={item.id}
                layout
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                className={cardClass}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 ${
                      locked && isItemCorrectPosition ? "bg-emerald-600 text-white" :
                      locked && !isItemCorrectPosition ? "bg-rose-600 text-white" :
                      "bg-slate-900 text-white shadow-sm"
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="font-bold text-[14.5px] text-slate-900 leading-snug break-words pr-2">{item.text}</span>
                </div>

                {!locked ? (
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                        idx === 0
                          ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                          : "bg-white border-slate-300 text-slate-700 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700 active:scale-95 shadow-sm"
                      }`}
                      disabled={idx === 0}
                      onClick={() => move(idx, -1)}
                      aria-label="Move up"
                    >
                      <ChevronUp className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <button
                      type="button"
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${
                        idx === items.length - 1
                          ? "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed"
                          : "bg-white border-slate-300 text-slate-700 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700 active:scale-95 shadow-sm"
                      }`}
                      disabled={idx === items.length - 1}
                      onClick={() => move(idx, 1)}
                      aria-label="Move down"
                    >
                      <ChevronDown className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
                    {isItemCorrectPosition ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-rose-600" />
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
