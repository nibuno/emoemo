import type { GifFrame } from "./gif";

interface PreviewSource {
  frame: GifFrame;
  backgroundColor: string | null;
}

export interface ThemePreviewProps extends PreviewSource {
  frameNumber?: number;
}

export interface ThemePreviewImage extends PreviewSource {
  src: string;
}
