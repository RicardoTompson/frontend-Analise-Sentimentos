import { Activity, PieChart } from "lucide-react";

import { sentimentCopy } from "./constants";
import type { HistoryItem, SentimentStat } from "./types";
import { formatPercent, formatTime, normalizeSentiment } from "./utils";

type StatsSectionProps = {
  averageConfidence: number;
  confidenceSeries: HistoryItem[];
  historyCount: number;
  sentimentStats: SentimentStat[];
};

export function StatsSection({
  averageConfidence,
  confidenceSeries,
  historyCount,
  sentimentStats,
}: StatsSectionProps) {
  return (
    <section className="mt-5 grid gap-5 lg:grid-cols-2" id="estatisticas">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Gráfico 1</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Distribuição</h2>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
            <PieChart className="size-5" aria-hidden="true" />
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {sentimentStats.map(({ label, count, percent }) => (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium capitalize text-slate-700">{label}</span>
                <span className="font-semibold text-slate-950">
                  {count} {count === 1 ? "análise" : "análises"}
                </span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full bg-linear-to-r ${sentimentCopy[label].tone}`}
                  style={{ width: historyCount ? `${Math.max(5, Math.round(percent * 100))}%` : "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Gráfico 2</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Confiança</h2>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Activity className="size-5" aria-hidden="true" />
          </span>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          <div className="flex items-end justify-between gap-2">
            {confidenceSeries.length ? (
              confidenceSeries.map((item) => {
                const height = Math.max(14, Math.round(Number(item.confianca) * 112));
                const sentiment = normalizeSentiment(item.sentimento);
                const tone = sentimentCopy[sentiment]?.tone ?? "from-slate-500 to-slate-400";

                return (
                  <div className="flex flex-1 flex-col items-center gap-2" key={item.id}>
                    <div className="flex h-32 w-full items-end justify-center rounded-xl bg-white px-2 py-2 ring-1 ring-slate-100">
                      <div
                        className={`w-full rounded-lg bg-linear-to-t ${tone}`}
                        style={{ height }}
                        title={`${item.sentimento}: ${formatPercent(item.confianca)}`}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">{formatTime(item.createdAt)}</span>
                  </div>
                );
              })
            ) : (
              <div className="flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-sm text-slate-500">
                As confianças aparecem após as análises.
              </div>
            )}
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">Média de confiança</span>
            <span className="font-semibold text-slate-950">
              {historyCount ? formatPercent(averageConfidence) : "0%"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
