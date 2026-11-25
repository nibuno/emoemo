import { useEffect, useState } from "react";
import { BACKGROUND_COLORS, CANVAS_SIZE, FONTS } from "../constants";
import type { ThemePreviewImage, ThemePreviewProps } from "../types/themePreview";
import { renderEmojiDataUrl } from "../utils/emojiImage";

const THEMES = [
  { label: "ライト", backgroundColor: BACKGROUND_COLORS.white, color: "#1D1C1D" },
  { label: "ダーク", backgroundColor: BACKGROUND_COLORS.dark, color: "#D1D2D3" },
] as const;

function ThemePreview({ frame, backgroundColor, frameNumber }: ThemePreviewProps) {
  const [image, setImage] = useState<ThemePreviewImage | null>(null);
  const src = image?.frame === frame && image.backgroundColor === backgroundColor
    ? image.src
    : null;

  useEffect(() => {
    if (!frame.text.trim()) return;

    let current = true;
    renderEmojiDataUrl({
      text: frame.text,
      fontFamily: FONTS[frame.fontIndex].value,
      textColor: frame.textColor,
      backgroundColor,
      size: CANVAS_SIZE,
    }).then((src) => {
      if (current) setImage({ frame, backgroundColor, src });
    }).catch(() => {
      if (current) setImage(null);
    });
    return () => { current = false; };
  }, [frame, backgroundColor]);

  return (
    <section aria-labelledby="theme-preview-title">
      <div className="mb-2 flex items-baseline gap-2">
        <h2 id="theme-preview-title" className="text-sm font-bold text-gray-700">見え方</h2>
        {frameNumber !== undefined && (
          <span className="text-xs text-gray-500">{frameNumber}コマ目</span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {THEMES.map(({ label, backgroundColor, color }) => (
          <figure
            key={label}
            className="min-w-0 rounded-lg border border-gray-200 p-3"
            style={{ backgroundColor, color }}
          >
            <figcaption className="mb-2 text-xs font-semibold">{label}</figcaption>
            <p className="flex min-h-[22px] items-center gap-1 text-sm">
              ありがとう
              {src && <img src={src} alt={frame.text} width={22} height={22} className="shrink-0" />}
            </p>
            <div className="mt-1 flex h-8 items-center">
              {src && <img src={src} alt="" width={32} height={32} />}
              {!frame.text.trim() && <span className="text-xs opacity-70">未入力</span>}
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default ThemePreview;
