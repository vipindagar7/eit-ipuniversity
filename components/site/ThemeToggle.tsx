"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, MonitorSmartphone } from "lucide-react";

type Mode = "system" | "light" | "dark";

function applyTheme(mode: Mode) {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = mode === "dark" || (mode === "system" && systemDark);
  document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("system");

  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Mode | null) || "system";
    setMode(stored);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if ((localStorage.getItem("theme") as Mode | null || "system") === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  function cycle() {
    const order: Mode[] = ["system", "light", "dark"];
    const next = order[(order.indexOf(mode) + 1) % order.length];
    setMode(next);
    if (next === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", next);
    applyTheme(next);
  }

  const icon =
    mode === "system" ? <MonitorSmartphone size={17} /> : mode === "dark" ? <Moon size={17} /> : <Sun size={17} />;

  const label =
    mode === "system" ? "Theme: matching your system" : mode === "dark" ? "Theme: dark" : "Theme: light";

  return (
    <button
      onClick={cycle}
      aria-label={`${label} — click to change`}
      title={label}
      className={
        className ||
        "flex h-9 w-9 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
      }
    >
      {icon}
    </button>
  );
}
