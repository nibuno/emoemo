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
      <div className="inline-grid grid-cols-2 gap-2" role="group" aria-label="保存形式">
        {([
          ["image", "画像"],
          ["gif", "GIF"],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={mode === value}
            className={`min-w-24 rounded-lg border-2 px-4 py-2 text-center text-sm font-semibold transition-colors ${
              mode === value
                ? "border-gray-900 bg-gray-50 text-gray-900"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
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
