import { sentimentCopy, sentimentLabels } from "./constants";

export function DashboardHeader() {
  return (
    <header className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-700">Análise de sentimentos</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-950 sm:text-4xl">
            Entenda o tom de uma mensagem em poucos segundos.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Escreva o que você sente, envie para o modelo treinado com avaliações da Olist e acompanhe os resultados em
            um painel único.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:min-w-80">
          {sentimentLabels.map((label) => (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3" key={label}>
              <div className={`mb-2 h-1.5 w-10 rounded-full bg-linear-to-r ${sentimentCopy[label].tone}`} />
              <p className="text-xs font-semibold capitalize text-slate-700">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
