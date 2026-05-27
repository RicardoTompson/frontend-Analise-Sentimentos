import { Clock3, History } from "lucide-react";

import { sentimentCopy } from "./constants";
import type { HistoryItem, SentimentCopy } from "./types";
import { formatPercent, formatTime, normalizeSentiment } from "./utils";

type HistorySectionProps = {
  currentCopy: SentimentCopy;
  history: HistoryItem[];
};

export function HistorySection({ currentCopy, history }: HistorySectionProps) {
  return (
    <section
      className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80 sm:p-6"
      id="historico"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Historico</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">Ultimos resultados</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          <History className="size-3.5" aria-hidden="true" />
          {history.length}/6
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {history.length ? (
          history.map((item) => {
            const sentiment = normalizeSentiment(item.sentimento);
            const copy = sentimentCopy[sentiment] ?? currentCopy;
            const ItemIcon = copy.icon;

            return (
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4" key={item.id}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${copy.badge}`}>
                      <ItemIcon className="size-3.5" aria-hidden="true" />
                      {item.sentimento}
                    </span>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-700">{item.texto}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2 text-sm text-slate-500">
                    <Clock3 className="size-4" aria-hidden="true" />
                    <span>{formatTime(item.createdAt)}</span>
                    <span className="font-semibold text-slate-950">{formatPercent(item.confianca)}</span>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
            <p className="text-sm font-medium text-slate-500">
              Analise alguns textos para preencher o historico e alimentar os graficos.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
