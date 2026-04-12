import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAutoStyle, type AutoStyleResult } from "../utils/autoStyle";

type Status = "idle" | "loading" | "error";

export function useAutoStyle() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setReason(null);
  }, []);

  const suggest = useCallback(async (text: string): Promise<AutoStyleResult | null> => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus("loading");
    setError(null);
    setReason(null);

    try {
      const result = await fetchAutoStyle(text, controller.signal);
      setStatus("idle");
      setReason(result.reason ?? null);
      return result;
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return null;
      }
      setStatus("error");
      setError("うまく選べませんでした。もう一度試してね");
      console.error(err);
      return null;
    }
  }, []);

  return { suggest, reset, status, error, reason };
}
