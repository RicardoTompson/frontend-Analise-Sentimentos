import type { SentimentCopy, SentimentResult } from "./types";
import { formatPercent, normalizeSentiment } from "./utils";
import { sentimentCopy } from "./constants";

type ResultPanelProps = {
  currentCopy: SentimentCopy;
  orderedProbabilities: Array<{
    label: string;
    probability: number;
  }>;
  result: SentimentResult | null;
};

export function ResultPanel({ currentCopy, orderedProbabilities, result }: ResultPanelProps) {
  const CurrentIcon = currentCopy.icon;

  return (
    <section
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80 sm:p-7"
      id="resultado"
    >
      {result ? (
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${currentCopy.badge}`}>
                <CurrentIcon className="size-3.5" aria-hidden="true" />
                {result.sentimento}
              </span>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">{currentCopy.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{currentCopy.description}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-5 py-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Confianca</p>
              <p className="mt-1 text-3xl font-semibold text-slate-950">{formatPercent(result.confianca)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">Texto analisado</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{result.texto}</p>
          </div>

          {orderedProbabilities.length > 0 ? (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-800">Probabilidade por classe</h3>
              {orderedProbabilities.map(({ label, probability }) => {
                const normalizedLabel = normalizeSentiment(label);
                const tone = sentimentCopy[normalizedLabel]?.tone ?? "from-slate-500 to-slate-400";

                return (
                  <div key={label}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                      <span className="font-medium capitalize text-slate-700">{label}</span>
                      <span className="font-semibold text-slate-950">{formatPercent(probability)}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full bg-linear-to-r ${tone}`}
                        style={{ width: `${Math.max(3, Math.round(probability * 100))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-64 flex-col justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-5 py-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">Aguardando texto</p>
          <h2 className="mt-4 text-2xl font-semibold text-slate-950">O resultado aparece aqui</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            Depois da análise, você verá o sentimento previsto, a confiança principal e a distribuição das
            probabilidades retornadas pelo backend.
          </p>
        </div>
      )}
    </section>
  );
}
