export interface EmojiDrop {
  id: number;
  emoji: string;
  /** 画面幅に対する横位置（%） */
  left: number;
  size: number;
  duration: number;
  delay: number;
  /** 落ちる間の横ずれ（px） */
  drift: number;
  /** 落ちる間の回転量（deg） */
  spin: number;
}
