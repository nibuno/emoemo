import { useState, useCallback, useEffect, useRef } from "react";
import "./App.css";
import SettingsPanel from "./components/SettingsPanel";
import PreviewGrid from "./components/PreviewGrid";
import GifFrames from "./components/GifFrames";
import GifPreview, { type TempoOption } from "./components/GifPreview";
import ModeSwitcher, { type OutputMode } from "./components/ModeSwitcher";
import { renderTextToCanvas } from "./utils/textRenderer";
import { renderAnimatedGif } from "./utils/gifRenderer";
import { useAutoStyle } from "./hooks/useAutoStyle";
import { COLOR_OPTIONS, FONTS } from "./constants";
import type { GifFrame } from "./types/gif";

const CANVAS_SIZE = 128;
const BACKGROUND_COLOR = "#ffffff";
const MAX_GIF_FRAMES = 6;
const DEFAULT_GIF_FRAME: GifFrame = {
  text: "",
  textColor: "#000000",
  fontIndex: 0,
};
const TEMPO_OPTIONS: readonly TempoOption[] = [
  { label: "はやい", delay: 450 },
  { label: "ふつう", delay: 800 },
  { label: "ゆっくり", delay: 1200 },
];

const LOGO_ANIMATIONS: [Keyframe[], KeyframeAnimationOptions][] = [
  [
    [{ transform: 'scale(1)' }, { transform: 'scale(0.88)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }],
    { duration: 250, easing: 'ease-in-out' },
  ],
  [
    [{ transform: 'rotate(0)' }, { transform: 'rotate(-8deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(-4deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(0)' }],
    { duration: 400, easing: 'ease-in-out' },
  ],
  [
    [{ transform: 'translateY(0)' }, { transform: 'translateY(-12px)' }, { transform: 'translateY(0)' }, { transform: 'translateY(-5px)' }, { transform: 'translateY(0)' }],
    { duration: 400, easing: 'ease-in-out' },
  ],
  [
    [{ transform: 'rotate(0) scale(1)' }, { transform: 'rotate(360deg) scale(1.05)' }, { transform: 'rotate(360deg) scale(1)' }],
    { duration: 500, easing: 'ease-in-out' },
  ],
];

function safeFileName(text: string, extension: "png" | "gif"): string {
  const base = text
    .trim()
    .replace(/\n/g, "_")
    .replace(/[\\/:*?"<>|]/g, "_")
    .slice(0, 60) || "emoji";
  return `${base}.${extension}`;
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function App() {
  const [mode, setMode] = useState<OutputMode>("image");
  const [frames, setFrames] = useState<GifFrame[]>([{ ...DEFAULT_GIF_FRAME }]);
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);
  const [tempoIndex, setTempoIndex] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const selectedFrame = frames[selectedFrameIndex] ?? frames[0] ?? DEFAULT_GIF_FRAME;
  const { text, textColor, fontIndex: selectedFontIndex } = selectedFrame;
  const {
    suggest,
    status: autoStyleStatus,
    error: autoStyleError,
    reason: autoStyleReason,
    reset: resetAutoStyle,
  } = useAutoStyle();

  useEffect(() => {
    resetAutoStyle();
  }, [selectedFrameIndex, text, resetAutoStyle]);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const animIndexRef = useRef(0);
  const clickCountRef = useRef(0);

  const playEscapeAnimation = useCallback(() => {
    const el = logoRef.current;
    if (!el) return;
    // 画面外にすっ飛んでいって、しれっと戻ってくる
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.max(window.innerWidth, window.innerHeight);
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance;
    el.animate(
      [
        { transform: 'translate(0, 0) rotate(0) scale(1)', opacity: 1 },
        { transform: `translate(${tx}px, ${ty}px) rotate(720deg) scale(0.1)`, opacity: 0, offset: 0.4 },
        { transform: `translate(${tx}px, ${ty}px) rotate(720deg) scale(0)`, opacity: 0, offset: 0.6 },
        { transform: 'translate(0, -20px) rotate(0) scale(1.1)', opacity: 1, offset: 0.85 },
        { transform: 'translate(0, 0) rotate(0) scale(1)', opacity: 1 },
      ],
      { duration: 1500, easing: 'ease-in-out' }
    );
  }, []);

  const handleLogoClick = useCallback(() => {
    // 通算10回ごとに発動
    clickCountRef.current++;
    if (clickCountRef.current >= 10) {
      clickCountRef.current = 0;
      playEscapeAnimation();
      return;
    }

    const [keyframes, options] = LOGO_ANIMATIONS[animIndexRef.current % LOGO_ANIMATIONS.length];
    animIndexRef.current++;
    logoRef.current?.animate(keyframes, options);
  }, [playEscapeAnimation]);

  const handleSurprise = useCallback(async () => {
    if (!text.trim()) return;
    const result = await suggest(text);
    if (!result) return;
    setFrames((current) => current.map((frame, index) => (
      index === selectedFrameIndex
        ? {
            ...frame,
            textColor: COLOR_OPTIONS[result.colorIndex].value,
            fontIndex: result.fontIndex,
          }
        : frame
    )));
  }, [selectedFrameIndex, text, suggest]);

  const handleModeChange = useCallback((nextMode: OutputMode) => {
    setMode(nextMode);
    setSelectedFrameIndex(0);
    if (nextMode === "gif") {
      setFrames((current) => current.length >= 2
        ? current
        : [...current, { ...current[0], text: "" }]
      );
    }
  }, []);

  const handleFrameTextChange = useCallback((index: number, nextText: string) => {
    setFrames((current) => current.map((frame, frameIndex) => (
      frameIndex === index ? { ...frame, text: nextText } : frame
    )));
  }, []);

  const handleTextChange = useCallback((nextText: string) => {
    handleFrameTextChange(selectedFrameIndex, nextText);
  }, [handleFrameTextChange, selectedFrameIndex]);

  const handleColorChange = useCallback((nextColor: string) => {
    setFrames((current) => current.map((frame, index) => (
      index === selectedFrameIndex ? { ...frame, textColor: nextColor } : frame
    )));
  }, [selectedFrameIndex]);

  const handleFontSelect = useCallback((nextFontIndex: number) => {
    setFrames((current) => current.map((frame, index) => (
      index === selectedFrameIndex ? { ...frame, fontIndex: nextFontIndex } : frame
    )));
  }, [selectedFrameIndex]);

  const handleAddFrame = useCallback(() => {
    if (frames.length >= MAX_GIF_FRAMES) return;
    const previousFrame = frames[frames.length - 1] ?? DEFAULT_GIF_FRAME;
    setFrames([...frames, { ...previousFrame, text: "" }]);
    setSelectedFrameIndex(frames.length);
  }, [frames]);

  const handleDeleteFrame = useCallback((index: number) => {
    if (frames.length <= 2) return;
    const next = frames.filter((_, frameIndex) => frameIndex !== index);
    setFrames(next);
    if (selectedFrameIndex === index) {
      setSelectedFrameIndex(Math.min(index, next.length - 1));
    } else if (selectedFrameIndex > index) {
      setSelectedFrameIndex(selectedFrameIndex - 1);
    }
  }, [frames, selectedFrameIndex]);

  const canDownload = mode === "image"
    ? Boolean(text.trim())
    : frames.length >= 2 && frames.every((frame) => Boolean(frame.text.trim()));

  const handleDownload = useCallback(async () => {
    if (!canDownload || isDownloading) return;
    setIsDownloading(true);

    try {
      if (mode === "gif") {
        const blob = await renderAnimatedGif({
          frames: frames.map((frame) => ({
            text: frame.text,
            fontFamily: FONTS[frame.fontIndex].value,
            textColor: frame.textColor,
          })),
          frameDelay: TEMPO_OPTIONS[tempoIndex].delay,
          size: CANVAS_SIZE,
        });
        downloadBlob(blob, safeFileName(frames[0].text, "gif"));
        return;
      }

      await document.fonts.load(`700 ${CANVAS_SIZE}px ${FONTS[selectedFontIndex].value}`, text);

      const canvas = document.createElement("canvas");
      canvas.width = CANVAS_SIZE;
      canvas.height = CANVAS_SIZE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      renderTextToCanvas(ctx, {
        lines: text.split("\n"),
        fontFamily: FONTS[selectedFontIndex].value,
        textColor,
        backgroundColor: BACKGROUND_COLOR,
        canvasWidth: CANVAS_SIZE,
        canvasHeight: CANVAS_SIZE,
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        downloadBlob(blob, safeFileName(text, "png"));
      }, "image/png");
    } finally {
      setIsDownloading(false);
    }
  }, [canDownload, frames, isDownloading, mode, selectedFontIndex, tempoIndex, text, textColor]);

  return (
    <div className="min-h-screen bg-white">

      {/* ヘッダー */}
      <header className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-8 py-4 flex items-baseline gap-3">
          <h1
            ref={logoRef}
            className="text-2xl font-bold text-gray-900 cursor-pointer select-none hover:animate-wiggle"
            style={{ display: 'inline-block' }}
            onClick={handleLogoClick}
            onMouseDown={(e) => e.preventDefault()}
          >
            emoemo
          </h1>
          <span className="text-sm text-gray-500 select-none">かんたん emoji メーカー</span>
        </div>
      </header>

      {/* メインコンテンツ — 縦一直線 */}
      <main className="max-w-2xl mx-auto px-8 py-8 flex flex-col gap-6">

        <ModeSwitcher mode={mode} onChange={handleModeChange} />

        {mode === "gif" && (
          <GifFrames
            frames={frames}
            selectedIndex={selectedFrameIndex}
            onSelect={setSelectedFrameIndex}
            onTextChange={handleFrameTextChange}
            onAdd={handleAddFrame}
            onDelete={handleDeleteFrame}
          />
        )}

        {/* テキスト・色 */}
        <SettingsPanel
          text={text}
          textColor={textColor}
          colorOptions={COLOR_OPTIONS}
          onTextChange={handleTextChange}
          onColorChange={handleColorChange}
          onSurprise={handleSurprise}
          surpriseLoading={autoStyleStatus === "loading"}
          surpriseError={autoStyleError}
          surpriseReason={autoStyleReason}
          showTextInput={mode === "image"}
        />

        {/* フォントプレビュー */}
        <PreviewGrid
          text={text}
          textColor={textColor}
          backgroundColor={BACKGROUND_COLOR}
          fonts={FONTS}
          selectedFontIndex={selectedFontIndex}
          onFontSelect={handleFontSelect}
        />

        {mode === "gif" && (
          <GifPreview
            frames={frames.map((frame) => ({
              text: frame.text,
              fontFamily: FONTS[frame.fontIndex].value,
              textColor: frame.textColor,
            }))}
            tempoOptions={TEMPO_OPTIONS}
            tempoIndex={tempoIndex}
            onTempoChange={setTempoIndex}
          />
        )}

        {/* ダウンロード */}
        <div className="flex justify-center">
          <button
            onClick={handleDownload}
            disabled={!canDownload || isDownloading}
            className={`
              px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2
              ${canDownload && !isDownloading
                ? 'text-white cursor-pointer active:scale-[0.98]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
            style={canDownload && !isDownloading
              ? { backgroundColor: mode === "gif" ? "#111827" : textColor }
              : undefined}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"/>
            </svg>
            {isDownloading
              ? "作成中..."
              : `${mode === "gif" ? "GIF" : "画像"}をダウンロード`}
          </button>
        </div>

        {/* フッター */}
        <footer className="pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
          Made with ☕ by{" "}
          <a href="https://github.com/nibuno" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">@nibuno</a>
          {" | "}
          <a href="https://github.com/nibuno/emoemo" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900">GitHub</a>
        </footer>
      </main>
    </div>
  );
}

export default App;
