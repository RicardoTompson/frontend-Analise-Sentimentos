"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { BarChart3, History, Sparkles } from "lucide-react";

import { AnalysisForm } from "@/features/sentiment/analysis-form";
import { sentimentApiPath, sentimentCopy, sentimentLabels } from "@/features/sentiment/constants";
import { DashboardHeader } from "@/features/sentiment/dashboard-header";
import { HistorySection } from "@/features/sentiment/history-section";
import { ResultPanel } from "@/features/sentiment/result-panel";
import { SentimentSidebar } from "@/features/sentiment/sidebar";
import { StatsSection } from "@/features/sentiment/stats-section";
import type { HistoryItem, SentimentResult, ThemeMode } from "@/features/sentiment/types";
import { normalizeSentiment } from "@/features/sentiment/utils";

export default function Home() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [theme, setTheme] = useState<ThemeMode>("light");

  const currentSentiment = normalizeSentiment(result?.sentimento);
  const currentCopy = sentimentCopy[currentSentiment] ?? {
    title: "Análise concluída",
    description: "O modelo retornou a classificação abaixo para o texto enviado.",
    badge: "bg-slate-100 text-slate-800 ring-slate-200",
    icon: Sparkles,
    tone: "from-sky-500 to-indigo-500",
  };

  const orderedProbabilities = useMemo(() => {
    if (!result?.probabilidades) {
      return [];
    }

    return Object.entries(result.probabilidades)
      .map(([label, probability]) => ({
        label,
        probability: Number(probability),
      }))
      .sort((a, b) => b.probability - a.probability);
  }, [result]);

  const sentimentStats = useMemo(() => {
    const total = Math.max(history.length, 1);

    return sentimentLabels.map((label) => {
      const count = history.filter((item) => normalizeSentiment(item.sentimento) === label).length;

      return {
        label,
        count,
        percent: count / total,
      };
    });
  }, [history]);

  const confidenceSeries = useMemo(() => history.slice(0, 6).reverse(), [history]);
  const averageConfidence = history.length
    ? history.reduce((total, item) => total + Number(item.confianca), 0) / history.length
    : 0;
  const isDark = theme === "dark";

  const navItems = [
    { href: "#analise", label: "Analisar", icon: Sparkles },
    { href: "#resultado", label: "Resultado", icon: currentCopy.icon },
    { href: "#estatisticas", label: "Estatísticas", icon: BarChart3 },
    { href: "#historico", label: "Histórico", icon: History },
  ];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    const texto = text.trim();

    if (!texto) {
      setError("Digite como você está se sentindo para iniciar a análise.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(sentimentApiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: texto }),
      });
      const data = (await response.json()) as SentimentResult & { message?: string };

      if (!response.ok) {
        throw new Error(
          data.message ??
            (response.status >= 500
              ? "A API retornou um erro interno. Verifique se o backend está rodando e se o método predict_proba está correto."
              : `Não foi possível analisar o texto. Código ${response.status}.`),
        );
      }

      setResult(data);
      setHistory((currentHistory) =>
        [
          {
            ...data,
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            createdAt: new Date().toISOString(),
          },
          ...currentHistory,
        ].slice(0, 6),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível conectar ao backend de análise.",
      );
    } finally {
      setLoading(false);
    }
  }

  function resetAnalysis() {
    setText("");
    setResult(null);
    setError(null);
  }

  return (
    <main
      className={`min-h-screen text-slate-950 transition-colors ${
        isDark ? "dark theme-dark bg-slate-950" : "bg-[#f7f3ee]"
      }`}
    >
      <div className="mx-auto flex w-full max-w-375 flex-col lg:flex-row">
        <SentimentSidebar
          averageConfidence={averageConfidence}
          historyCount={history.length}
          isDark={isDark}
          latestSentiment={history[0]?.sentimento ?? "Aguardando"}
          navItems={navItems}
          setTheme={setTheme}
        />

        <section className="flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <DashboardHeader />

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
            <AnalysisForm
              characterCount={text.trim().length}
              error={error}
              loading={loading}
              onSubmit={handleSubmit}
              reset={resetAnalysis}
              setText={setText}
              text={text}
            />
            <ResultPanel
              currentCopy={currentCopy}
              orderedProbabilities={orderedProbabilities}
              result={result}
            />
          </div>

          <StatsSection
            averageConfidence={averageConfidence}
            confidenceSeries={confidenceSeries}
            historyCount={history.length}
            sentimentStats={sentimentStats}
          />
          <HistorySection currentCopy={currentCopy} history={history} />
        </section>
      </div>
    </main>
  );
}
