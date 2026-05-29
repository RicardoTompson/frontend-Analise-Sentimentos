import { AlertCircle, BarChart3, CheckCircle2 } from "lucide-react";

import type { SentimentCopy } from "./types";

export const backendApiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
export const sentimentApiPath = "/api/sentiment";

export const examples = [
  "Hoje me senti acolhido e confiante com o atendimento.",
  "Estou frustrado porque meu pedido atrasou de novo.",
  "Foi uma experiência normal, nada chamou muita atenção.",
];

export const sentimentLabels = ["positivo", "neutro", "negativo"];

export const sentimentCopy: Record<string, SentimentCopy> = {
  positivo: {
    title: "Tendência positiva",
    description: "O texto indica satisfação, alívio ou uma experiência favorável.",
    badge: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    icon: CheckCircle2,
    tone: "from-emerald-500 to-teal-500",
  },
  neutro: {
    title: "Tendência neutra",
    description: "O texto parece equilibrado, informativo ou sem carga emocional forte.",
    badge: "bg-amber-100 text-amber-900 ring-amber-200",
    icon: BarChart3,
    tone: "from-amber-400 to-orange-400",
  },
  negativo: {
    title: "Tendência negativa",
    description: "O texto sugere insatisfação, tristeza, irritação ou uma experiência ruim.",
    badge: "bg-rose-100 text-rose-800 ring-rose-200",
    icon: AlertCircle,
    tone: "from-rose-500 to-red-500",
  },
};
