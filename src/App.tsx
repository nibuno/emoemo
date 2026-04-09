import { useState } from "react";
import "./App.css";
import SettingsPanel from "./components/SettingsPanel";
import PreviewGrid from "./components/PreviewGrid";
import type { EmojiSettings } from "./types";

function App() {
  const [settings, setSettings] = useState<EmojiSettings>({
    text: "",
    fontFamily: "'Noto Sans JP'",
    textColor: "#000000",
    backgroundColor: "#ffffff",
  });

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex flex-1 min-h-0">
        <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
          <SettingsPanel settings={settings} onSettingsChange={setSettings} />
        </div>
        <div className="flex-1 min-w-0 bg-gray-50 overflow-y-auto">
          <PreviewGrid
            settings={settings}
            canvasSize={{ width: 128, height: 128 }}
          />
        </div>
      </div>
      <footer className="flex-shrink-0 border-t border-gray-200 bg-white py-3 px-4 text-center text-sm text-gray-500">
        Made with ☕ by{" "}
        <a
          href="https://github.com/nibuno"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900"
        >
          @nibuno
        </a>
        {" | "}
        <a
          href="https://github.com/nibuno/emoemo"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900"
        >
          GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;
