import React, { useState } from 'react';
import { X, Save, Brain, Sliders, Cpu, MessageSquare, Gauge, RefreshCw, Zap } from 'lucide-react';

interface AISettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  contextWindow: number;
  responseSpeed: 'fast' | 'balanced' | 'precise';
  autoLearn: boolean;
  useCache: boolean;
  streamResponse: boolean;
}

const AISettingsPopup: React.FC<AISettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<AIConfig>({
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.9,
    frequencyPenalty: 0.5,
    presencePenalty: 0.5,
    contextWindow: 8192,
    responseSpeed: 'balanced',
    autoLearn: true,
    useCache: true,
    streamResponse: true
  });

  const [isOptimizing, setIsOptimizing] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof AIConfig, value: string | number | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOptimize = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsOptimizing(false);
  };

  const handleSave = () => {
    console.log('Saving AI configuration:', config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-4xl rounded-lg shadow-xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">AI Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  Model Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      AI Model
                    </label>
                    <select
                      value={config.model}
                      onChange={(e) => handleChange('model', e.target.value)}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="gpt-4">GPT-4 (Most Capable)</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Faster)</option>
                      <option value="claude-2">Claude 2</option>
                      <option value="llama-2">Llama 2</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Context Window
                    </label>
                    <select
                      value={config.contextWindow}
                      onChange={(e) => handleChange('contextWindow', parseInt(e.target.value))}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="4096">4K tokens</option>
                      <option value="8192">8K tokens</option>
                      <option value="16384">16K tokens</option>
                      <option value="32768">32K tokens</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Max Response Tokens
                    </label>
                    <input
                      type="number"
                      value={config.maxTokens}
                      onChange={(e) => handleChange('maxTokens', parseInt(e.target.value))}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Generation Parameters
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-400">
                        Temperature
                      </label>
                      <span className="text-sm text-cyan-400">{config.temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={config.temperature}
                      onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Focused</span>
                      <span>Creative</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-400">
                        Top P
                      </label>
                      <span className="text-sm text-cyan-400">{config.topP}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={config.topP}
                      onChange={(e) => handleChange('topP', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-400">
                        Frequency Penalty
                      </label>
                      <span className="text-sm text-cyan-400">{config.frequencyPenalty}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={config.frequencyPenalty}
                      onChange={(e) => handleChange('frequencyPenalty', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-sm font-medium text-gray-400">
                        Presence Penalty
                      </label>
                      <span className="text-sm text-cyan-400">{config.presencePenalty}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2"
                      step="0.1"
                      value={config.presencePenalty}
                      onChange={(e) => handleChange('presencePenalty', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  Response Settings
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Response Speed
                    </label>
                    <select
                      value={config.responseSpeed}
                      onChange={(e) => handleChange('responseSpeed', e.target.value as AIConfig['responseSpeed'])}
                      className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    >
                      <option value="fast">Fast (Lower quality)</option>
                      <option value="balanced">Balanced</option>
                      <option value="precise">Precise (Higher quality)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Stream Response</span>
                    <button
                      onClick={() => handleChange('streamResponse', !config.streamResponse)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        config.streamResponse ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          config.streamResponse ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  Performance Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Auto-Learning</span>
                    <button
                      onClick={() => handleChange('autoLearn', !config.autoLearn)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        config.autoLearn ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          config.autoLearn ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm">Response Caching</span>
                    <button
                      onClick={() => handleChange('useCache', !config.useCache)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        config.useCache ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                          config.useCache ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium flex items-center gap-2 mb-4">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  Performance Metrics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Average Response Time</span>
                    <span className="text-white">1.2s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Token Usage (30d)</span>
                    <span className="text-white">125K / 500K</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cache Hit Rate</span>
                    <span className="text-white">78%</span>
                  </div>
                  <button
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className="w-full mt-2 bg-cyan-500 hover:bg-cyan-400 text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        Optimize Settings
                      </>
                    )}
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

export default AISettingsPopup;