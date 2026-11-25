import type { GifFrame } from "./gif";

export interface ThemePreviewProps {
  frames: GifFrame[];
  currentIndex: number;
  backgroundColor: string | null;
}

/** 各コマを描いた画像。描画に失敗したコマや未入力のコマは null */
export interface ThemePreviewImages {
  frames: GifFrame[];
  backgroundColor: string | null;
  srcs: Array<string | null>;
}
