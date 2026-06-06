import { Activity, BarChart3, PieChart, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart as RechartsPieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { sentimentCopy } from "./constants";
import type { HistoryItem, SentimentStat } from "./types";
import { formatPercent, formatTime, normalizeSentiment } from "./utils";

type StatsSectionProps = {
  averageConfidence: number;
  confidenceSeries: HistoryItem[];
  historyCount: number;
  sentimentStats: SentimentStat[];
};

const sentimentChartConfig = {
  positivo: {
    label: "Positivo",
    color: "#10b981",
  },
  neutro: {
    label: "Neutro",
    color: "#f59e0b",
  },
  negativo: {
    label: "Negativo",
    color: "#f43f5e",
  },
} satisfies ChartConfig;

const confidenceChartConfig = {
  confianca: {
    label: "Confiança",
    color: "#06b6d4",
  },
} satisfies ChartConfig;

const chartConfig = {
  ...sentimentChartConfig,
  ...confidenceChartConfig,
} satisfies ChartConfig;

type SentimentChartKey = keyof typeof sentimentChartConfig;

function isSentimentChartKey(value: string): value is SentimentChartKey {
  return value in sentimentChartConfig;
}

export function StatsSection({
  averageConfidence,
  confidenceSeries,
  historyCount,
  sentimentStats,
}: StatsSectionProps) {
  const sentimentChartData = sentimentStats.map(({ label, count, percent }) => {
    const sentiment = label as SentimentChartKey;

    return {
      label,
      sentimento: sentimentChartConfig[sentiment]?.label ?? label,
      total: count,
      percent,
      fill: `var(--color-${label})`,
    };
  });

  const confidenceChartData = confidenceSeries.map((item, index) => {
    const sentiment = normalizeSentiment(item.sentimento);
    const configKey = isSentimentChartKey(sentiment) ? sentiment : "confianca";

    return {
      id: item.id,
      analise: `#${index + 1}`,
      horario: formatTime(item.createdAt),
      sentimento: sentimentCopy[sentiment]?.title ?? item.sentimento,
      confianca: Math.round(Number(item.confianca) * 100),
      fill: `var(--color-${configKey})`,
    };
  });

  const confidenceByClassData = sentimentStats.map(({ label }) => {
    const sentiment = label as SentimentChartKey;
    const items = confidenceSeries.filter((item) => normalizeSentiment(item.sentimento) === label);
    const average = items.length
      ? items.reduce((total, item) => total + Number(item.confianca), 0) / items.length
      : 0;

    return {
      label,
      sentimento: sentimentChartConfig[sentiment]?.label ?? label,
      confiancaMedia: Math.round(average * 100),
      total: items.length,
      fill: `var(--color-${label})`,
    };
  });

  return (
    <section className="mt-5 grid gap-5 lg:grid-cols-2" id="estatisticas">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Distribuição</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Sentimentos por classe</h2>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
            <PieChart className="size-5" aria-hidden="true" />
          </span>
        </div>

<<<<<<< Updated upstream
        <div className="mt-6 space-y-4">
          {sentimentStats.map(({ label, count, percent }) => (
            <div key={label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <span className="font-medium capitalize text-slate-700">{label}</span>
                <span className="font-semibold text-slate-950">
                  {count} {count === 1 ? "analise" : "analises"}
                </span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full bg-linear-to-r ${sentimentCopy[label].tone}`}
                  style={{ width: historyCount ? `${Math.max(5, Math.round(percent * 100))}%` : "0%" }}
                />
=======
        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          {historyCount ? (
            <>
              <ChartContainer config={sentimentChartConfig} className="mx-auto h-55 w-full max-w-80">
                <RechartsPieChart accessibilityLayer>
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                        nameKey="sentimento"
                        formatter={(value, _name, item) => {
                          const percent = item.payload?.percent;

                          return (
                            <div className="flex min-w-32 items-center justify-between gap-4">
                              <span className="text-muted-foreground">{item.payload?.sentimento}</span>
                              <span className="font-mono font-medium text-foreground tabular-nums">
                                {value} ({typeof percent === "number" ? formatPercent(percent) : "0%"})
                              </span>
                            </div>
                          );
                        }}
                      />
                    }
                  />
                  <Pie data={sentimentChartData} dataKey="total" innerRadius={54} nameKey="label" strokeWidth={3}>
                    {sentimentChartData.map((entry) => (
                      <Cell key={entry.label} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="label" />} />
                </RechartsPieChart>
              </ChartContainer>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                {sentimentChartData.map(({ label, total, percent }) => (
                  <div className="rounded-xl bg-white px-2 py-3 ring-1 ring-slate-100" key={label}>
                    <p className="font-semibold capitalize text-slate-700">{label}</p>
                    <p className="mt-1 font-mono text-slate-950">{formatPercent(percent)}</p>
                    <p className="mt-1 text-slate-500">
                      {total} {total === 1 ? "análise" : "análises"}
                    </p>
                  </div>
                ))}
>>>>>>> Stashed changes
              </div>
            </>
          ) : (
            <div className="flex h-55 w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-sm text-slate-500">
              A distribuição aparece após as análises.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Comparativo</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Confiança por análise</h2>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Activity className="size-5" aria-hidden="true" />
          </span>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          {confidenceChartData.length ? (
            <ChartContainer
              config={chartConfig}
              className="h-48 w-full"
              initialDimension={{ width: 420, height: 192 }}
            >
              <BarChart accessibilityLayer data={confidenceChartData} margin={{ top: 20, right: 8, left: -20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="horario" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} width={34} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelKey="sentimento"
                      formatter={(value, _name, item) => (
                        <div className="flex min-w-32 items-center justify-between gap-4">
                          <span className="text-muted-foreground">{item.payload?.sentimento}</span>
                          <span className="font-mono font-medium text-foreground tabular-nums">{value}%</span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="confianca" radius={[8, 8, 2, 2]}>
                  <LabelList dataKey="confianca" position="top" formatter={(value) => `${value ?? 0}%`} />
                  {confidenceChartData.map((entry) => (
                    <Cell key={entry.id} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-48 w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-sm text-slate-500">
              As confianças aparecem após as análises.
            </div>
          )}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-500">Média de confiança</span>
            <span className="font-semibold text-slate-950">
              {historyCount ? formatPercent(averageConfidence) : "0%"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Tendência</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Evolução da confiança</h2>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
            <TrendingUp className="size-5" aria-hidden="true" />
          </span>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          {confidenceChartData.length ? (
            <ChartContainer
              config={confidenceChartConfig}
              className="h-55 w-full"
              initialDimension={{ width: 420, height: 220 }}
            >
              <LineChart accessibilityLayer data={confidenceChartData} margin={{ top: 16, right: 16, left: -20 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="analise" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tickMargin={8} width={34} />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      labelKey="sentimento"
                      formatter={(value, _name, item) => (
                        <div className="flex min-w-36 items-center justify-between gap-4">
                          <span className="text-muted-foreground">{item.payload?.horario}</span>
                          <span className="font-mono font-medium text-foreground tabular-nums">{value}%</span>
                        </div>
                      )}
                    />
                  }
                />
                <Line
                  dataKey="confianca"
                  dot={{ fill: "var(--color-confianca)", strokeWidth: 2 }}
                  stroke="var(--color-confianca)"
                  strokeWidth={3}
                  type="monotone"
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="flex h-55 w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-sm text-slate-500">
              A evolução aparece após as análises.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/80 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">Resumo</p>
            <h2 className="mt-2 text-xl font-semibold text-slate-950">Confiança média por classe</h2>
          </div>
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <BarChart3 className="size-5" aria-hidden="true" />
          </span>
        </div>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4">
          {historyCount ? (
            <ChartContainer
              config={chartConfig}
              className="h-55 w-full"
              initialDimension={{ width: 420, height: 220 }}
            >
              <BarChart accessibilityLayer data={confidenceByClassData} layout="vertical" margin={{ right: 28, left: 12 }}>
                <CartesianGrid horizontal={false} />
                <XAxis dataKey="confiancaMedia" type="number" domain={[0, 100]} hide />
                <YAxis
                  dataKey="sentimento"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  width={72}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      formatter={(value, _name, item) => (
                        <div className="flex min-w-36 items-center justify-between gap-4">
                          <span className="text-muted-foreground">
                            {item.payload?.total} {item.payload?.total === 1 ? "análise" : "análises"}
                          </span>
                          <span className="font-mono font-medium text-foreground tabular-nums">{value}%</span>
                        </div>
                      )}
                    />
                  }
                />
                <Bar dataKey="confiancaMedia" radius={[2, 8, 8, 2]}>
                  <LabelList dataKey="confiancaMedia" position="right" formatter={(value) => `${value ?? 0}%`} />
                  {confidenceByClassData.map((entry) => (
                    <Cell key={entry.label} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex h-55 w-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white text-sm text-slate-500">
              A confiança média por classe aparece após as análises.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
