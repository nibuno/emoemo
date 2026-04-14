interface ColorOption {
  value: string;
  label: string;
}

interface SettingsPanelProps {
  text: string;
  textColor: string;
  colorOptions: readonly ColorOption[];
  onTextChange: (text: string) => void;
  onColorChange: (color: string) => void;
  onSurprise: () => void;
  surpriseLoading: boolean;
  surpriseError: string | null;
  surpriseReason: string | null;
}

function SettingsPanel({
  text,
  textColor,
  colorOptions,
  onTextChange,
  onColorChange,
  onSurprise,
  surpriseLoading,
  surpriseError,
  surpriseReason,
}: SettingsPanelProps) {
  const surpriseDisabled = !text.trim() || surpriseLoading;

  return (
    <div className="flex flex-col gap-6">

      {/* テキスト入力 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 select-none">
          テキスト
        </label>
        <textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={"テキストを\n入力してね"}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
            focus:ring-2 focus:ring-gray-400 focus:border-transparent
            resize-none"
        />

        {/* おまかせボタン */}
        <button
          onClick={onSurprise}
          disabled={surpriseDisabled}
          className={`
            mt-2 w-full px-4 py-2 rounded-lg text-sm font-semibold
            flex items-center justify-center gap-2 transition-colors
            ${surpriseDisabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.99]'}
          `}
        >
          {surpriseLoading ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
              考え中...
            </>
          ) : (
            <>🎲 おまかせ</>
          )}
        </button>
        {surpriseError && (
          <p className="mt-1 text-xs text-red-600">{surpriseError}</p>
        )}
        {!surpriseError && surpriseReason && (
          <p className="mt-1 text-xs text-gray-500">💭 {surpriseReason}</p>
        )}
      </div>

      {/* 文字色 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2 select-none">
          文字色
        </label>
        <div className="flex gap-3 flex-wrap">
          {colorOptions.map((color) => (
            <button
              key={color.value}
              onClick={() => onColorChange(color.value)}
              title={color.label}
              className={`w-8 h-8 rounded-full transition-all ${
                textColor === color.value
                  ? 'ring-offset-2'
                  : 'hover:scale-110'
              }`}
              style={{
                backgroundColor: color.value,
                boxShadow: textColor === color.value
                  ? `0 0 0 2px white, 0 0 0 4px ${color.value}`
                  : undefined,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SettingsPanel;
