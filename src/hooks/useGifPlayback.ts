import { useCallback, useEffect, useState } from "react";

/** GIFのコマ送り。GIFプレビューと見え方で同じコマを表示するために共有する */
export function useGifPlayback(frameCount: number, delay: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (!isPlaying || frameCount < 2) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % frameCount);
    }, delay);
    return () => window.clearInterval(timer);
  }, [delay, frameCount, isPlaying]);

  const togglePlaying = useCallback(() => {
    setIsPlaying((playing) => !playing);
  }, []);

  return {
    currentIndex: currentIndex % frameCount,
    isPlaying,
    togglePlaying,
  };
}
