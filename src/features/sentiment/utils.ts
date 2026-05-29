export function normalizeSentiment(value?: string) {
  const normalized = value
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (normalized === "positive" || normalized === "pos") {
    return "positivo";
  }

  if (normalized === "neutral" || normalized === "neu") {
    return "neutro";
  }

  if (normalized === "negative" || normalized === "neg") {
    return "negativo";
  }

  return normalized ?? "";
}

export function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
