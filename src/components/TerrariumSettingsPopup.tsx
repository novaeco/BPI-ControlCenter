import React, { useState, useEffect, useRef } from 'react';
import { Moon, Droplet, Thermometer, Zap, Leaf, Gauge, FlaskRound as Flask, Info, Upload, Activity, Sliders } from 'lucide-react';
import AnimalInfoSettingsPopup from './AnimalInfoSettingsPopup';
import ParameterSettingsPopup from './ParameterSettingsPopup';

interface TerrariumSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: number, settings: any) => void;
  terrarium: {
    id: number;
    name: string;
    temperature: number;
    humidity: number;
    lightLevel: number;
    uviLevel: number;
    image: string;
    dayTemperature?: number;
    nightTemperature?: number;
    dayHumidity?: number;
    nightHumidity?: number;
    animal?: {
      name: string;
      species: string;
      sex: 'male' | 'female';
      dateOfBirth: string;
      age: string;
      diet: string;
      activity: 'nocturnal' | 'diurnal';
      habitat: 'terrestrial' | 'aquatic' | 'arboreal';
    };
  };
}

const TerrariumSettingsPopup: React.FC<TerrariumSettingsPopupProps> = ({
  isOpen,
  onClose,
  onSave,
  terrarium
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [settings, setSettings] = useState({
    name: terrarium.name,
    temperature: terrarium.temperature,
    humidity: terrarium.humidity,
    lightLevel: terrarium.lightLevel,
    uviLevel: terrarium.uviLevel,
    image: terrarium.image,
    autoTemp: true,
    autoHumidity: true,
    dayNightCycle: true,
    fergusonZone: 1,
    lightOnTime: '06:00',
    lightOffTime: '18:00',
    dayTemperature: terrarium.dayTemperature || terrarium.temperature,
    nightTemperature: terrarium.nightTemperature || (terrarium.temperature - 5),
    dayHumidity: terrarium.dayHumidity || terrarium.humidity,
    nightHumidity: terrarium.nightHumidity || (terrarium.humidity + 10),
    sensorUpdateInterval: '30',
    animal: terrarium.animal
  });

  const [animalInfoOpen, setAnimalInfoOpen] = useState(false);
  const [parameterSettingsOpen, setParameterSettingsOpen] = useState(false);

  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      name: terrarium.name,
      temperature: terrarium.temperature,
      humidity: terrarium.humidity,
      lightLevel: terrarium.lightLevel,
      uviLevel: terrarium.uviLevel,
      image: terrarium.image,
      dayTemperature: terrarium.dayTemperature || terrarium.temperature,
      nightTemperature: terrarium.nightTemperature || (terrarium.temperature - 5),
      dayHumidity: terrarium.dayHumidity || terrarium.humidity,
      nightHumidity: terrarium.nightHumidity || (terrarium.humidity + 10),
      animal: terrarium.animal
    }));
  }, [terrarium]);

  if (!isOpen) return null;

  const handleChange = (field: keyof typeof settings, value: number | boolean | string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(terrarium.id, settings);
  };

  const handleAnimalInfoSave = (updatedAnimal: typeof settings.animal) => {
    setSettings(prev => ({
      ...prev,
      animal: updatedAnimal
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        handleChange('image', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getFergusonZoneDescription = (zone: number) => {
    switch (zone) {
      case 1:
        return "Crepuscular/Shade dweller (UVI 0.6-1.4)";
      case 2:
        return "Partial Sun/Occasional Basker (UVI 1.1-2.4)";
      case 3:
        return "Open/Partial Sun Basker (UVI 2.9-7.4)";
      case 4:
        return "Mid-day Sun Basker (UVI 4.5-9.5)";
      default:
        return "";
    }
  };

  const getRecommendedUVI = (zone: number) => {
    switch (zone) {
      case 1:
        return "0.6-1.4";
      case 2:
        return "1.1-2.4";
      case 3:
        return "2.9-7.4";
      case 4:
        return "4.5-9.5";
      default:
        return "";
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div 
          className="bg-[#1c2936] w-full max-w-md rounded-lg shadow-xl border border-gray-700 max-h-[90vh] flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-700">
            <input
              type="text"
              value={settings.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="text-xl font-bold text-cyan-400 bg-transparent border-b-2 border-transparent hover:border-cyan-400/30 focus:border-cyan-400 outline-none w-full transition-colors"
            />
          </div>
          
          <div className="overflow-y-auto flex-1 p-4">
            <div className="space-y-4">
              <div className="relative group cursor-pointer" onClick={handleImageClick}>
                <img 
                  src={settings.image} 
                  alt={settings.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-white" />
                    <span className="text-white text-sm">Change Background Image</span>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setAnimalInfoOpen(true)}
                  className="flex-1 bg-[#141e2a] hover:bg-[#141e2a]/70 rounded-lg p-3 transition-colors flex items-center justify-center gap-2"
                >
                  <Info className="w-4 h-4 text-cyan-400" />
                  <span className="text-white">Animal Info</span>
                </button>

                <button
                  onClick={() => setParameterSettingsOpen(true)}
                  className="flex-1 bg-[#141e2a] hover:bg-[#141e2a]/70 rounded-lg p-3 transition-colors flex items-center justify-center gap-2"
                >
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span className="text-white">Parameters</span>
                </button>
              </div>

              <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
                <h3 className="text-white font-medium mb-4">Environmental Controls</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm">Temperature Control</span>
                      </div>
                      <button
                        onClick={() => handleChange('autoTemp', !settings.autoTemp)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          settings.autoTemp ? 'bg-cyan-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            settings.autoTemp ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Day Temperature
                        </label>
                        <input
                          type="number"
                          value={settings.dayTemperature}
                          onChange={(e) => handleChange('dayTemperature', parseInt(e.target.value))}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                          disabled={!settings.autoTemp}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Night Temperature
                        </label>
                        <input
                          type="number"
                          value={settings.nightTemperature}
                          onChange={(e) => handleChange('nightTemperature', parseInt(e.target.value))}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                          disabled={!settings.autoTemp}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm">Humidity Control</span>
                      </div>
                      <button
                        onClick={() => handleChange('autoHumidity', !settings.autoHumidity)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          settings.autoHumidity ? 'bg-cyan-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            settings.autoHumidity ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Day Humidity
                        </label>
                        <input
                          type="number"
                          value={settings.dayHumidity}
                          onChange={(e) => handleChange('dayHumidity', parseInt(e.target.value))}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                          disabled={!settings.autoHumidity}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Night Humidity
                        </label>
                        <input
                          type="number"
                          value={settings.nightHumidity}
                          onChange={(e) => handleChange('nightHumidity', parseInt(e.target.value))}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                          disabled={!settings.autoHumidity}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-cyan-400" />
                        <span className="text-white text-sm">Day/Night Cycle</span>
                      </div>
                      <button
                        onClick={() => handleChange('dayNightCycle', !settings.dayNightCycle)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          settings.dayNightCycle ? 'bg-cyan-400' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                            settings.dayNightCycle ? 'translate-x-5' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Lights On
                        </label>
                        <input
                          type="time"
                          value={settings.lightOnTime}
                          onChange={(e) => handleChange('lightOnTime', e.target.value)}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                          disabled={!settings.dayNightCycle}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">
                          Lights Off
                        </label>
                        <input
                          type="time"
                          value={settings.lightOffTime}
                          onChange={(e) => handleChange('lightOffTime', e.target.value)}
                          className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                          disabled={!settings.dayNightCycle}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">UVI Settings</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Ferguson Zone
                      </label>
                      <select
                        value={settings.fergusonZone}
                        onChange={(e) => handleChange('fergusonZone', parseInt(e.target.value))}
                        className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                      >
                        <option value={1}>Zone 1 - {getFergusonZoneDescription(1)}</option>
                        <option value={2}>Zone 2 - {getFergusonZoneDescription(2)}</option>
                        <option value={3}>Zone 3 - {getFergusonZoneDescription(3)}</option>
                        <option value={4}>Zone 4 - {getFergusonZoneDescription(4)}</option>
                      </select>
                      <p className="text-gray-400 text-sm mt-1">
                        Recommended UVI: {getRecommendedUVI(settings.fergusonZone)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">Sensor Settings</span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Update Interval (seconds)
                      </label>
                      <input
                        type="number"
                        value={settings.sensorUpdateInterval}
                        onChange={(e) => handleChange('sensorUpdateInterval', e.target.value)}
                        className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
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
              className="px-4 py-2 rounded-md bg-cyan-500 text-white hover:bg-cyan-400 transition-colors text-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {settings.animal && (
        <AnimalInfoSettingsPopup
          isOpen={animalInfoOpen}
          onClose={() => setAnimalInfoOpen(false)}
          animal={settings.animal}
          onSave={handleAnimalInfoSave}
        />
      )}

      <ParameterSettingsPopup
        isOpen={parameterSettingsOpen}
        onClose={() => setParameterSettingsOpen(false)}
      />
    </>
  );
};

export default TerrariumSettingsPopup;