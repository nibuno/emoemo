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
  backgroundColor: string | null;
  size: number;
}

export async function renderAnimatedGif({
  frames,
  frameDelay,
  backgroundColor,
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
  const format = backgroundColor === null ? "rgba4444" : "rgb565";

  frames.forEach((frame) => {
    renderTextToCanvas(ctx, {
      lines: frame.text.split("\n"),
      fontFamily: frame.fontFamily,
      textColor: frame.textColor,
      backgroundColor,
      canvasWidth: size,
      canvasHeight: size,
    });

    const { data } = ctx.getImageData(0, 0, size, size);
    const palette = quantize(data, 256, { format, oneBitAlpha: true });
    const index = applyPalette(data, palette, format);
    if (backgroundColor !== null) {
      // 左上は余白なので、減色後もそのパレット色に元の背景色を使う
      palette[index[0]] = [data[0], data[1], data[2]];
    }
    const transparentIndex = palette.findIndex((color) => color[3] === 0);

    gif.writeFrame(index, size, size, {
      palette,
      delay: frameDelay,
      repeat: 0,
      dispose: 2,
      ...(transparentIndex >= 0 && { transparent: true, transparentIndex }),
    });
  });

  gif.finish();
  const encoded = gif.bytes();
  const bytes = new Uint8Array(encoded.byteLength);
  bytes.set(encoded);
  return new Blob([bytes.buffer], { type: "image/gif" });
}
