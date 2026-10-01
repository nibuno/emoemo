import { useEffect, useRef, useState } from "react";
import { renderTextToCanvas } from "../utils/textRenderer";

export interface TempoOption {
  label: string;
  delay: number;
}

interface GifPreviewProps {
  frames: Array<{
    text: string;
    fontFamily: string;
    textColor: string;
  }>;
  tempoOptions: readonly TempoOption[];
  tempoIndex: number;
  onTempoChange: (index: number) => void;
}

const PREVIEW_SIZE = 128;
const PREVIEW_BACKGROUND = "#ffffff";

function GifPreview({
  frames,
  tempoOptions,
  tempoIndex,
  onTempoChange,
}: GifPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(
    () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % frames.length);
    }, tempoOptions[tempoIndex].delay);
    return () => window.clearInterval(timer);
  }, [frames.length, isPlaying, tempoIndex, tempoOptions]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = PREVIEW_SIZE * dpr;
    canvas.height = PREVIEW_SIZE * dpr;
    ctx.scale(dpr, dpr);
    const visibleIndex = currentIndex % frames.length;
    const visibleFrame = frames[visibleIndex];
    renderTextToCanvas(ctx, {
      lines: (visibleFrame.text || "未入力").split("\n"),
      fontFamily: visibleFrame.fontFamily,
      textColor: visibleFrame.text.trim() ? visibleFrame.textColor : "#8a8a8a",
      backgroundColor: PREVIEW_BACKGROUND,
      canvasWidth: PREVIEW_SIZE,
      canvasHeight: PREVIEW_SIZE,
    });
  }, [currentIndex, frames]);

  return (
    <div>
      <span className="block text-sm font-bold text-gray-700 mb-2 select-none">
        GIFプレビュー
      </span>
      <div className="flex items-center gap-5">
        <canvas
          ref={canvasRef}
          className="rounded border border-gray-200"
          style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
          aria-label={`${(currentIndex % frames.length) + 1}コマ目のプレビュー`}
        />
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            className="self-start rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-100"
          >
            {isPlaying ? "一時停止" : "再生"}
          </button>
          <div>
            <span className="mb-1.5 block text-xs text-gray-500">テンポ</span>
            <div className="flex gap-1" role="group" aria-label="GIFのテンポ">
              {tempoOptions.map((tempo, index) => (
                <button
                  key={tempo.label}
                  type="button"
                  onClick={() => onTempoChange(index)}
                  aria-pressed={tempoIndex === index}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                    tempoIndex === index
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tempo.label}
                </button>
              ))}
            </div>
          </div>
          <span className="text-xs text-gray-500">{(currentIndex % frames.length) + 1} / {frames.length}</span>
        </div>
      </div>
    </div>
  );
}

export default GifPreview;
