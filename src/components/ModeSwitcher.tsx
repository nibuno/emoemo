export type OutputMode = "image" | "gif";

interface ModeSwitcherProps {
  mode: OutputMode;
  onChange: (mode: OutputMode) => void;
}

function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  return (
    <div>
      <span className="block text-sm font-bold text-gray-700 mb-2 select-none">
        形式
      </span>
      <div className="inline-flex rounded-lg border border-gray-300 p-1" role="group" aria-label="保存形式">
        {([
          ["image", "画像"],
          ["gif", "GIF"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={mode === value}
            className={`min-w-20 rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
              mode === value
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ModeSwitcher;
