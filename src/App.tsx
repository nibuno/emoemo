import { useState, useCallback } from "react";
import SettingsPanel from "./components/SettingsPanel";
import PreviewGrid from "./components/PreviewGrid";
import { renderTextToCanvas } from "./utils/textRenderer";

export const COLOR_OPTIONS = [
  { value: '#000000', label: '黒' },
  { value: '#FF0000', label: '赤' },
  { value: '#EAB308', label: '黄' },
  { value: '#84CC16', label: '黄緑' },
  { value: '#16A34A', label: '緑' },
  { value: '#06B6D4', label: '水色' },
  { value: '#2563EB', label: '青' },
  { value: '#9333EA', label: '紫' },
  { value: '#EC4899', label: 'ピンク' },
  { value: '#EA580C', label: 'オレンジ' },
] as const;

export const FONTS = [
  { value: "'Noto Sans JP'",       label: "ゴシック" },
  { value: "'M PLUS Rounded 1c'",  label: "丸ゴシック" },
  { value: "'Noto Serif JP'",      label: "明朝体" },
  { value: "'Zen Kaku Gothic New'",label: "モダン" },
  { value: "'Mochiy Pop One'",     label: "ポップ" },
  { value: "'Hachi Maru Pop'",     label: "手書き" },
] as const;

const CANVAS_SIZE = 128;
const BACKGROUND_COLOR = "#ffffff";

function App() {
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState('#000000');
  const [selectedFontIndex, setSelectedFontIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // LLM 連携は後で実装
  const handleAutoSelect = () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500); // placeholder
  };

  const handleDownload = useCallback(() => {
    if (!text.trim()) return;

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
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${text.replace(/\n/g, '_')}.png`;
      link.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [text, textColor, selectedFontIndex]);

  return (
    <div className="min-h-screen bg-white">

      {/* ヘッダー */}
      <header className="border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-8 py-4 flex items-baseline gap-3">
          <h1
            className="text-2xl font-bold text-gray-900 cursor-default hover:animate-wiggle"
            style={{ display: 'inline-block' }}
          >
            emoemo
          </h1>
          <span className="text-sm text-gray-500">かんたん emoji メーカー</span>
        </div>
      </header>

      {/* メインコンテンツ — 縦一直線 */}
      <main className="max-w-2xl mx-auto px-8 py-8 flex flex-col gap-6">

        {/* テキスト・おまかせ・色 */}
        <SettingsPanel
          text={text}
          textColor={textColor}
          isLoading={isLoading}
          colorOptions={COLOR_OPTIONS}
          onTextChange={setText}
          onColorChange={setTextColor}
          onAutoSelect={handleAutoSelect}
        />

        {/* フォントプレビュー */}
        <PreviewGrid
          text={text}
          textColor={textColor}
          backgroundColor={BACKGROUND_COLOR}
          fonts={FONTS}
          selectedFontIndex={selectedFontIndex}
          onFontSelect={setSelectedFontIndex}
        />

        {/* ダウンロード */}
        <div className="flex justify-end">
          <button
            onClick={handleDownload}
            disabled={!text.trim()}
            className={`
              px-6 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors duration-200
              ${text.trim()
                ? 'text-white cursor-pointer active:scale-[0.98]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
            `}
            style={text.trim() ? { backgroundColor: textColor } : undefined}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"/>
            </svg>
            ダウンロード
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
