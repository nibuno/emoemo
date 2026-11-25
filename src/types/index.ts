export type BackgroundMode = "white" | "dark" | "transparent";

export interface EmojiSettings {
  text: string;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
}

export interface EmojiImageOptions extends Omit<EmojiSettings, "backgroundColor"> {
  backgroundColor?: string | null;
  size: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}
