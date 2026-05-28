import type { LucideIcon } from "lucide-react";
import { HeartPulse, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

import { apiBase } from "./constants";
import type { ThemeMode } from "./types";
import { formatPercent } from "./utils";

type SidebarProps = {
  averageConfidence: number;
  historyCount: number;
  isDark: boolean;
  latestSentiment: string;
  navItems: Array<{
    href: string;
    icon: LucideIcon;
    label: string;
  }>;
  setTheme: (updater: (currentTheme: ThemeMode) => ThemeMode) => void;
};

export function SentimentSidebar({
  averageConfidence,
  historyCount,
  isDark,
  latestSentiment,
  navItems,
  setTheme,
}: SidebarProps) {
  return (
    <aside className="border-b border-slate-200 bg-slate-950 px-5 py-5 text-white lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r lg:border-white/10 lg:px-4">
      <div className="flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-white/4 p-4 lg:rounded-[1.75rem]">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-cyan-300 text-slate-950">
              <HeartPulse className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">Sentimental PLN</p>
              <p className="text-xs text-slate-400">Olist reviews</p>
            </div>
          </div>
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.9)]" />
        </div>

        <nav className="grid gap-2">
          {navItems.map((item) => (
            <a
              className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
              href={item.href}
              key={item.href}
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </a>
          ))}
        </nav>

        <Button
          aria-label={`Ativar modo ${isDark ? "claro" : "escuro"}`}
          className="h-11 justify-start gap-3 rounded-2xl border-white/10 bg-white/[0.07] px-3 text-slate-200 hover:bg-white/10 hover:text-white"
          onClick={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
          type="button"
          variant="outline"
        >
          {isDark ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
          {isDark ? "Modo claro" : "Modo escuro"}
        </Button>

        <div className="grid gap-3">
          <SidebarMetric label="Analises" value={historyCount} />
          <SidebarMetric label="Media" value={historyCount ? formatPercent(averageConfidence) : "0%"} />
          <SidebarMetric label="Ultimo tom" value={latestSentiment} valueClassName="text-lg capitalize" />
        </div>

        <div className="mt-auto rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">API</p>
          <p className="mt-2 break-all text-sm text-slate-200">{apiBase}</p>
        </div>
      </div>
    </aside>
  );
}

function SidebarMetric({
  label,
  value,
  valueClassName = "text-3xl",
}: {
  label: string;
  value: number | string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className={`mt-2 font-semibold ${valueClassName}`}>{value}</p>
    </div>
  );
}
