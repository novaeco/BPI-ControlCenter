import React, { useState, useEffect } from 'react';
import { Sun, Moon, Droplet, Thermometer, Settings2, Power, Wifi, Bluetooth, Settings, Zap, Leaf, FlaskRound as Flask, Gauge, Info, UserCircle2, Network } from 'lucide-react';
import { AquariumType } from './types';
import WifiPopup from './components/WifiPopup';
import BluetoothPopup from './components/BluetoothPopup';
import TerrariumSettingsPopup from './components/TerrariumSettingsPopup';
import GeneralSettingsPopup from './components/GeneralSettingsPopup';
import AnimalInfoPopup from './components/AnimalInfoPopup';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [wifiPopupOpen, setWifiPopupOpen] = useState(false);
  const [bluetoothPopupOpen, setBluetoothPopupOpen] = useState(false);
  const [settingsPopupOpen, setSettingsPopupOpen] = useState(false);
  const [generalSettingsOpen, setGeneralSettingsOpen] = useState(false);
  const [selectedTerrarium, setSelectedTerrarium] = useState<AquariumType | null>(null);
  const [infoPopupOpen, setInfoPopupOpen] = useState<number | null>(null);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [terrariums, setTerrariums] = useState<AquariumType[]>([
    {
      id: 1,
      name: 'Desert Terrarium',
      type: 'desert',
      image: '/images/desert.jpg',
      temperature: 28,
      humidity: 30,
      lightLevel: 80,
      uviLevel: 8,
      isActive: true,
      animal: {
        name: 'Spike',
        species: 'Bearded Dragon (Pogona vitticeps)',
        sex: 'male',
        dateOfBirth: '2022-06-15',
        age: '1.5 years',
        diet: 'Insects, vegetables, fruits',
        activity: 'diurnal',
        habitat: 'terrestrial',
        vetAppointments: [
          {
            id: '1',
            date: '2024-03-15',
            time: '10:00 AM',
            reason: 'Annual checkup',
            notes: 'General health assessment and parasite screening',
            completed: false
          },
          {
            id: '2',
            date: '2023-12-10',
            time: '2:30 PM',
            reason: 'Scale condition check',
            notes: 'All clear, healthy shedding pattern',
            completed: true
          }
        ],
        mealSchedule: [
          {
            id: '1',
            dayOfWeek: 'monday',
            time: '09:00',
            foodType: 'Crickets',
            quantity: '10-12 insects',
            notes: 'Dust with calcium powder'
          },
          {
            id: '2',
            dayOfWeek: 'wednesday',
            time: '09:00',
            foodType: 'Mixed vegetables',
            quantity: '1/4 cup',
            notes: 'Include collard greens and squash'
          },
          {
            id: '3',
            dayOfWeek: 'friday',
            time: '09:00',
            foodType: 'Dubia roaches',
            quantity: '8-10 insects',
            notes: 'Dust with multivitamin powder'
          }
        ],
        careRoutine: [
          {
            id: '1',
            task: 'Clean water dish',
            frequency: 'daily',
            lastPerformed: '2024-02-28',
            notes: 'Use dechlorinated water'
          },
          {
            id: '2',
            task: 'Spot clean enclosure',
            frequency: 'daily',
            lastPerformed: '2024-02-28'
          },
          {
            id: '3',
            task: 'Deep clean enclosure',
            frequency: 'weekly',
            lastPerformed: '2024-02-25',
            nextDue: '2024-03-03',
            notes: 'Replace substrate if needed'
          },
          {
            id: '4',
            task: 'UVB bulb check',
            frequency: 'monthly',
            lastPerformed: '2024-02-01',
            nextDue: '2024-03-01',
            notes: 'Check UVB output with meter'
          }
        ]
      }
    },
    {
      id: 2,
      name: 'Tropical Terrarium',
      type: 'tropical',
      image: '/images/tropical.jpg',
      temperature: 26,
      humidity: 85,
      lightLevel: 70,
      uviLevel: 5,
      isActive: true,
      animal: {
        name: 'Luna',
        species: 'Green Tree Python (Morelia viridis)',
        sex: 'female',
        dateOfBirth: '2021-08-20',
        age: '2.5 years',
        diet: 'Small mammals, birds',
        activity: 'nocturnal',
        habitat: 'arboreal',
        vetAppointments: [
          {
            id: '1',
            date: '2024-04-10',
            time: '3:00 PM',
            reason: 'Regular checkup',
            notes: 'Check for mites and respiratory health',
            completed: false
          }
        ],
        mealSchedule: [
          {
            id: '1',
            dayOfWeek: 'sunday',
            time: '20:00',
            foodType: 'Adult mouse',
            quantity: '1 item',
            notes: 'Pre-killed, properly thawed'
          }
        ],
        careRoutine: [
          {
            id: '1',
            task: 'Mist enclosure',
            frequency: 'daily',
            lastPerformed: '2024-02-28',
            notes: 'Maintain humidity levels'
          },
          {
            id: '2',
            task: 'Check temperature gradient',
            frequency: 'daily',
            lastPerformed: '2024-02-28'
          },
          {
            id: '3',
            task: 'Clean water bowl',
            frequency: 'weekly',
            lastPerformed: '2024-02-25',
            nextDue: '2024-03-03'
          }
        ]
      }
    },
    {
      id: 3,
      name: 'Paludarium',
      type: 'paludarium',
      image: '/images/paludarium.jpg',
      temperature: 25,
      humidity: 90,
      lightLevel: 65,
      uviLevel: 4,
      isActive: false,
      animal: {
        name: 'Neptune',
        species: 'Fire-Bellied Toad (Bombina orientalis)',
        sex: 'male',
        dateOfBirth: '2023-01-10',
        age: '1 year',
        diet: 'Insects, small invertebrates',
        activity: 'diurnal',
        habitat: 'aquatic',
        vetAppointments: [
          {
            id: '1',
            date: '2024-03-20',
            time: '11:30 AM',
            reason: 'Health assessment',
            notes: 'Check skin condition',
            completed: false
          }
        ],
        mealSchedule: [
          {
            id: '1',
            dayOfWeek: 'tuesday',
            time: '10:00',
            foodType: 'Crickets',
            quantity: '4-5 small crickets',
            notes: 'Dust with calcium'
          },
          {
            id: '2',
            dayOfWeek: 'friday',
            time: '10:00',
            foodType: 'Fruit flies',
            quantity: '10-15 flies',
            notes: 'Gut-loaded'
          }
        ],
        careRoutine: [
          {
            id: '1',
            task: 'Water quality check',
            frequency: 'daily',
            lastPerformed: '2024-02-28'
          },
          {
            id: '2',
            task: 'Partial water change',
            frequency: 'weekly',
            lastPerformed: '2024-02-25',
            nextDue: '2024-03-03',
            notes: '25% water change'
          }
        ]
      }
    },
    {
      id: 4,
      name: 'Vivarium',
      type: 'vivarium',
      image: '/images/vivarium.jpg',
      temperature: 24,
      humidity: 80,
      lightLevel: 75,
      uviLevel: 6,
      isActive: true,
      animal: {
        name: 'Jade',
        species: 'Red-Eyed Tree Frog (Agalychnis callidryas)',
        sex: 'female',
        dateOfBirth: '2023-03-15',
        age: '9 months',
        diet: 'Crickets, flies, moths',
        activity: 'nocturnal',
        habitat: 'arboreal',
        vetAppointments: [
          {
            id: '1',
            date: '2024-03-25',
            time: '2:00 PM',
            reason: 'Regular checkup',
            notes: 'Monitor growth rate',
            completed: false
          }
        ],
        mealSchedule: [
          {
            id: '1',
            dayOfWeek: 'monday',
            time: '19:00',
            foodType: 'Crickets',
            quantity: '3-4 crickets',
            notes: 'Small to medium size'
          },
          {
            id: '2',
            dayOfWeek: 'thursday',
            time: '19:00',
            foodType: 'Moths',
            quantity: '2-3 moths',
            notes: 'Captive bred only'
          }
        ],
        careRoutine: [
          {
            id: '1',
            task: 'Mist enclosure',
            frequency: 'daily',
            lastPerformed: '2024-02-28',
            notes: 'Morning and evening'
          },
          {
            id: '2',
            task: 'Check plants',
            frequency: 'weekly',
            lastPerformed: '2024-02-25',
            nextDue: '2024-03-03',
            notes: 'Trim if needed'
          }
        ]
      }
    },
    {
      id: 5,
      name: 'Incubator',
      type: 'incubator',
      image: '/images/incubator.jpg',
      temperature: 30,
      humidity: 85,
      lightLevel: 0,
      uviLevel: 0,
      isActive: true
    },
    {
      id: 6,
      name: 'Aquarium',
      type: 'aquarium',
      image: 'https://images.unsplash.com/photo-1534043464124-3be32fe000c9?auto=format&fit=crop&q=80',
      temperature: 25,
      humidity: 100,
      lightLevel: 60,
      uviLevel: 3,
      isActive: true
    }
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleClickOutside = () => {
    setWifiPopupOpen(false);
    setBluetoothPopupOpen(false);
    setSettingsPopupOpen(false);
    setGeneralSettingsOpen(false);
    setSelectedTerrarium(null);
    setInfoPopupOpen(null);
    setAccountMenuOpen(false);
  };

  const handleSettingsClick = (e: React.MouseEvent, terrarium: AquariumType) => {
    e.stopPropagation();
    setSelectedTerrarium(prev => prev?.id === terrarium.id ? null : terrarium);
    setSettingsPopupOpen(prev => !prev);
  };

  const handleSaveSettings = (id: number, newSettings: Partial<AquariumType>) => {
    setTerrariums(prev => prev.map(terrarium => 
      terrarium.id === id ? { ...terrarium, ...newSettings } : terrarium
    ));
    setSettingsPopupOpen(false);
    setSelectedTerrarium(null);
  };

  const toggleTerrarium = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setTerrariums(prev => prev.map(terrarium => 
      terrarium.id === id ? { ...terrarium, isActive: !terrarium.isActive } : terrarium
    ));
  };

  const handleInfoClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setInfoPopupOpen(prev => prev === id ? null : id);
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setAvatarUrl(newAvatarUrl);
  };

  return (
    <div className="min-h-screen bg-[#0a1119]" onClick={handleClickOutside}>
      <div className="container-fluid py-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAccountMenuOpen(!accountMenuOpen);
                }}
                className="w-8 h-8 rounded-full bg-cyan-400/20 hover:bg-cyan-400/30 transition-colors flex items-center justify-center overflow-hidden"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserCircle2 className="w-6 h-6 text-cyan-400" />
                )}
              </button>

              {accountMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#1c2936] rounded-lg shadow-xl border border-gray-700 py-1 z-50">
                  <button className="w-full px-4 py-2 text-left text-white hover:bg-[#141e2a] transition-colors text-sm">
                    Switch Account
                  </button>
                  <button className="w-full px-4 py-2 text-left text-white hover:bg-[#141e2a] transition-colors text-sm">
                    Sign In
                  </button>
                  <div className="border-t border-gray-700 my-1"></div>
                  <button className="w-full px-4 py-2 text-left text-red-400 hover:bg-[#141e2a] transition-colors text-sm">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
            <h1 className="text-2xl xs:text-3xl md:text-4xl font-bold text-cyan-400 tracking-tight">Novaecosystem</h1>
          </div>
          <div className="flex items-center gap-3 xs:gap-4 flex-wrap justify-center">
            <span className="text-cyan-400 text-sm md:text-base">{formatDate(currentTime)}</span>
            <span className="text-cyan-400 text-sm md:text-base">{formatTime(currentTime)}</span>
            <button
              className="p-1 rounded-md hover:bg-[#1c2936]/60 transition-colors text-gray-600"
            >
              <Network className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setWifiPopupOpen(!wifiPopupOpen);
                  setBluetoothPopupOpen(false);
                  setGeneralSettingsOpen(false);
                }}
                className={`p-1 rounded-md hover:bg-[#1c2936]/60 transition-colors ${wifiEnabled ? 'text-cyan-400' : 'text-gray-600'}`}
              >
                <Wifi className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <WifiPopup
                isOpen={wifiPopupOpen}
                onClose={() => setWifiPopupOpen(false)}
                isEnabled={wifiEnabled}
                onToggle={() => setWifiEnabled(!wifiEnabled)}
              />
            </div>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBluetoothPopupOpen(!bluetoothPopupOpen);
                  setWifiPopupOpen(false);
                  setGeneralSettingsOpen(false);
                }}
                className={`p-1 rounded-md hover:bg-[#1c2936]/60 transition-colors ${bluetoothEnabled ? 'text-cyan-400' : 'text-gray-600'}`}
              >
                <Bluetooth className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <BluetoothPopup
                isOpen={bluetoothPopupOpen}
                onClose={() => setBluetoothPopupOpen(false)}
                isEnabled={bluetoothEnabled}
                onToggle={() => setBluetoothEnabled(!bluetoothEnabled)}
              />
            </div>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGeneralSettingsOpen(!generalSettingsOpen);
                  setWifiPopupOpen(false);
                  setBluetoothPopupOpen(false);
                }}
                className="p-1 rounded-md hover:bg-[#1c2936]/60 transition-colors text-cyan-400"
              >
                <Settings2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <GeneralSettingsPopup
                isOpen={generalSettingsOpen}
                onClose={() => setGeneralSettingsOpen(false)}
                onAvatarUpdate={handleAvatarUpdate}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {terrariums.map((terrarium) => (
            <div key={terrarium.id} className="bg-[#141e2a]/60 rounded-2xl overflow-hidden">
              <div className="relative">
                <img 
                  src={terrarium.image} 
                  alt={terrarium.name}
                  className={`w-full aspect-[4/5] xs:aspect-[3/4] sm:aspect-square lg:aspect-[4/5] object-cover transition-all duration-300 ${!terrarium.isActive ? 'grayscale brightness-50' : ''}`}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#141e2a]/95" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4 sm:mb-6 line-clamp-2 text-balance">{terrarium.name}</h2>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                    <button 
                      onClick={(e) => handleSettingsClick(e, terrarium)}
                      className={`bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-9 rounded-md hover:bg-[#1c2936]/60 transition-colors flex items-center justify-center ${selectedTerrarium?.id === terrarium.id ? 'ring-2 ring-cyan-400' : ''}`}
                    >
                      <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                    </button>
                    <button 
                      onClick={(e) => toggleTerrarium(e, terrarium.id)}
                      className={`bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-9 rounded-md hover:bg-[#1c2936]/60 transition-colors flex items-center justify-center ${terrarium.isActive ? 'ring-2 ring-green-400' : ''}`}
                    >
                      <Power className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${terrarium.isActive ? 'text-green-400' : 'text-gray-400'}`} />
                    </button>
                    <div className="relative">
                      <button 
                        onClick={(e) => handleInfoClick(e, terrarium.id)}
                        className={`w-full bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-9 rounded-md hover:bg-[#1c2936]/60 transition-colors flex items-center justify-center ${infoPopupOpen === terrarium.id ? 'ring-2 ring-cyan-400' : ''}`}
                      >
                        <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                      </button>
                      {terrarium.animal && infoPopupOpen === terrarium.id && (
                        <AnimalInfoPopup
                          isOpen={true}
                          onClose={() => setInfoPopupOpen(null)}
                          animal={terrarium.animal}
                        />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-3 mt-1.5 sm:mt-3">
                    <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-9 rounded-md flex items-center justify-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                      <span className="text-[10px] sm:text-xs text-cyan-400">{terrarium.temperature}°</span>
                    </div>
                    <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-9 rounded-md flex items-center justify-center gap-1">
                      <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                      <span className="text-[10px] sm:text-xs text-cyan-400">{terrarium.humidity}%</span>
                    </div>
                    <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-9 rounded-md flex items-center justify-center gap-1">
                      <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                      <span className="text-[10px] sm:text-xs text-cyan-400">{terrarium.lightLevel}%</span>
                    </div>
                    <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-9 rounded-md flex items-center justify-center gap-1">
                      <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                      <span className="text-[10px] sm:text-xs text-cyan-400">72%</span>
                    </div>
                    <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-9 rounded-md flex items-center justify-center gap-1">
                      <Gauge className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                      <span className="text-[10px] sm:text-xs text-cyan-400">85%</span>
                    </div>
                    <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-9 rounded-md flex items-center justify-center gap-1">
                      <Flask className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                      <span className="text-[10px] sm:text-xs text-cyan-400">92%</span>
                    </div>
                    <div className="bg-[#1c2936]/80 backdrop-blur-sm h-7 sm:h-9 rounded-md flex items-center justify-center gap-1">
                      <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                      <span className="text-[10px] sm:text-xs text-cyan-400">6.8</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-3 mt-1.5 sm:mt-1">
                    <div className="text-center text-[10px] sm:text-xs text-gray-400">Temp</div>
                    <div className="text-center text-[10px] sm:text-xs text-gray-400">Humid</div>
                    <div className="text-center text-[10px] sm:text-xs text-gray-400">Light</div>
                    <div className="text-center text-[10px] sm:text-xs text-gray-400">Soil</div>
                    <div className="text-center text-[10px] sm:text-xs text-gray-400">Air</div>
                    <div className="text-center text-[10px] sm:text-xs text-gray-400">Water</div>
                    <div className="text-center text-[10px] sm:text-xs text-gray-400">EC</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedTerrarium && (
        <TerrariumSettingsPopup
          isOpen={settingsPopupOpen}
          onClose={() => {
            setSettingsPopupOpen(false);
            setSelectedTerrarium(null);
          }}
          terrarium={selectedTerrarium}
          onSave={handleSaveSettings}
        />
      )}
    </div>
  );
}

export default App;