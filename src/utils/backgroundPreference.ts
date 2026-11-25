import { isBackgroundMode } from "../constants";
import type { BackgroundMode } from "../types";

const STORAGE_KEY = "emoemo:background";

export function loadBackground(): BackgroundMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isBackgroundMode(stored) ? stored : "white";
  } catch {
    return "white";
  }
}

export function saveBackground(background: BackgroundMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, background);
  } catch {
    // 保存できない環境では、今回の編集にだけ選んだ背景を使う
  }
}
