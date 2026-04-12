export type AutoStyleResult = {
  colorIndex: number;
  fontIndex: number;
  reason?: string;
};

const TIMEOUT_MS = 15_000;

function isIntInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

export async function fetchAutoStyle(
  text: string,
  signal?: AbortSignal,
): Promise<AutoStyleResult> {
  const endpoint = import.meta.env.VITE_AUTO_STYLE_ENDPOINT;
  if (!endpoint) {
    throw new Error("VITE_AUTO_STYLE_ENDPOINT is not set");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const onExternalAbort = () => controller.abort();
  signal?.addEventListener("abort", onExternalAbort);

  try {
    const res = await fetch(`${endpoint.replace(/\/$/, "")}/suggest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`AutoStyle endpoint returned ${res.status}`);
    }

    const data: unknown = await res.json();
    if (!data || typeof data !== "object") {
      throw new Error("Invalid response shape");
    }

    const obj = data as Record<string, unknown>;
    if (!isIntInRange(obj.colorIndex, 0, 9) || !isIntInRange(obj.fontIndex, 0, 5)) {
      throw new Error("Invalid index in response");
    }

    const result: AutoStyleResult = {
      colorIndex: obj.colorIndex,
      fontIndex: obj.fontIndex,
    };
    if (typeof obj.reason === "string") {
      result.reason = obj.reason;
    }
    return result;
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", onExternalAbort);
  }
}
