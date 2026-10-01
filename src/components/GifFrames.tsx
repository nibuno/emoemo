import { useEffect, useRef } from "react";
import type { GifFrame } from "../types/gif";

interface GifFramesProps {
  frames: GifFrame[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onTextChange: (index: number, text: string) => void;
  onAdd: () => void;
  onDelete: (index: number) => void;
}

const MAX_FRAMES = 6;

function FrameTextArea({
  value,
  index,
  isSelected,
  onSelect,
  onChange,
}: {
  value: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (text: string) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
    textarea.style.overflowY = textarea.scrollHeight > 96 ? "auto" : "hidden";
  }, [value]);

  return (
    <div
      className={`min-w-0 flex flex-1 items-start gap-2 rounded-lg border px-3 py-2 transition-colors ${
        isSelected
          ? "border-gray-900 bg-gray-50"
          : "border-gray-200 hover:border-gray-400"
      }`}
    >
      <span className="pt-0.5 text-xs font-bold text-gray-400">{index + 1}</span>
      <textarea
        ref={textareaRef}
        value={value}
        rows={1}
        onFocus={onSelect}
        onClick={onSelect}
        onChange={(event) => onChange(event.target.value)}
        placeholder="テキストを入力"
        aria-label={`${index + 1}コマ目のテキスト`}
        className="min-h-5 min-w-0 flex-1 resize-none bg-transparent text-sm leading-5 text-gray-900 outline-none placeholder:text-gray-400"
      />
    </div>
  );
}

function GifFrames({
  frames,
  selectedIndex,
  onSelect,
  onTextChange,
  onAdd,
  onDelete,
}: GifFramesProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-gray-700 select-none">コマ</span>
          <span className="text-xs text-gray-500">{frames.length} / {MAX_FRAMES}</span>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={frames.length >= MAX_FRAMES}
          className="rounded px-2 py-1 text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ＋ 追加
        </button>
      </div>
      <ol className="flex flex-col gap-2">
        {frames.map((frame, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <FrameTextArea
              value={frame.text}
              index={index}
              isSelected={selectedIndex === index}
              onSelect={() => onSelect(index)}
              onChange={(text) => onTextChange(index, text)}
            />
            <button
              type="button"
              onClick={() => onDelete(index)}
              tabIndex={-1}
              disabled={frames.length <= 2}
              className="rounded p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-25"
              aria-label={`${index + 1}コマ目を削除`}
            >
              ×
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default GifFrames;
