"use client";

import { useState } from "react";
import { Minus, Plus, Type } from "lucide-react";
import { cn } from "@/lib/utils";

const FONT_STEPS = ["text-[15px]", "text-base", "text-lg", "text-xl"] as const;

export function ArticleContent({ html }: { html: string }) {
  const [step, setStep] = useState(1); // index into FONT_STEPS, default = text-base
  const [serif, setSerif] = useState(false);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-500 dark:border-white/10 dark:bg-indigo-900/30 dark:text-slate-400">
        <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
          <Type size={13} /> Reading
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            aria-label="Decrease text size"
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-white/10"
          >
            <Minus size={14} />
          </button>
          <span className="w-6 text-center text-xs tabular-nums">A</span>
          <button
            onClick={() => setStep((s) => Math.min(FONT_STEPS.length - 1, s + 1))}
            disabled={step === FONT_STEPS.length - 1}
            aria-label="Increase text size"
            className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-white/10"
          >
            <Plus size={14} />
          </button>
          <span className="mx-1 h-4 w-px bg-slate-200 dark:bg-white/10" aria-hidden />
          <button
            onClick={() => setSerif((v) => !v)}
            className={cn(
              "rounded-md px-2 py-1 text-xs font-medium transition-colors",
              serif ? "bg-indigo-700 text-white" : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10"
            )}
          >
            Serif
          </button>
        </div>
      </div>

      <div
        className={cn("prose-blog prose-blog--lead", FONT_STEPS[step], serif && "font-display")}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
