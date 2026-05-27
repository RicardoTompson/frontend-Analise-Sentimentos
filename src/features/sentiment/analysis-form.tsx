import type { FormEvent } from "react";
import { AlertCircle, Loader2, RotateCcw, SendHorizontal, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { apiBase, examples } from "./constants";

type AnalysisFormProps = {
  characterCount: number;
  error: string | null;
  loading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  reset: () => void;
  setText: (text: string) => void;
  text: string;
};

export function AnalysisForm({
  characterCount,
  error,
  loading,
  onSubmit,
  reset,
  setText,
  text,
}: AnalysisFormProps) {
  return (
    <form
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80 sm:p-7"
      id="analise"
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Como voce esta se sentindo?</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            O backend padrao esperado e <span className="font-semibold text-slate-900">{apiBase}</span>.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-800 ring-1 ring-cyan-100">
          <SendHorizontal className="size-3.5" aria-hidden="true" />
          /predict
        </span>
      </div>

      <label className="mt-6 block text-sm font-semibold text-slate-800" htmlFor="sentiment-text">
        Texto para analise
      </label>
      <textarea
        className="mt-2 min-h-44 w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-base leading-7 text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
        id="sentiment-text"
        onChange={(event) => setText(event.target.value)}
        placeholder="Ex.: Estou muito satisfeito com o atendimento, mas ainda preocupado com o prazo de entrega..."
        value={text}
      />

      <div className="mt-3 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span>{characterCount} caracteres</span>
        <div className="flex flex-wrap gap-2">
          {examples.map((example) => (
            <Button
              className="h-7 rounded-full px-3 text-xs text-slate-600 hover:border-cyan-300 hover:text-cyan-800"
              key={example}
              onClick={() => setText(example)}
              type="button"
              variant="outline"
            >
              Exemplo
            </Button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="mt-5 flex gap-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-800">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          className="min-h-12 flex-1 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"
          disabled={loading}
          size="lg"
          type="submit"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles className="size-4" aria-hidden="true" />
              Analisar sentimento
            </>
          )}
        </Button>
        <Button
          className="min-h-12 rounded-2xl border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50"
          onClick={reset}
          size="lg"
          type="button"
          variant="outline"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
          Limpar
        </Button>
      </div>
    </form>
  );
}
