import { useEffect, useRef } from "react";
import { renderTextToCanvas } from "../utils/textRenderer";

interface Font {
  value: string;
  label: string;
}

interface PreviewGridProps {
  text: string;
  textColor: string;
  backgroundColor: string;
  fonts: readonly Font[];
  selectedFontIndex: number;
  onFontSelect: (index: number) => void;
}

const CANVAS_SIZE = 128;

function FontCard({
  text,
  textColor,
  backgroundColor,
  font,
  isSelected,
  onClick,
}: {
  text: string;
  textColor: string;
  backgroundColor: string;
  font: Font;
  isSelected: boolean;
  onClick: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    ctx.scale(dpr, dpr);

    const isEmpty = !text.trim();
    const displayText = isEmpty ? "テキストを\n入力してね" : text;

    renderTextToCanvas(ctx, {
      lines: displayText.split("\n"),
      fontFamily: font.value,
      textColor: isEmpty ? "#aaaaaa" : textColor,
      backgroundColor,
      canvasWidth: CANVAS_SIZE,
      canvasHeight: CANVAS_SIZE,
    });
  }, [text, textColor, backgroundColor, font.value]);

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 p-1.5 rounded-lg border-2 bg-white
        transition-all duration-150 hover:border-gray-400
        ${isSelected
          ? 'border-gray-800 shadow-md'
          : 'border-gray-200'}
      `}
    >
      <canvas
        ref={canvasRef}
        className="rounded border border-gray-100"
        style={{ width: 72, height: 72 }}
      />
      <span className={`text-xs transition-colors ${
        isSelected ? 'text-gray-900 font-bold' : 'text-gray-500'
      }`}>
        {font.label}
      </span>
    </button>
  );
}

function PreviewGrid({ text, textColor, backgroundColor, fonts, selectedFontIndex, onFontSelect }: PreviewGridProps) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-2">
        フォント
      </label>
      <div className="grid grid-cols-6 gap-2">
        {fonts.map((font, index) => (
          <FontCard
            key={font.value}
            text={text}
            textColor={textColor}
            backgroundColor={backgroundColor}
            font={font}
            isSelected={selectedFontIndex === index}
            onClick={() => onFontSelect(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default PreviewGrid;
