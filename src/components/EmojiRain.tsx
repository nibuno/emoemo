import type { CSSProperties } from "react";
import type { EmojiDrop } from "../types/emojiRain";

type EmojiRainProps = {
  drops: EmojiDrop[];
  onDropEnd: (id: number) => void;
};

type DropStyle = CSSProperties & Record<`--${string}`, string>;

function EmojiRain({ drops, onDropEnd }: EmojiRainProps) {
  if (drops.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50" aria-hidden="true">
      {drops.map((drop) => {
        const style: DropStyle = {
          left: `${drop.left}%`,
          fontSize: `${drop.size}px`,
          animationDuration: `${drop.duration}ms`,
          animationDelay: `${drop.delay}ms`,
          "--drift": `${drop.drift}px`,
          "--spin": `${drop.spin}deg`,
        };
        return (
          <span
            key={drop.id}
            className="emoji-drop"
            style={style}
            onAnimationEnd={() => onDropEnd(drop.id)}
          >
            {drop.emoji}
          </span>
        );
      })}
    </div>
  );
}

export default EmojiRain;
