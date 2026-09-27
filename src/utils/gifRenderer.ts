import { GIFEncoder, applyPalette, quantize } from "gifenc";
import { renderTextToCanvas } from "./textRenderer";

interface GifRenderFrame {
  text: string;
  fontFamily: string;
  textColor: string;
}

interface GifRenderOptions {
  frames: GifRenderFrame[];
  frameDelay: number;
  size: number;
}

const PALETTE_FORMAT = "rgba4444";

export async function renderAnimatedGif({
  frames,
  frameDelay,
  size,
}: GifRenderOptions): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvasを初期化できませんでした");

  await Promise.all(frames.map((frame) => (
    document.fonts.load(`700 ${size}px ${frame.fontFamily}`, frame.text)
  )));

  const gif = GIFEncoder();

  frames.forEach((frame) => {
    ctx.clearRect(0, 0, size, size);
    renderTextToCanvas(ctx, {
      lines: frame.text.split("\n"),
      fontFamily: frame.fontFamily,
      textColor: frame.textColor,
      backgroundColor: "rgba(0, 0, 0, 0)",
      canvasWidth: size,
      canvasHeight: size,
    });

    const { data } = ctx.getImageData(0, 0, size, size);
    const palette = quantize(data, 256, {
      format: PALETTE_FORMAT,
      oneBitAlpha: true,
    });
    const index = applyPalette(data, palette, PALETTE_FORMAT);
    const transparentIndex = palette.findIndex((color) => color[3] === 0);

    gif.writeFrame(index, size, size, {
      palette,
      delay: frameDelay,
      repeat: 0,
      dispose: 2,
      transparent: transparentIndex >= 0,
      transparentIndex: Math.max(0, transparentIndex),
    });
  });

  gif.finish();
  const encoded = gif.bytes();
  const bytes = new Uint8Array(encoded.byteLength);
  bytes.set(encoded);
  return new Blob([bytes.buffer], { type: "image/gif" });
}
