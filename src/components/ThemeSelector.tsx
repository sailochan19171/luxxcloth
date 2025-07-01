

import type React from "react"
import { Palette, X, Check } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

interface ThemeSelectorProps {
  isOpen: boolean
  onClose: () => void
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { currentTheme, setTheme, themes } = useTheme()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Palette size={24} className="text-gray-900" />
              <h2 className="text-xl font-semibold text-gray-900">Theme Settings</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto">
            <h3 className="font-medium text-gray-900 mb-4">Choose Your Theme</h3>
            <div className="space-y-4">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setTheme(theme)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    currentTheme.name === theme.name
                      ? "border-gray-900 bg-gray-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">{theme.name}</span>
                    {currentTheme.name === theme.name && (
                      <div className="flex items-center justify-center w-6 h-6 bg-gray-900 rounded-full">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 mb-2">
                    <div
                      style={{ backgroundColor: theme.colors?.primary || theme.primary }}
                      className="w-8 h-8 rounded-full shadow-sm border border-gray-200"
                      title="Primary Color"
                    ></div>
                    <div
                      style={{ backgroundColor: theme.colors?.secondary || theme.secondary }}
                      className="w-8 h-8 rounded-full shadow-sm border border-gray-200"
                      title="Secondary Color"
                    ></div>
                    <div
                      style={{ backgroundColor: theme.colors?.accent || theme.accent }}
                      className="w-8 h-8 rounded-full shadow-sm border border-gray-200"
                      title="Accent Color"
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">Primary • Secondary • Accent</div>
                </button>
              ))}
            </div>

            <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-3">Live Preview</h4>
              <div className="space-y-3">
                <button
                  style={{ backgroundColor: currentTheme.colors?.primary || currentTheme.primary }}
                  className="w-full py-2 px-4 text-white rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity"
                >
                  Primary Button
                </button>
                <button
                  style={{
                    backgroundColor: currentTheme.colors?.secondary || currentTheme.secondary,
                    color: "white",
                  }}
                  className="w-full py-2 px-4 rounded-lg font-medium shadow-sm hover:opacity-90 transition-opacity"
                >
                  Secondary Button
                </button>
                <div
                  style={{
                    backgroundColor: currentTheme.colors?.accent || currentTheme.accent,
                    color: currentTheme.colors?.text || currentTheme.text,
                  }}
                  className="w-full py-2 px-4 rounded-lg text-center border border-gray-200"
                >
                  Accent Background
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">How to Use Themes</h4>
              <p className="text-sm text-blue-700">
                Themes are automatically applied to components that use CSS custom properties. You can also use the
                theme context in your components to access current theme values.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector
