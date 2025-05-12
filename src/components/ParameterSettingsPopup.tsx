import React, { useState } from 'react';
import { X, Save, Sliders, Sun, Cloud, CloudRain, CloudLightning, CloudFog, ChevronRight, Leaf, Flower2, Snowflake, Wind, Calendar } from 'lucide-react';

interface ParameterSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RainType {
  name: string;
  icon: React.ElementType;
  description: string;
  parameters: ModeParameters;
}

interface FogType {
  name: string;
  icon: React.ElementType;
  description: string;
  parameters: ModeParameters;
}

interface ModeParameters {
  temperature: number;
  humidity: number;
  lightLevel: number;
  uvLevel: number;
  airflow: number;
  co2Level: number;
  waterLevel: number;
  waterTemp: number;
  mistFrequency: number;
  mistDuration: number;
  rainDuration: number;
  rainIntensity: number;
  thunderFrequency: number;
  lightningIntensity: number;
  fogDensity: number;
  fogDuration: number;
  cloudCover: number;
  cycleLength?: number;
}

type Mode = 'normal' | 'season' | 'rain' | 'storm' | 'fog';
type Season = 'full' | 'spring' | 'summer' | 'fall' | 'winter';
type RainMode = 'rain' | 'cloudy' | 'full';
type StormMode = 'dry' | 'rain';
type FogMode = 'full' | 'morning' | 'evening';

interface SeasonConfig {
  name: string;
  icon: React.ElementType;
  description: string;
  parameters: ModeParameters;
  duration?: number;
}

interface StormType {
  name: string;
  icon: React.ElementType;
  description: string;
  parameters: ModeParameters;
}

interface ModeConfig {
  name: string;
  icon: React.ElementType;
  description: string;
  parameters: ModeParameters;
  enabled: boolean;
  seasons?: Record<Season, SeasonConfig>;
  rainTypes?: Record<RainMode, RainType>;
  stormTypes?: Record<StormMode, StormType>;
  fogTypes?: Record<FogMode, FogType>;
}

const defaultParameters: ModeParameters = {
  temperature: 25,
  humidity: 60,
  lightLevel: 70,
  uvLevel: 5,
  airflow: 50,
  co2Level: 400,
  waterLevel: 70,
  waterTemp: 24,
  mistFrequency: 30,
  mistDuration: 15,
  rainDuration: 20,
  rainIntensity: 50,
  thunderFrequency: 10,
  lightningIntensity: 70,
  fogDensity: 60,
  fogDuration: 30,
  cloudCover: 50
};

const ParameterSettingsPopup: React.FC<ParameterSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season>('spring');
  const [selectedRainMode, setSelectedRainMode] = useState<RainMode>('rain');
  const [selectedStormMode, setSelectedStormMode] = useState<StormMode>('dry');
  const [selectedFogMode, setSelectedFogMode] = useState<FogMode>('full');
  
  const [modes, setModes] = useState<Record<Mode, ModeConfig>>({
    normal: {
      name: 'Normal Mode',
      icon: Sun,
      description: 'Standard environmental conditions',
      parameters: { ...defaultParameters },
      enabled: true
    },
    season: {
      name: 'Season Mode',
      icon: Cloud,
      description: 'Simulates seasonal changes',
      parameters: { ...defaultParameters },
      enabled: false,
      seasons: {
        full: {
          name: 'Full Season',
          icon: Calendar,
          description: 'Complete seasonal cycle',
          parameters: { ...defaultParameters },
          duration: 365
        },
        spring: {
          name: 'Spring',
          icon: Flower2,
          description: 'Mild temperatures with occasional rain',
          parameters: {
            ...defaultParameters,
            temperature: 20,
            humidity: 65,
            lightLevel: 75,
            uvLevel: 6,
            mistFrequency: 40
          },
          duration: 90
        },
        summer: {
          name: 'Summer',
          icon: Sun,
          description: 'Warm temperatures with high UV',
          parameters: {
            ...defaultParameters,
            temperature: 28,
            humidity: 55,
            lightLevel: 90,
            uvLevel: 8,
            mistFrequency: 20
          },
          duration: 92
        },
        fall: {
          name: 'Fall',
          icon: Leaf,
          description: 'Cooling temperatures with moderate humidity',
          parameters: {
            ...defaultParameters,
            temperature: 18,
            humidity: 60,
            lightLevel: 60,
            uvLevel: 4,
            mistFrequency: 30
          },
          duration: 91
        },
        winter: {
          name: 'Winter',
          icon: Snowflake,
          description: 'Cool temperatures with low UV',
          parameters: {
            ...defaultParameters,
            temperature: 15,
            humidity: 50,
            lightLevel: 40,
            uvLevel: 2,
            mistFrequency: 15
          },
          duration: 92
        }
      }
    },
    rain: {
      name: 'Rain Mode',
      icon: CloudRain,
      description: 'Simulates rainfall conditions',
      parameters: { ...defaultParameters },
      enabled: false,
      rainTypes: {
        full: {
          name: 'Full Rain Cycle',
          icon: Calendar,
          description: 'Automatic cycling between rain and cloudy periods',
          parameters: {
            ...defaultParameters,
            temperature: 21,
            humidity: 80,
            lightLevel: 45,
            uvLevel: 2.5,
            rainIntensity: 60,
            rainDuration: 30,
            cloudCover: 80,
            cycleLength: 120
          }
        },
        rain: {
          name: 'Rain',
          icon: CloudRain,
          description: 'Continuous rainfall with high humidity',
          parameters: {
            ...defaultParameters,
            temperature: 20,
            humidity: 85,
            lightLevel: 40,
            uvLevel: 2,
            rainIntensity: 80,
            rainDuration: 45,
            cloudCover: 90
          }
        },
        cloudy: {
          name: 'Cloudy',
          icon: Cloud,
          description: 'Overcast conditions without precipitation',
          parameters: {
            ...defaultParameters,
            temperature: 22,
            humidity: 70,
            lightLevel: 50,
            uvLevel: 3,
            rainIntensity: 0,
            rainDuration: 0,
            cloudCover: 75
          }
        }
      }
    },
    storm: {
      name: 'Storm Mode',
      icon: CloudLightning,
      description: 'Simulates storm conditions with thunder and lightning',
      parameters: { ...defaultParameters },
      enabled: false,
      stormTypes: {
        dry: {
          name: 'Dry Storm',
          icon: CloudLightning,
          description: 'Thunder and lightning without rain',
          parameters: {
            ...defaultParameters,
            temperature: 28,
            humidity: 45,
            lightLevel: 30,
            uvLevel: 2,
            thunderFrequency: 15,
            lightningIntensity: 80,
            airflow: 70,
            cloudCover: 85
          }
        },
        rain: {
          name: 'Rain Storm',
          icon: CloudRain,
          description: 'Heavy rain with thunder and lightning',
          parameters: {
            ...defaultParameters,
            temperature: 22,
            humidity: 85,
            lightLevel: 20,
            uvLevel: 1,
            rainIntensity: 90,
            thunderFrequency: 20,
            lightningIntensity: 90,
            airflow: 85,
            cloudCover: 95
          }
        }
      }
    },
    fog: {
      name: 'Fog Mode',
      icon: CloudFog,
      description: 'Creates a foggy environment',
      parameters: { ...defaultParameters },
      enabled: false,
      fogTypes: {
        full: {
          name: 'Full Fog Cycle',
          icon: Calendar,
          description: 'Automatic cycling of fog throughout the day',
          parameters: {
            ...defaultParameters,
            temperature: 18,
            humidity: 95,
            lightLevel: 30,
            uvLevel: 1,
            fogDensity: 80,
            fogDuration: 120,
            cloudCover: 90,
            cycleLength: 360
          }
        },
        morning: {
          name: 'Morning Fog',
          icon: CloudFog,
          description: 'Dense morning fog that gradually dissipates',
          parameters: {
            ...defaultParameters,
            temperature: 16,
            humidity: 98,
            lightLevel: 20,
            uvLevel: 1,
            fogDensity: 90,
            fogDuration: 180,
            cloudCover: 95,
            airflow: 20
          }
        },
        evening: {
          name: 'Evening Fog',
          icon: CloudFog,
          description: 'Progressive fog formation during evening hours',
          parameters: {
            ...defaultParameters,
            temperature: 19,
            humidity: 92,
            lightLevel: 40,
            uvLevel: 2,
            fogDensity: 75,
            fogDuration: 240,
            cloudCover: 85,
            airflow: 30
          }
        }
      }
    }
  });

  if (!isOpen) return null;

  const handleModeToggle = (mode: Mode) => {
    setModes(prev => ({
      ...prev,
      [mode]: {
        ...prev[mode],
        enabled: !prev[mode].enabled
      }
    }));
  };

  const handleParameterChange = (mode: Mode, parameter: keyof ModeParameters, value: number) => {
    if (mode === 'season' && modes[mode].seasons) {
      setModes(prev => ({
        ...prev,
        [mode]: {
          ...prev[mode],
          seasons: {
            ...prev[mode].seasons!,
            [selectedSeason]: {
              ...prev[mode].seasons![selectedSeason],
              parameters: {
                ...prev[mode].seasons![selectedSeason].parameters,
                [parameter]: value
              }
            }
          }
        }
      }));
    } else if (mode === 'rain' && modes[mode].rainTypes) {
      setModes(prev => ({
        ...prev,
        [mode]: {
          ...prev[mode],
          rainTypes: {
            ...prev[mode].rainTypes!,
            [selectedRainMode]: {
              ...prev[mode].rainTypes![selectedRainMode],
              parameters: {
                ...prev[mode].rainTypes![selectedRainMode].parameters,
                [parameter]: value
              }
            }
          }
        }
      }));
    } else if (mode === 'fog' && modes[mode].fogTypes) {
      setModes(prev => ({
        ...prev,
        [mode]: {
          ...prev[mode],
          fogTypes: {
            ...prev[mode].fogTypes!,
            [selectedFogMode]: {
              ...prev[mode].fogTypes![selectedFogMode],
              parameters: {
                ...prev[mode].fogTypes![selectedFogMode].parameters,
                [parameter]: value
              }
            }
          }
        }
      }));
    } else {
      setModes(prev => ({
        ...prev,
        [mode]: {
          ...prev[mode],
          parameters: {
            ...prev[mode].parameters,
            [parameter]: value
          }
        }
      }));
    }
  };

  const renderModeParameters = (mode: Mode) => {
    const config = modes[mode];
    const params = mode === 'season' && config.seasons 
      ? config.seasons[selectedSeason].parameters 
      : mode === 'rain' && config.rainTypes
      ? config.rainTypes[selectedRainMode].parameters
      : mode === 'fog' && config.fogTypes
      ? config.fogTypes[selectedFogMode].parameters
      : config.parameters;

    const renderParameter = (
      label: string,
      value: number,
      parameter: keyof ModeParameters,
      min: number = 0,
      max: number = 100,
      step: number = 1,
      unit: string = '%'
    ) => (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-400">{label}</label>
          <span className="text-sm text-cyan-400">{value}{unit}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleParameterChange(mode, parameter, parseFloat(e.target.value))}
          className="w-full"
          disabled={selectedSeason === 'full' || selectedFogMode === 'full'}
        />
      </div>
    );

    return (
      <div className="space-y-4">
        {mode === 'normal' && (
          <>
            {renderParameter('Temperature', params.temperature, 'temperature', 15, 35, 0.1, '°C')}
            {renderParameter('Humidity', params.humidity, 'humidity')}
            {renderParameter('Light Level', params.lightLevel, 'lightLevel')}
            {renderParameter('UV Level', params.uvLevel, 'uvLevel', 0, 10, 0.1)}
            {renderParameter('Airflow', params.airflow, 'airflow')}
            {renderParameter('CO2 Level', params.co2Level, 'co2Level', 300, 1000, 10, 'ppm')}
            {renderParameter('Water Level', params.waterLevel, 'waterLevel')}
            {renderParameter('Water Temperature', params.waterTemp, 'waterTemp', 15, 35, 0.1, '°C')}
          </>
        )}

        {mode === 'season' && (
          <>
            <div className="grid grid-cols-5 gap-2 mb-6">
              {(Object.entries(modes.season.seasons!) as [Season, SeasonConfig][]).map(([season, config]) => (
                <button
                  key={season}
                  onClick={() => setSelectedSeason(season)}
                  className={`p-3 rounded-lg transition-colors flex flex-col items-center gap-2 ${
                    selectedSeason === season
                      ? 'bg-cyan-400/10 border border-cyan-400'
                      : 'bg-[#141e2a] border border-gray-700 hover:bg-[#141e2a]/70'
                  }`}
                >
                  <config.icon className="w-6 h-6 text-cyan-400" />
                  <span className="text-white text-sm">{config.name}</span>
                  {config.duration && (
                    <span className="text-gray-400 text-xs">{config.duration} days</span>
                  )}
                </button>
              ))}
            </div>
            {selectedSeason === 'full' ? (
              <div className="bg-[#141e2a]/50 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Full Season mode automatically cycles through all seasons throughout the year. Parameters will gradually transition between seasons to create a natural progression.</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Duration:</span>
                    <span className="text-white">365 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Season:</span>
                    <span className="text-white">Spring (Day 45/90)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Next Transition:</span>
                    <span className="text-white">Summer in 45 days</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {renderParameter('Temperature', params.temperature, 'temperature', 15, 35, 0.1, '°C')}
                {renderParameter('Humidity', params.humidity, 'humidity')}
                {renderParameter('Light Level', params.lightLevel, 'lightLevel')}
                {renderParameter('UV Level', params.uvLevel, 'uvLevel', 0, 10, 0.1)}
                {renderParameter('Mist Frequency', params.mistFrequency, 'mistFrequency', 0, 60, 1, 'min')}
              </>
            )}
          </>
        )}

        {mode === 'rain' && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {(Object.entries(modes.rain.rainTypes!) as [RainMode, RainType][]).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setSelectedRainMode(type)}
                  className={`p-3 rounded-lg transition-colors flex flex-col items-center gap-2 ${
                    selectedRainMode === type
                      ? 'bg-cyan-400/10 border border-cyan-400'
                      : 'bg-[#141e2a] border border-gray-700 hover:bg-[#141e2a]/70'
                  }`}
                >
                  <config.icon className="w-6 h-6 text-cyan-400" />
                  <span className="text-white text-sm">{config.name}</span>
                  <span className="text-gray-400 text-xs text-center">{config.description}</span>
                </button>
              ))}
            </div>

            {selectedRainMode === 'full' ? (
              <div className="bg-[#141e2a]/50 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Full Rain Cycle mode automatically alternates between rain and cloudy conditions to create a natural weather pattern.</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cycle Duration:</span>
                    <span className="text-white">120 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Phase:</span>
                    <span className="text-white">Rain (15/45 min)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Next Phase:</span>
                    <span className="text-white">Cloudy in 30 min</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {renderParameter('Cloud Cover', params.cloudCover, 'cloudCover')}
                {selectedRainMode === 'rain' && (
                  <>
                    {renderParameter('Rain Duration', params.rainDuration, 'rainDuration', 0, 120, 1, 'min')}
                    {renderParameter('Rain Intensity', params.rainIntensity, 'rainIntensity')}
                  </>
                )}
                {renderParameter('Temperature', params.temperature, 'temperature', 15, 35, 0.1, '°C')}
                {renderParameter('Humidity', params.humidity, 'humidity')}
                {renderParameter('Light Level', params.lightLevel, 'lightLevel')}
                {renderParameter('UV Level', params.uvLevel, 'uvLevel', 0, 10, 0.1)}
              </>
            )}
          </>
        )}

        {mode === 'storm' && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {(Object.entries(modes.storm.stormTypes!) as [StormMode, StormType][]).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setSelectedStormMode(type)}
                  className={`p-4 rounded-lg transition-colors flex flex-col items-center gap-3 ${
                    selectedStormMode === type
                      ? 'bg-cyan-400/10 border border-cyan-400'
                      : 'bg-[#141e2a] border border-gray-700 hover:bg-[#141e2a]/70'
                  }`}
                >
                  <config.icon className="w-8 h-8 text-cyan-400" />
                  <div className="text-center">
                    <div className="text-white font-medium">{config.name}</div>
                    <div className="text-gray-400 text-sm mt-1">{config.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {renderParameter('Thunder Frequency', params.thunderFrequency, 'thunderFrequency', 0, 60, 1, 'min')}
            {renderParameter('Lightning Intensity', params.lightningIntensity, 'lightningIntensity')}
            {renderParameter('Wind Speed', params.airflow, 'airflow')}
            {renderParameter('Cloud Cover', params.cloudCover, 'cloudCover')}
            
            {selectedStormMode === 'rain' && (
              <>
                {renderParameter('Rain Intensity', params.rainIntensity, 'rainIntensity')}
                {renderParameter('Humidity', params.humidity, 'humidity')}
              </>
            )}
            
            {renderParameter('Temperature', params.temperature, 'temperature', 15, 35, 0.1, '°C')}
            {renderParameter('Light Level', params.lightLevel, 'lightLevel')}
            {renderParameter('UV Level', params.uvLevel, 'uvLevel', 0, 10, 0.1)}
          </>
        )}

        {mode === 'fog' && (
          <>
            <div className="grid grid-cols-3 gap-2 mb-6">
              {(Object.entries(modes.fog.fogTypes!) as [FogMode, FogType][]).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => setSelectedFogMode(type)}
                  className={`p-3 rounded-lg transition-colors flex flex-col items-center gap-2 ${
                    selectedFogMode === type
                      ? 'bg-cyan-400/10 border border-cyan-400'
                      : 'bg-[#141e2a] border border-gray-700 hover:bg-[#141e2a]/70'
                  }`}
                >
                  <config.icon className="w-6 h-6 text-cyan-400" />
                  <span className="text-white text-sm">{config.name}</span>
                  <span className="text-gray-400 text-xs text-center">{config.description}</span>
                </button>
              ))}
            </div>

            {selectedFogMode === 'full' ? (
              <div className="bg-[#141e2a]/50 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm">Full Fog Cycle mode automatically manages fog density throughout the day, creating natural transitions between clear and foggy conditions.</p>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Cycle Duration:</span>
                    <span className="text-white">360 minutes</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Phase:</span>
                    <span className="text-white">Dense Fog (45/120 min)</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Next Phase:</span>
                    <span className="text-white">Dissipation in 75 min</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {renderParameter('Fog Density', params.fogDensity, 'fogDensity')}
                {renderParameter('Fog Duration', params.fogDuration, 'fogDuration', 0, 360, 15, 'min')}
                {renderParameter('Temperature', params.temperature, 'temperature', 15, 35, 0.1, '°C')}
                {renderParameter('Humidity', params.humidity, 'humidity')}
                {renderParameter('Light Level', params.lightLevel, 'lightLevel')}
                {renderParameter('UV Level', params.uvLevel, 'uvLevel', 0, 10, 0.1)}
                {renderParameter('Airflow', params.airflow, 'airflow')}
                {renderParameter('Cloud Cover', params.cloudCover, 'cloudCover')}
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const renderModeIcon = (mode: Mode) => {
    const IconComponent = modes[mode].icon;
    return <IconComponent className="w-5 h-5 text-cyan-400" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-4xl rounded-lg shadow-xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Parameter Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r border-gray-700 overflow-y-auto p-4">
            {(Object.entries(modes) as [Mode, ModeConfig][]).map(([key, mode]) => (
              <button
                key={key}
                onClick={() => setSelectedMode(key)}
                className={`w-full p-3 rounded-lg transition-colors mb-2 flex items-center justify-between ${
                  selectedMode === key
                    ? 'bg-cyan-400/10 border border-cyan-400'
                    : 'bg-[#141e2a] border border-gray-700 hover:bg-[#141e2a]/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  {renderModeIcon(key)}
                  <div className="text-left">
                    <div className="text-white font-medium">{mode.name}</div>
                    <div className="text-gray-400 text-sm">{mode.description}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {selectedMode && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {renderModeIcon(selectedMode)}
                    <h3 className="text-lg font-medium text-white">{modes[selectedMode].name}</h3>
                  </div>
                  <button
                    onClick={() => handleModeToggle(selectedMode)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      modes[selectedMode].enabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        modes[selectedMode].enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                  {renderModeParameters(selectedMode)}
                </div>
              </div>
            )}
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

export default ParameterSettingsPopup;