interface ColorOption {
  value: string;
  label: string;
}

interface SettingsPanelProps {
  text: string;
  textColor: string;
  isLoading: boolean;
  colorOptions: readonly ColorOption[];
  onTextChange: (text: string) => void;
  onColorChange: (color: string) => void;
  onAutoSelect: () => void;
}

function SettingsPanel({
  text,
  textColor,
  isLoading,
  colorOptions,
  onTextChange,
  onColorChange,
  onAutoSelect,
}: SettingsPanelProps) {
  return (
    <div className="flex flex-col gap-6">

      {/* テキスト入力 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
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
      </div>

      {/* ✨ おまかせで選ぶ */}
      <div>
        <button
          onClick={onAutoSelect}
          disabled={!text.trim() || isLoading}
          className={`
            w-full py-3 rounded-lg font-bold text-sm tracking-wide
            flex items-center justify-center gap-2
            transition-colors duration-200
            ${text.trim() && !isLoading
              ? 'bg-[#E85D2F] text-white hover:bg-[#D44E22] active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              考え中...
            </>
          ) : (
            <>✨ おまかせで選ぶ</>
          )}
        </button>

        {/* 区切り線 */}
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">または自分で選ぶ</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      </div>

      {/* 文字色 */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          文字色
        </label>
        <div className="flex justify-between">
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
