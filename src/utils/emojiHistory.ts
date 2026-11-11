import type { SavedEmoji, SavedEmojiFrame } from "../types/emojiRain";

const STORAGE_KEY = "emoemo:emoji-history";
const MAX_EMOJI_HISTORY = 30;

function isSavedEmojiFrame(value: unknown): value is SavedEmojiFrame {
  return typeof value === "object" && value !== null
    && "text" in value && typeof value.text === "string"
    && "fontFamily" in value && typeof value.fontFamily === "string"
    && "textColor" in value && typeof value.textColor === "string";
}

function isSavedEmoji(value: unknown): value is SavedEmoji {
  if (typeof value !== "object" || value === null || !("kind" in value)) return false;
  if (value.kind === "image") {
    return "frame" in value && isSavedEmojiFrame(value.frame);
  }
  if (value.kind === "gif") {
    return "frames" in value && Array.isArray(value.frames)
      && value.frames.length >= 2 && value.frames.every(isSavedEmojiFrame)
      && "frameDelay" in value && typeof value.frameDelay === "number";
  }
  return false;
}

export function emojiKey(emoji: SavedEmoji): string {
  return JSON.stringify(emoji);
}

/** 新しい順に返す。壊れたデータは読み飛ばす */
export function loadEmojiHistory(): SavedEmoji[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isSavedEmoji) : [];
  } catch {
    return [];
  }
}

/** 先頭に追加する。同じ絵文字は先頭に移し、上限を超えた古いものは消す */
export function addEmojiToHistory(emoji: SavedEmoji): void {
  const key = emojiKey(emoji);
  const next = [emoji, ...loadEmojiHistory().filter((saved) => emojiKey(saved) !== key)]
    .slice(0, MAX_EMOJI_HISTORY);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 保存できなくても（プライベートブラウズ等）ダウンロード自体には影響させない
  }
}
