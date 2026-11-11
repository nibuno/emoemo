import { renderTextToCanvas } from "./textRenderer";
import { renderAnimatedGif } from "./gifRenderer";
import type { SavedEmoji } from "../types/emojiRain";

interface EmojiImageOptions {
  text: string;
  fontFamily: string;
  textColor: string;
  size: number;
}

/** 背景透過で絵文字を描き、data URL で返す */
export async function renderEmojiDataUrl({
  text,
  fontFamily,
  textColor,
  size,
}: EmojiImageOptions): Promise<string> {
  await document.fonts.load(`700 ${size}px ${fontFamily}`, text);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvasを初期化できませんでした");

  renderTextToCanvas(ctx, {
    lines: text.split("\n"),
    fontFamily,
    textColor,
    backgroundColor: "rgba(0, 0, 0, 0)",
    canvasWidth: size,
    canvasHeight: size,
  });
  return canvas.toDataURL("image/png");
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("data URLに変換できませんでした"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function renderSavedEmoji(emoji: SavedEmoji, size: number): Promise<string> {
  if (emoji.kind === "image") {
    return renderEmojiDataUrl({ ...emoji.frame, size });
  }
  const blob = await renderAnimatedGif({
    frames: emoji.frames,
    frameDelay: emoji.frameDelay,
    size,
  });
  return blobToDataUrl(blob);
}
