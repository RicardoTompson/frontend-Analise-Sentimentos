import type { LucideIcon } from "lucide-react";

export type SentimentResult = {
  texto: string;
  sentimento: string;
  confianca: number;
  probabilidades?: Record<string, number>;
};

export type HistoryItem = SentimentResult & {
  id: string;
  createdAt: string;
};

export type SentimentCopy = {
  title: string;
  description: string;
  badge: string;
  icon: LucideIcon;
  tone: string;
};

export type SentimentStat = {
  label: string;
  count: number;
  percent: number;
};

export type ThemeMode = "light" | "dark";
