import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Settings2, Package, CheckCircle2, XCircle, RefreshCw, Power, Cpu, Printer, Notebook as Robot, Home, Leaf } from 'lucide-react';

interface Module {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'disabled' | 'error';
  description: string;
  author: string;
  dependencies: string[];
  enabled: boolean;
  configurable: boolean;
}

interface ModuleSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockModules: Module[] = [
  {
    id: 'climate-control',
    name: 'Climate Control',
    version: '1.2.0',
    status: 'active',
    description: 'Advanced climate control system for terrariums',
    author: 'EcoTech',
    dependencies: ['core', 'sensors'],
    enabled: true,
    configurable: true
  },
  {
    id: 'lighting',
    name: 'Smart Lighting',
    version: '2.1.0',
    status: 'active',
    description: 'Intelligent lighting control with day/night cycles',
    author: 'LightSys',
    dependencies: ['core'],
    enabled: true,
    configurable: true
  },
  {
    id: 'water-management',
    name: 'Water Management',
    version: '1.0.5',
    status: 'disabled',
    description: 'Automated water quality monitoring and control',
    author: 'AquaTech',
    dependencies: ['core', 'sensors'],
    enabled: false,
    configurable: true
  },
  {
    id: 'feeding-system',
    name: 'Feeding System',
    version: '1.1.0',
    status: 'error',
    description: 'Automated feeding schedule management',
    author: 'PetCare',
    dependencies: ['core'],
    enabled: true,
    configurable: true
  },
  // CNC Modules
  {
    id: 'cnc-control',
    name: 'CNC Control',
    version: '1.0.0',
    status: 'active',
    description: 'Core CNC machine control and G-code interpretation',
    author: 'MachineTech',
    dependencies: ['core'],
    enabled: true,
    configurable: true
  },
  {
    id: 'cnc-toolpath',
    name: 'CNC Toolpath',
    version: '1.1.0',
    status: 'active',
    description: 'Advanced toolpath generation and optimization',
    author: 'MachineTech',
    dependencies: ['core', 'cnc-control'],
    enabled: true,
    configurable: true
  },
  // Robotics Modules
  {
    id: 'robot-control',
    name: 'Robot Control',
    version: '2.0.0',
    status: 'active',
    description: 'Core robotics control system',
    author: 'RoboSys',
    dependencies: ['core'],
    enabled: true,
    configurable: true
  },
  {
    id: 'robot-vision',
    name: 'Robot Vision',
    version: '1.5.0',
    status: 'active',
    description: 'Computer vision system for robotics',
    author: 'RoboSys',
    dependencies: ['core', 'robot-control'],
    enabled: true,
    configurable: true
  },
  // Home Automation Modules
  {
    id: 'home-control',
    name: 'Home Control',
    version: '2.1.0',
    status: 'active',
    description: 'Central home automation control system',
    author: 'SmartHome',
    dependencies: ['core'],
    enabled: true,
    configurable: true
  },
  {
    id: 'smart-security',
    name: 'Smart Security',
    version: '1.8.0',
    status: 'active',
    description: 'Integrated security and monitoring system',
    author: 'SmartHome',
    dependencies: ['core', 'home-control'],
    enabled: true,
    configurable: true
  },
  // Greenhouse Modules
  {
    id: 'greenhouse-control',
    name: 'Greenhouse Control',
    version: '1.3.0',
    status: 'active',
    description: 'Central greenhouse management system',
    author: 'GreenTech',
    dependencies: ['core'],
    enabled: true,
    configurable: true
  },
  {
    id: 'crop-management',
    name: 'Crop Management',
    version: '1.2.0',
    status: 'active',
    description: 'Crop monitoring and optimization system',
    author: 'GreenTech',
    dependencies: ['core', 'greenhouse-control'],
    enabled: true,
    configurable: true
  },
  // 3D Printing Modules
  {
    id: 'printer-control',
    name: '3D Printer Control',
    version: '2.0.0',
    status: 'active',
    description: 'Core 3D printer control system',
    author: 'PrintTech',
    dependencies: ['core'],
    enabled: true,
    configurable: true
  },
  {
    id: 'slicer',
    name: 'Print Slicer',
    version: '1.7.0',
    status: 'active',
    description: 'Advanced 3D model slicing engine',
    author: 'PrintTech',
    dependencies: ['core', 'printer-control'],
    enabled: true,
    configurable: true
  }
];

const ModuleSettingsPopup: React.FC<ModuleSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [modules, setModules] = useState<Module[]>(mockModules);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  if (!isOpen) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'disabled':
        return <XCircle className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const handleModuleToggle = async (moduleId: string) => {
    setIsInstalling(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setModules(prev => prev.map(module => {
      if (module.id === moduleId) {
        const newEnabled = !module.enabled;
        return {
          ...module,
          enabled: newEnabled,
          status: newEnabled ? 'active' : 'disabled'
        };
      }
      return module;
    }));
    
    setIsInstalling(false);
  };

  const categories = [
    { id: 'all', name: 'All Modules', icon: Package },
    { id: 'terrarium', name: 'Terrarium', icon: Leaf },
    { id: 'cnc', name: 'CNC', icon: Cpu },
    { id: 'robotics', name: 'Robotics', icon: Robot },
    { id: 'home', name: 'Home Automation', icon: Home },
    { id: 'greenhouse', name: 'Greenhouse', icon: Leaf },
    { id: '3dprinting', name: '3D Printing', icon: Printer }
  ];

  const getCategoryModules = (category: string) => {
    if (category === 'all') return modules;
    const categoryMap: { [key: string]: string[] } = {
      terrarium: ['climate-control', 'lighting', 'water-management', 'feeding-system'],
      cnc: ['cnc-control', 'cnc-toolpath'],
      robotics: ['robot-control', 'robot-vision'],
      home: ['home-control', 'smart-security'],
      greenhouse: ['greenhouse-control', 'crop-management'],
      '3dprinting': ['printer-control', 'slicer']
    };
    return modules.filter(module => categoryMap[category]?.includes(module.id));
  };

  const filteredModules = getCategoryModules(selectedCategory).filter(module =>
    module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    module.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-4xl rounded-lg shadow-xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">Module Management</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
            />
            <button className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-400 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Install New Module
            </button>
          </div>
        </div>

        <div className="flex border-b border-gray-700 overflow-x-auto">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`p-3 flex items-center gap-2 whitespace-nowrap transition-colors ${
                selectedCategory === category.id
                  ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400'
                  : 'text-gray-400 hover:bg-[#141e2a]/50'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredModules.map((module) => (
              <div
                key={module.id}
                className={`bg-[#141e2a] rounded-lg p-4 border border-gray-700 transition-opacity duration-200 ${
                  !module.enabled ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-medium flex items-center gap-2">
                      {module.name}
                      <span className="text-xs text-gray-400">v{module.version}</span>
                    </h3>
                    <p className="text-gray-400 text-sm">{module.description}</p>
                  </div>
                  {getStatusIcon(module.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Author</span>
                    <span className="text-white">{module.author}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Dependencies</span>
                    <span className="text-white">{module.dependencies.join(', ')}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleModuleToggle(module.id)}
                    disabled={isInstalling}
                    className={`
                      flex-1 py-2 px-4 rounded-md text-sm transition-colors
                      flex items-center justify-center gap-2
                      ${module.enabled
                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }
                      ${isInstalling ? 'cursor-wait opacity-70' : ''}
                    `}
                  >
                    {isInstalling ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {module.enabled ? 'Disabling...' : 'Enabling...'}
                      </>
                    ) : (
                      <>
                        <Power className="w-4 h-4" />
                        {module.enabled ? 'Disable' : 'Enable'}
                      </>
                    )}
                  </button>
                  {module.configurable && (
                    <button 
                      className={`
                        flex-1 py-2 px-4 rounded-md text-sm
                        flex items-center justify-center gap-2
                        ${module.enabled
                          ? 'bg-[#1c2936] hover:bg-[#1c2936]/70 text-cyan-400'
                          : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                        }
                      `}
                      disabled={!module.enabled}
                      onClick={() => setSelectedModule(module)}
                    >
                      <Settings2 className="w-4 h-4" />
                      Configure
                    </button>
                  )}
                  <button 
                    className="py-2 px-4 rounded-md text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm"
          >
            Close
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

export default ModuleSettingsPopup;