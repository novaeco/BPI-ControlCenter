import React, { useState } from 'react';
import { X, Save, Keyboard, Volume2, Sliders, Layout, Languages, Palette } from 'lucide-react';

interface VirtualKeyboardSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const VirtualKeyboardSettingsPopup: React.FC<VirtualKeyboardSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState({
    enabled: true,
    layout: 'qwerty',
    language: 'en',
    theme: 'dark',
    soundEnabled: true,
    vibrationEnabled: true,
    autoCorrect: true,
    predictiveText: true,
    keySize: 'medium',
    keySpacing: 'normal',
    opacity: '100',
    height: '35',
    swipeTyping: true,
    emojiKeyboard: true,
    numericRow: true,
    specialCharacters: true,
    customShortcuts: true
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof typeof settings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving virtual keyboard settings:', settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-xl rounded-lg shadow-xl border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Virtual Keyboard Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-6">
            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                <Layout className="w-4 h-4 text-cyan-400" />
                Basic Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Enable Virtual Keyboard</span>
                  <button
                    onClick={() => handleChange('enabled', !settings.enabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.enabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Keyboard Layout
                  </label>
                  <select
                    value={settings.layout}
                    onChange={(e) => handleChange('layout', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="qwerty">QWERTY</option>
                    <option value="azerty">AZERTY</option>
                    <option value="qwertz">QWERTZ</option>
                    <option value="dvorak">Dvorak</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Language
                  </label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="it">Italian</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Appearance
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Theme
                  </label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleChange('theme', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Key Size
                  </label>
                  <select
                    value={settings.keySize}
                    onChange={(e) => handleChange('keySize', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Opacity (%)
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={settings.opacity}
                    onChange={(e) => handleChange('opacity', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Keyboard Height (%)
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="45"
                    value={settings.height}
                    onChange={(e) => handleChange('height', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>25%</span>
                    <span>35%</span>
                    <span>45%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                Feedback & Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Sound Feedback</span>
                  <button
                    onClick={() => handleChange('soundEnabled', !settings.soundEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.soundEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.soundEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Vibration</span>
                  <button
                    onClick={() => handleChange('vibrationEnabled', !settings.vibrationEnabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.vibrationEnabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.vibrationEnabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Auto-Correct</span>
                  <button
                    onClick={() => handleChange('autoCorrect', !settings.autoCorrect)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.autoCorrect ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.autoCorrect ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Predictive Text</span>
                  <button
                    onClick={() => handleChange('predictiveText', !settings.predictiveText)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.predictiveText ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.predictiveText ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Swipe Typing</span>
                  <button
                    onClick={() => handleChange('swipeTyping', !settings.swipeTyping)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.swipeTyping ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.swipeTyping ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Emoji Keyboard</span>
                  <button
                    onClick={() => handleChange('emojiKeyboard', !settings.emojiKeyboard)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.emojiKeyboard ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.emojiKeyboard ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Numeric Row</span>
                  <button
                    onClick={() => handleChange('numericRow', !settings.numericRow)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.numericRow ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.numericRow ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Special Characters</span>
                  <button
                    onClick={() => handleChange('specialCharacters', !settings.specialCharacters)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.specialCharacters ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.specialCharacters ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Custom Shortcuts</span>
                  <button
                    onClick={() => handleChange('customShortcuts', !settings.customShortcuts)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      settings.customShortcuts ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        settings.customShortcuts ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-md bg-cyan-500 text-white hover:bg-cyan-400 transition-colors text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboardSettingsPopup;