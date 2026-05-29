import { normalizeSentimentResponse } from "@/features/sentiment/api";

const defaultBackendApiBase = "http://127.0.0.1:8000";
const predictPath = process.env.API_PREDICT_PATH ?? "/predict";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { texto?: unknown; text?: unknown } | null;
  const text = typeof body?.text === "string" ? body.text.trim() : typeof body?.texto === "string" ? body.texto.trim() : "";

  if (!text) {
    return Response.json({ message: "Informe um texto para analise." }, { status: 400 });
  }

  const backendUrl = buildBackendUrl();

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const payload = await readJson(response);

    if (!response.ok) {
      return Response.json(
        {
          message: readErrorMessage(payload) ?? `Backend respondeu com status ${response.status}.`,
          details: payload,
        },
        { status: response.status },
      );
    }

    return Response.json(normalizeSentimentResponse(payload, text));
  } catch (error) {
    return Response.json(
      {
        message: `Nao foi possivel conectar ao backend de analise de sentimentos em ${backendUrl}. Verifique se a API esta rodando ou ajuste API_URL/API_PREDICT_PATH.`,
        details: error instanceof Error ? error.message : undefined,
      },
      { status: 502 },
    );
  }
}

function buildBackendUrl() {
  const baseUrl = (process.env.API_URL ?? defaultBackendApiBase).replace(/\/$/, "");
  const path = predictPath.startsWith("/") ? predictPath : `/${predictPath}`;

  return `${baseUrl}${path}`;
}

async function readJson(response: Response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function readErrorMessage(payload: unknown) {
  if (typeof payload === "string" && payload.trim()) {
    return payload.trim();
  }

  if (typeof payload === "object" && payload !== null) {
    const record = payload as Record<string, unknown>;
    const message = record.message ?? record.error ?? record.detail;

    if (typeof message === "string" && message.trim()) {
      return message.trim();
    }
  }

  return null;
}
