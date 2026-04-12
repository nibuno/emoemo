import { useCallback, useEffect, useRef, useState } from "react";
import { fetchAutoStyle, type AutoStyleResult } from "../utils/autoStyle";

type Status = "idle" | "loading" | "error";

export function useAutoStyle() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  const suggest = useCallback(async (text: string): Promise<AutoStyleResult | null> => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus("loading");
    setError(null);

    try {
      const result = await fetchAutoStyle(text, controller.signal);
      if (controller.signal.aborted) return null;
      setStatus("idle");
      return result;
    } catch (err) {
      if (controller.signal.aborted) return null;
      setStatus("error");
      setError("うまく選べませんでした。もう一度試してね");
      console.error(err);
      return null;
    }
  }, []);

  return { suggest, status, error };
}
