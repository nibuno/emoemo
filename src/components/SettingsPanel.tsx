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
}

function SettingsPanel({
  text,
  textColor,
  colorOptions,
  onTextChange,
  onColorChange,
}: SettingsPanelProps) {
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
