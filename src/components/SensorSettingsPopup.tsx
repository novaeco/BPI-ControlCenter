import React, { useState } from 'react';
import { X, Save, RefreshCw, Clock, Activity, AlertTriangle, CheckCircle2, Droplet, Thermometer, Sun, Wind, CloudRain, Waves, Gauge, FlaskRound as Flask, Leaf, Power, Zap, Egg, Fish } from 'lucide-react';

interface SensorInfo {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'warning' | 'error' | 'disabled';
  uptime: string;
  lastCalibration: string;
  accuracy: number;
  habitat: 'desert' | 'tropical' | 'paludarium' | 'vivarium' | 'incubator' | 'aquarium';
  enabled: boolean;
}

interface SensorSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockSensors: SensorInfo[] = [
  // Desert Terrarium Sensors
  {
    id: 'dt-temp1',
    name: 'Desert Temperature Primary',
    type: 'MAX31856',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 99.1,
    habitat: 'desert',
    enabled: true
  },
  {
    id: 'dt-temp2',
    name: 'Desert Temperature Secondary',
    type: 'DS18B20',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.5,
    habitat: 'desert',
    enabled: true
  },
  {
    id: 'dt-hum',
    name: 'Desert Humidity',
    type: 'BME280',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 97.8,
    habitat: 'desert',
    enabled: true
  },
  {
    id: 'dt-uv',
    name: 'Desert UV Intensity',
    type: 'VEML6075',
    status: 'warning',
    uptime: '30 days',
    lastCalibration: '2024-01-10',
    accuracy: 95.2,
    habitat: 'desert',
    enabled: true
  },
  {
    id: 'dt-soil',
    name: 'Desert Soil Moisture',
    type: 'SEN0193',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.0,
    habitat: 'desert',
    enabled: true
  },
  {
    id: 'dt-air',
    name: 'Desert Air Quality',
    type: 'PMS5003',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 97.5,
    habitat: 'desert',
    enabled: true
  },

  // Tropical Terrarium Sensors
  {
    id: 'tt-temp',
    name: 'Temperature',
    type: 'SHT31-D',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.9,
    habitat: 'tropical',
    enabled: true
  },
  {
    id: 'tt-humidity',
    name: 'Humidity',
    type: 'SHT31-D',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.5,
    habitat: 'tropical',
    enabled: true
  },
  {
    id: 'tt-soil-moisture',
    name: 'Soil Moisture',
    type: 'SEN0193',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.2,
    habitat: 'tropical',
    enabled: true
  },
  {
    id: 'tt-air-quality',
    name: 'Air Quality',
    type: 'CCS811',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 97.0,
    habitat: 'tropical',
    enabled: true
  },
  {
    id: 'tt-water-quality',
    name: 'Water Quality',
    type: 'Atlas ORP',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 97.8,
    habitat: 'tropical',
    enabled: true
  },
  {
    id: 'tt-ph',
    name: 'pH Level',
    type: 'Atlas pH',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.3,
    habitat: 'tropical',
    enabled: true
  },
  {
    id: 'tt-ec',
    name: 'EC Level',
    type: 'Atlas EC',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.1,
    habitat: 'tropical',
    enabled: true
  },

  // Paludarium Sensors
  {
    id: 'p-water-temp',
    name: 'Water Temperature',
    type: 'DS18B20',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 99.2,
    habitat: 'paludarium',
    enabled: true
  },
  {
    id: 'p-air-temp',
    name: 'Air Temperature',
    type: 'BME280',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.8,
    habitat: 'paludarium',
    enabled: true
  },
  {
    id: 'p-water-level',
    name: 'Water Level',
    type: 'HC-SR04',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 97.5,
    habitat: 'paludarium',
    enabled: true
  },
  {
    id: 'p-ph',
    name: 'Water pH',
    type: 'Atlas pH',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.5,
    habitat: 'paludarium',
    enabled: true
  },
  {
    id: 'p-ec',
    name: 'Water EC',
    type: 'Atlas EC',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.0,
    habitat: 'paludarium',
    enabled: true
  },
  {
    id: 'p-water-quality',
    name: 'Water Quality',
    type: 'Atlas ORP',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 97.8,
    habitat: 'paludarium',
    enabled: true
  },
  {
    id: 'p-air-quality',
    name: 'Air Quality',
    type: 'BME680',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 97.0,
    habitat: 'paludarium',
    enabled: true
  },

  // Vivarium Sensors
  {
    id: 'v-temp',
    name: 'Temperature',
    type: 'DHT22',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.4,
    habitat: 'vivarium',
    enabled: true
  },
  {
    id: 'v-humidity',
    name: 'Humidity',
    type: 'DHT22',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.0,
    habitat: 'vivarium',
    enabled: true
  },
  {
    id: 'v-soil-moisture',
    name: 'Soil Moisture',
    type: 'SEN0193',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.5,
    habitat: 'vivarium',
    enabled: true
  },
  {
    id: 'v-air-quality',
    name: 'Air Quality',
    type: 'SGP30',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 97.5,
    habitat: 'vivarium',
    enabled: true
  },
  {
    id: 'v-water-quality',
    name: 'Water Quality',
    type: 'Atlas ORP',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 97.8,
    habitat: 'vivarium',
    enabled: true
  },
  {
    id: 'v-ph',
    name: 'pH Level',
    type: 'Atlas pH',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 97.2,
    habitat: 'vivarium',
    enabled: true
  },
  {
    id: 'v-ec',
    name: 'EC Level',
    type: 'Atlas EC',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 96.8,
    habitat: 'vivarium',
    enabled: true
  },

  // Incubator Sensors
  {
    id: 'inc-temp1',
    name: 'Incubator Temperature Primary',
    type: 'MAX31856',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 99.8,
    habitat: 'incubator',
    enabled: true
  },
  {
    id: 'inc-temp2',
    name: 'Incubator Temperature Secondary',
    type: 'DS18B20',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 99.5,
    habitat: 'incubator',
    enabled: true
  },
  {
    id: 'inc-hum',
    name: 'Incubator Humidity',
    type: 'BME280',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 99.0,
    habitat: 'incubator',
    enabled: true
  },
  {
    id: 'inc-co2',
    name: 'Incubator CO2',
    type: 'MH-Z19B',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.5,
    habitat: 'incubator',
    enabled: true
  },
  {
    id: 'inc-pressure',
    name: 'Incubator Pressure',
    type: 'BMP280',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.0,
    habitat: 'incubator',
    enabled: true
  },

  // Aquarium Sensors
  {
    id: 'aq-temp',
    name: 'Water Temperature',
    type: 'DS18B20',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 99.2,
    habitat: 'aquarium',
    enabled: true
  },
  {
    id: 'aq-ph',
    name: 'pH Level',
    type: 'Atlas pH',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.8,
    habitat: 'aquarium',
    enabled: true
  },
  {
    id: 'aq-ec',
    name: 'Conductivity',
    type: 'Atlas EC',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.5,
    habitat: 'aquarium',
    enabled: true
  },
  {
    id: 'aq-orp',
    name: 'ORP',
    type: 'Atlas ORP',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 98.0,
    habitat: 'aquarium',
    enabled: true
  },
  {
    id: 'aq-do',
    name: 'Dissolved Oxygen',
    type: 'Atlas DO',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 97.5,
    habitat: 'aquarium',
    enabled: true
  },
  {
    id: 'aq-level',
    name: 'Water Level',
    type: 'HC-SR04',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 97.0,
    habitat: 'aquarium',
    enabled: true
  },
  {
    id: 'aq-flow',
    name: 'Water Flow',
    type: 'YF-S201',
    status: 'active',
    uptime: '45 days',
    lastCalibration: '2024-02-15',
    accuracy: 96.5,
    habitat: 'aquarium',
    enabled: true
  }
];

const SensorSettingsPopup: React.FC<SensorSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [selectedHabitat, setSelectedHabitat] = useState<'desert' | 'tropical' | 'paludarium' | 'vivarium' | 'incubator' | 'aquarium'>('desert');
  const [sensors, setSensors] = useState(mockSensors);
  const [activationInProgress, setActivationInProgress] = useState<string | null>(null);

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      case 'disabled':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'disabled':
        return <Power className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getHabitatIcon = (habitat: string) => {
    switch (habitat) {
      case 'desert':
        return <Sun className="w-4 h-4" />;
      case 'tropical':
        return <CloudRain className="w-4 h-4" />;
      case 'paludarium':
        return <Waves className="w-4 h-4" />;
      case 'vivarium':
        return <Wind className="w-4 h-4" />;
      case 'incubator':
        return <Egg className="w-4 h-4" />;
      case 'aquarium':
        return <Fish className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const toggleSensor = async (sensorId: string) => {
    setActivationInProgress(sensorId);
    
    // Simulate activation/deactivation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSensors(prev => prev.map(sensor => {
      if (sensor.id === sensorId) {
        const newEnabled = !sensor.enabled;
        return {
          ...sensor,
          enabled: newEnabled,
          status: newEnabled ? 'active' : 'disabled',
          uptime: newEnabled ? '0 days' : sensor.uptime
        };
      }
      return sensor;
    }));
    
    setActivationInProgress(null);
  };

  const filteredSensors = sensors.filter(sensor => sensor.habitat === selectedHabitat);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-4xl rounded-lg shadow-xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-cyan-400">Sensor Management</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setSelectedHabitat('desert')}
            className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              selectedHabitat === 'desert' 
                ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-gray-400 hover:bg-[#141e2a]/50'
            }`}
          >
            <Sun className="w-4 h-4" />
            Desert Terra
          </button>
          <button
            onClick={() => setSelectedHabitat('tropical')}
            className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              selectedHabitat === 'tropical'
                ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:bg-[#141e2a]/50'
            }`}
          >
            <CloudRain className="w-4 h-4" />
            Tropical Terra
          </button>
          <button
            onClick={() => setSelectedHabitat('paludarium')}
            className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              selectedHabitat === 'paludarium'
                ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:bg-[#141e2a]/50'
            }`}
          >
            <Waves className="w-4 h-4" />
            Paludarium
          </button>
          <button
            onClick={() => setSelectedHabitat('vivarium')}
            className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              selectedHabitat === 'vivarium'
                ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:bg-[#141e2a]/50'
            }`}
          >
            <Wind className="w-4 h-4" />
            Vivarium
          </button>
        </div>

        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setSelectedHabitat('incubator')}
            className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              selectedHabitat === 'incubator'
                ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:bg-[#141e2a]/50'
            }`}
          >
            <Egg className="w-4 h-4" />
            Incubator
          </button>
          <button
            onClick={() => setSelectedHabitat('aquarium')}
            className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
              selectedHabitat === 'aquarium'
                ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:bg-[#141e2a]/50'
            }`}
          >
            <Fish className="w-4 h-4" />
            Aquarium
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSensors.map((sensor) => (
              <div
                key={sensor.id}
                className={`bg-[#141e2a] rounded-lg p-4 border border-gray-700 transition-opacity duration-200 ${
                  !sensor.enabled ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium">{sensor.name}</h3>
                    <p className="text-gray-400 text-sm">Type: {sensor.type}</p>
                  </div>
                  {getStatusIcon(sensor.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>Uptime</span>
                    </div>
                    <span className="text-white">{sensor.uptime}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <RefreshCw className="w-4 h-4" />
                      <span>Last Calibration</span>
                    </div>
                    <span className="text-white">{sensor.lastCalibration}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Activity className="w-4 h-4" />
                      <span>Accuracy</span>
                    </div>
                    <span className={`font-medium ${getStatusColor(sensor.status)}`}>
                      {sensor.accuracy}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button 
                    onClick={() => toggleSensor(sensor.id)}
                    disabled={activationInProgress === sensor.id}
                    className={`
                      flex-1 py-2 px-4 rounded-md text-sm transition-colors
                      flex items-center justify-center gap-2
                      ${sensor.enabled
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }
                      ${activationInProgress === sensor.id ? 'cursor-wait opacity-70' : ''}
                    `}
                  >
                    {activationInProgress === sensor.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {sensor.enabled ? 'Deactivating...' : 'Activating...'}
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4" />
                        {sensor.enabled ? 'Deactivate' : 'Activate'}
                      </>
                    )}
                  </button>
                  <button 
                    className={`
                      flex-1 py-2 px-4 rounded-md text-sm
                      flex items-center justify-center gap-2
                      ${sensor.enabled
                        ? 'bg-[#1c2936] hover:bg-[#1c2936]/70 text-cyan-400'
                        : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      }
                    `}
                    disabled={!sensor.enabled}
                  >
                    <Zap className="w-4 h-4" />
                    Calibrate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorSettingsPopup;