import { AlertCircle, BarChart3, CheckCircle2 } from "lucide-react";

import type { SentimentCopy } from "./types";

export const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export const examples = [
  "Hoje me senti acolhido e confiante com o atendimento.",
  "Estou frustrado porque meu pedido atrasou de novo.",
  "Foi uma experiencia normal, nada chamou muita atencao.",
];

export const sentimentLabels = ["positivo", "neutro", "negativo"];

export const sentimentCopy: Record<string, SentimentCopy> = {
  positivo: {
    title: "Tendencia positiva",
    description: "O texto indica satisfacao, alivio ou uma experiencia favoravel.",
    badge: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    icon: CheckCircle2,
    tone: "from-emerald-500 to-teal-500",
  },
  neutro: {
    title: "Tendencia neutra",
    description: "O texto parece equilibrado, informativo ou sem carga emocional forte.",
    badge: "bg-amber-100 text-amber-900 ring-amber-200",
    icon: BarChart3,
    tone: "from-amber-400 to-orange-400",
  },
  negativo: {
    title: "Tendencia negativa",
    description: "O texto sugere insatisfacao, tristeza, irritacao ou uma experiencia ruim.",
    badge: "bg-rose-100 text-rose-800 ring-rose-200",
    icon: AlertCircle,
    tone: "from-rose-500 to-red-500",
  },
};
