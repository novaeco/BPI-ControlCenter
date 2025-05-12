import React, { useState } from 'react';
import { X, Save, Usb, RefreshCw } from 'lucide-react';

interface USBSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface USBDevice {
  id: string;
  name: string;
  vendorId: string;
  productId: string;
  serialNumber: string;
  connected: boolean;
}

interface USBConfig {
  selectedDevice: string;
  powerManagement: boolean;
  highSpeed: boolean;
  autoConnect: boolean;
}

const mockDevices: USBDevice[] = [
  {
    id: '1',
    name: 'Arduino Uno',
    vendorId: '2341',
    productId: '0043',
    serialNumber: 'A12345678',
    connected: true
  },
  {
    id: '2',
    name: 'USB-C Hub',
    vendorId: '8087',
    productId: '0024',
    serialNumber: 'H87654321',
    connected: true
  },
  {
    id: '3',
    name: 'External SSD',
    vendorId: '0781',
    productId: '5590',
    serialNumber: 'S98765432',
    connected: false
  }
];

const USBSettingsPopup: React.FC<USBSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [devices, setDevices] = useState<USBDevice[]>(mockDevices);
  const [config, setConfig] = useState<USBConfig>({
    selectedDevice: '',
    powerManagement: true,
    highSpeed: true,
    autoConnect: true
  });
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof USBConfig, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log('Saving USB configuration:', config);
    onClose();
  };

  const handleScan = async () => {
    setIsScanning(true);
    // Simulate device scanning
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsScanning(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-md rounded-lg shadow-xl border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Usb className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">USB Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">Connected Devices</h3>
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="px-3 py-1.5 bg-cyan-500 text-white rounded-md hover:bg-cyan-400 transition-colors text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Scan Devices
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {devices.map(device => (
                <div
                  key={device.id}
                  className={`p-3 rounded-lg ${
                    config.selectedDevice === device.id
                      ? 'bg-cyan-400/10 border border-cyan-400'
                      : 'bg-[#141e2a] border border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">{device.name}</div>
                      <div className="text-gray-400 text-sm">
                        VID: {device.vendorId} | PID: {device.productId}
                      </div>
                      <div className="text-gray-400 text-sm">
                        S/N: {device.serialNumber}
                      </div>
                    </div>
                    <button
                      onClick={() => handleChange('selectedDevice', device.id)}
                      className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                        config.selectedDevice === device.id
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {config.selectedDevice === device.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">USB Power Management</span>
                <button
                  onClick={() => handleChange('powerManagement', !config.powerManagement)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.powerManagement ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.powerManagement ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">High-Speed Mode</span>
                <button
                  onClick={() => handleChange('highSpeed', !config.highSpeed)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.highSpeed ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.highSpeed ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-white text-sm">Auto-Connect Devices</span>
                <button
                  onClick={() => handleChange('autoConnect', !config.autoConnect)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    config.autoConnect ? 'bg-cyan-400' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                      config.autoConnect ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
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

export default USBSettingsPopup;