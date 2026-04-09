interface TextRenderOptions {
  lines: string[];
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  canvasWidth: number;
  canvasHeight: number;
}

/**
 * テキストの実ピクセル境界を検出し、透明部分をトリミングした領域を返す
 */
function findTextBounds(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): { top: number; bottom: number; left: number; right: number } | null {
  const { data } = ctx.getImageData(0, 0, width, height);

  let top = 0;
  let bottom = height - 1;
  let left = 0;
  let right = width - 1;

  // 上端
  topLoop: for (top = 0; top < height; top++) {
    for (let x = 0; x < width; x++) {
      if (data[(top * width + x) * 4 + 3] > 0) break topLoop;
    }
  }
  if (top >= height) return null; // ピクセルが存在しない

  // 下端
  bottomLoop: for (bottom = height - 1; bottom >= top; bottom--) {
    for (let x = 0; x < width; x++) {
      if (data[(bottom * width + x) * 4 + 3] > 0) break bottomLoop;
    }
  }

  // 左端
  leftLoop: for (left = 0; left < width; left++) {
    for (let y = top; y <= bottom; y++) {
      if (data[(y * width + left) * 4 + 3] > 0) break leftLoop;
    }
  }

  // 右端
  rightLoop: for (right = width - 1; right >= left; right--) {
    for (let y = top; y <= bottom; y++) {
      if (data[(y * width + right) * 4 + 3] > 0) break rightLoop;
    }
  }

  return { top, bottom, left, right };
}

/**
 * テキストをできるだけ大きく描画する
 * 大きめに描画 → 実ピクセル範囲をトリミング → キャンバスにフィットさせることで
 * フォントメトリクスの余白を除去し、文字を最大限大きく表示する
 */
export function renderTextToCanvas(
  ctx: CanvasRenderingContext2D,
  options: TextRenderOptions,
): void {
  const { lines, fontFamily, textColor, backgroundColor, canvasWidth, canvasHeight } = options;

  // 背景を描画
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  if (lines.length === 0 || lines.every((l) => l === "")) return;

  // 1. 各行を個別にオフスクリーン描画 → トリミング
  const fontSize = Math.round(canvasWidth * 1.5);
  const font = `700 ${fontSize}px ${fontFamily}`;

  interface TrimmedLine {
    canvas: HTMLCanvasElement;
    left: number;
    top: number;
    width: number;
    height: number;
  }

  const trimmedLines: TrimmedLine[] = [];
  for (const line of lines) {
    if (line === "") continue;

    const offscreen = document.createElement("canvas");
    offscreen.width = fontSize * (line.length || 1) * 2;
    offscreen.height = fontSize * 2;

    const offCtx = offscreen.getContext("2d");
    if (!offCtx) continue;

    offCtx.font = font;
    offCtx.fillStyle = textColor;
    offCtx.textBaseline = "top";
    offCtx.fillText(line, 0, 0);

    const bounds = findTextBounds(offCtx, offscreen.width, offscreen.height);
    if (!bounds) continue;

    trimmedLines.push({
      canvas: offscreen,
      left: bounds.left,
      top: bounds.top,
      width: bounds.right - bounds.left + 1,
      height: bounds.bottom - bounds.top + 1,
    });
  }

  if (trimmedLines.length === 0) return;

  // 2. 各行の高さ合計 + 行間でトータル高さを算出
  const lineSpacing = 0.05; // 行の高さに対する行間の比率
  const maxLineHeight = Math.max(...trimmedLines.map((l) => l.height));
  const gap = Math.round(maxLineHeight * lineSpacing);
  const totalWidth = Math.max(...trimmedLines.map((l) => l.width));
  const totalHeight = trimmedLines.reduce((sum, l) => sum + l.height, 0)
    + gap * (trimmedLines.length - 1);

  // 3. トリミング済みの行をキャンバスにフィットさせて描画
  //    高さ優先：縦はフルに使い、横幅が溢れる場合のみ圧縮する
  //    padding は端のクリップ防止の安全マージンのみ確保
  const padding = 0.02;
  const maxWidth = canvasWidth * (1 - padding * 2);
  const maxHeight = canvasHeight * (1 - padding * 2);

  const scaleY = maxHeight / totalHeight;
  const scaleX = Math.min(scaleY, maxWidth / totalWidth);
  const drawTotalHeight = totalHeight * scaleY;
  const offsetX = (canvasWidth - totalWidth * scaleX) / 2;
  const offsetY = (canvasHeight - drawTotalHeight) / 2;

  let currentY = offsetY;
  for (const line of trimmedLines) {
    const drawWidth = line.width * scaleX;
    const drawHeight = line.height * scaleY;
    // 各行を水平方向に中央揃え
    const drawX = offsetX + (totalWidth * scaleX - drawWidth) / 2;

    ctx.drawImage(
      line.canvas,
      line.left, line.top, line.width, line.height,
      drawX, currentY, drawWidth, drawHeight,
    );
    currentY += drawHeight + gap * scaleY;
  }
}
