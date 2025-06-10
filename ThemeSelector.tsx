import React from 'react';
import { Palette, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ isOpen, onClose }) => {
  const { currentTheme, setTheme, themes } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <Palette size={24} className="text-gray-900" />
              <h2 className="text-xl font-semibold text-gray-900">Theme Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Theme Options */}
          <div className="flex-1 p-6">
            <h3 className="font-medium text-gray-900 mb-4">Choose Your Theme</h3>
            <div className="space-y-4">
              {themes.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setTheme(theme)}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    currentTheme.name === theme.name
                      ? 'border-gray-900 bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">{theme.name}</span>
                    {currentTheme.name === theme.name && (
                      <div className="w-2 h-2 bg-gray-900 rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Color Preview */}
                  <div className="flex space-x-2">
                    <div
                      className={`w-8 h-8 rounded-full bg-${theme.primary}`}
                      title="Primary Color"
                    ></div>
                    <div
                      className={`w-8 h-8 rounded-full bg-${theme.secondary}`}
                      title="Secondary Color"
                    ></div>
                    <div
                      className={`w-8 h-8 rounded-full bg-${theme.accent} border border-gray-200`}
                      title="Accent Color"
                    ></div>
                  </div>
                </button>
              ))}
            </div>

            {/* Preview Section */}
            <div className="mt-8 p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
              <div className="space-y-3">
                <button className={`w-full py-2 px-4 bg-${currentTheme.primary} text-white rounded-lg font-medium`}>
                  Primary Button
                </button>
                <button className={`w-full py-2 px-4 bg-${currentTheme.secondary} text-white rounded-lg font-medium`}>
                  Secondary Button
                </button>
                <div className={`w-full py-2 px-4 bg-${currentTheme.accent} rounded-lg text-center`}>
                  Accent Background
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;