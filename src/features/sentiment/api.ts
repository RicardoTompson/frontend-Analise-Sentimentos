import type { SentimentResult } from "./types";
import { normalizeSentiment } from "./utils";

const sentimentKeys = ["sentimento", "sentiment", "prediction", "predicao", "classe", "label", "resultado"];
const confidenceKeys = ["confianca", "confidence", "score", "probabilidade", "probability"];
const probabilityKeys = ["probabilidades", "probabilities", "probas", "proba", "predict_proba"];
const textKeys = ["texto", "text", "mensagem", "message", "entrada", "input"];

type UnknownRecord = Record<string, unknown>;

export function normalizeSentimentResponse(payload: unknown, fallbackText: string): SentimentResult {
  if (typeof payload === "string") {
    return {
      texto: fallbackText,
      sentimento: normalizeSentiment(payload) || payload,
      confianca: 0,
    };
  }

  if (!isRecord(payload)) {
    throw new Error("A resposta do backend não está em um formato JSON válido.");
  }

  const probabilidades = readProbabilities(payload);
  const sentimento = readString(payload, sentimentKeys) ?? inferSentiment(probabilidades);

  if (!sentimento) {
    throw new Error("A resposta do backend não trouxe o campo de sentimento previsto.");
  }

  return {
    texto: readString(payload, textKeys) ?? fallbackText,
    sentimento: normalizeSentiment(sentimento),
    confianca: readConfidence(payload, sentimento, probabilidades),
    probabilidades,
  };
}

function readString(payload: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = payload[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

function readConfidence(payload: UnknownRecord, sentiment: string, probabilities?: Record<string, number>) {
  for (const key of confidenceKeys) {
    const value = normalizeNumber(payload[key]);

    if (value !== null) {
      return value;
    }
  }

  const normalizedSentiment = normalizeSentiment(sentiment);
  const probabilityForSentiment = Object.entries(probabilities ?? {}).find(
    ([label]) => normalizeSentiment(label) === normalizedSentiment,
  )?.[1];

  return probabilityForSentiment ?? Math.max(0, ...Object.values(probabilities ?? {}));
}

function readProbabilities(payload: UnknownRecord) {
  for (const key of probabilityKeys) {
    const value = payload[key];

    if (isRecord(value)) {
      return Object.entries(value).reduce<Record<string, number>>((probabilities, [label, rawProbability]) => {
        const probability = normalizeNumber(rawProbability);

        if (probability !== null) {
          probabilities[normalizeSentiment(label)] = probability;
        }

        return probabilities;
      }, {});
    }

    if (Array.isArray(value)) {
      return value.reduce<Record<string, number>>((probabilities, item) => {
        if (!isRecord(item)) {
          return probabilities;
        }

        const label = readString(item, ["label", "classe", "sentimento", "sentiment"]);
        const probability = normalizeNumber(
          item.probabilidade ?? item.probability ?? item.confianca ?? item.confidence ?? item.score,
        );

        if (label && probability !== null) {
          probabilities[normalizeSentiment(label)] = probability;
        }

        return probabilities;
      }, {});
    }
  }

  return undefined;
}

function inferSentiment(probabilities?: Record<string, number>) {
  return Object.entries(probabilities ?? {}).sort(([, first], [, second]) => second - first)[0]?.[0];
}

function normalizeNumber(value: unknown) {
  const numberValue = typeof value === "number" ? value : typeof value === "string" ? Number(value) : Number.NaN;

  if (!Number.isFinite(numberValue)) {
    return null;
  }

  const normalizedValue = numberValue > 1 ? numberValue / 100 : numberValue;
  return Math.min(1, Math.max(0, normalizedValue));
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
