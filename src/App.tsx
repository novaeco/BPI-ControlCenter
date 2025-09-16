import React, { useState, useEffect } from 'react';
import { UserCircle2 } from 'lucide-react';
import { AquariumType } from './types';
import WifiPopup from './components/WifiPopup';
import BluetoothPopup from './components/BluetoothPopup';
import TerrariumSettingsPopup from './components/TerrariumSettingsPopup';
import GeneralSettingsPopup from './components/GeneralSettingsPopup';
import AnimalInfoPopup from './components/AnimalInfoPopup';
import { DragDropProvider } from './components/DragDropProvider';
import MobileOptimizedHeader from './components/MobileOptimizedHeader';
import TerrariumCard from './components/TerrariumCard';
import { ViewMode } from './components/ViewToggle';
import { loadFromLocalStorage, saveToLocalStorage } from './utils/localStorage';

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
  const [viewMode, setViewMode] = useState<ViewMode>(() => 
    loadFromLocalStorage<ViewMode>('viewMode', 'grid')
  );
  const [showAll, setShowAll] = useState(() => 
    loadFromLocalStorage<boolean>('showAll', true)
  );

  const [terrariums, setTerrariums] = useState<AquariumType[]>(() => 
    loadFromLocalStorage<AquariumType[]>('terrariumOrder', [
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
  ])
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sauvegarder l'ordre des terrariums
  useEffect(() => {
    saveToLocalStorage('terrariumOrder', terrariums);
  }, [terrariums]);

  // Sauvegarder les préférences de vue
  useEffect(() => {
    saveToLocalStorage('viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    saveToLocalStorage('showAll', showAll);
  }, [showAll]);

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

  const handleReorderTerrariums = (fromIndex: number, toIndex: number) => {
    const newTerrariums = [...terrariums];
    const [movedItem] = newTerrariums.splice(fromIndex, 1);
    newTerrariums.splice(toIndex, 0, movedItem);
    setTerrariums(newTerrariums);
  };

  const filteredTerrariums = showAll 
    ? terrariums 
    : terrariums.filter(terrarium => terrarium.isActive);

  const getGridClasses = () => {
    if (viewMode === 'list') {
      return 'grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6';
    }
    return 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6';
  };
  return (
    <DragDropProvider>
      <div className="min-h-screen bg-[#0a1119]" onClick={handleClickOutside}>
        <div className="container-fluid py-3 sm:py-4 lg:py-6">
          <MobileOptimizedHeader
            currentTime={currentTime}
            avatarUrl={avatarUrl}
            accountMenuOpen={accountMenuOpen}
            onAccountToggle={(e) => {
              e.stopPropagation();
              setAccountMenuOpen(!accountMenuOpen);
            }}
            onNetworkClick={() => {}}
            wifiEnabled={wifiEnabled}
            onWifiToggle={(e) => {
              e.stopPropagation();
              setWifiPopupOpen(!wifiPopupOpen);
              setBluetoothPopupOpen(false);
              setGeneralSettingsOpen(false);
            }}
            bluetoothEnabled={bluetoothEnabled}
            onBluetoothToggle={(e) => {
              e.stopPropagation();
              setBluetoothPopupOpen(!bluetoothPopupOpen);
              setWifiPopupOpen(false);
              setGeneralSettingsOpen(false);
            }}
            onGeneralSettingsToggle={(e) => {
              e.stopPropagation();
              setGeneralSettingsOpen(!generalSettingsOpen);
              setWifiPopupOpen(false);
              setBluetoothPopupOpen(false);
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            showAll={showAll}
            onShowAllChange={setShowAll}
          />

          <div className={getGridClasses()}>
            {filteredTerrariums.map((terrarium, index) => (
              <div key={terrarium.id}>
                <TerrariumCard
                  terrarium={terrarium}
                  viewMode={viewMode}
                  index={index}
                  onSettingsClick={handleSettingsClick}
                  onToggle={toggleTerrarium}
                  onInfoClick={handleInfoClick}
                  selectedTerrarium={selectedTerrarium}
                  infoPopupOpen={infoPopupOpen}
                  onReorder={handleReorderTerrariums}
                />
                {terrarium.animal && infoPopupOpen === terrarium.id && (
                  <AnimalInfoPopup
                    isOpen={true}
                    onClose={() => setInfoPopupOpen(null)}
                    animal={terrarium.animal}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Popups */}
        <WifiPopup
          isOpen={wifiPopupOpen}
          onClose={() => setWifiPopupOpen(false)}
          isEnabled={wifiEnabled}
          onToggle={() => setWifiEnabled(!wifiEnabled)}
        />
        
        <BluetoothPopup
          isOpen={bluetoothPopupOpen}
          onClose={() => setBluetoothPopupOpen(false)}
          isEnabled={bluetoothEnabled}
          onToggle={() => setBluetoothEnabled(!bluetoothEnabled)}
        />
        
        <GeneralSettingsPopup
          isOpen={generalSettingsOpen}
          onClose={() => setGeneralSettingsOpen(false)}
          onAvatarUpdate={handleAvatarUpdate}
        />

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
    </DragDropProvider>
  );
}

export default App;