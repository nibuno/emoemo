import { useEffect, useRef } from "react";
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
  backgroundColor: string | null;
  currentIndex: number;
  isPlaying: boolean;
  onTogglePlaying: () => void;
  tempoOptions: readonly TempoOption[];
  tempoIndex: number;
  onTempoChange: (index: number) => void;
}

const PREVIEW_SIZE = 128;

function GifPreview({
  frames,
  backgroundColor,
  currentIndex,
  isPlaying,
  onTogglePlaying,
  tempoOptions,
  tempoIndex,
  onTempoChange,
}: GifPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = PREVIEW_SIZE * dpr;
    canvas.height = PREVIEW_SIZE * dpr;
    ctx.scale(dpr, dpr);
    const visibleFrame = frames[currentIndex];
    renderTextToCanvas(ctx, {
      lines: (visibleFrame.text || "未入力").split("\n"),
      fontFamily: visibleFrame.fontFamily,
      textColor: visibleFrame.text.trim() ? visibleFrame.textColor : "#8a8a8a",
      backgroundColor,
      canvasWidth: PREVIEW_SIZE,
      canvasHeight: PREVIEW_SIZE,
    });
  }, [backgroundColor, currentIndex, frames]);

  return (
    <div>
      <span className="block text-sm font-bold text-gray-700 mb-2 select-none">
        GIFプレビュー
      </span>
      <div className="flex items-center gap-5">
        <canvas
          ref={canvasRef}
          data-transparent={backgroundColor === null}
          className="rounded border border-gray-200"
          style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
          aria-label={`${currentIndex + 1}コマ目のプレビュー`}
        />
        <div className="flex flex-col gap-4">
          <button
            type="button"
            onClick={onTogglePlaying}
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
          <span className="text-xs text-gray-500">{currentIndex + 1} / {frames.length}</span>
        </div>
      </div>
    </div>
  );
}

export default GifPreview;
