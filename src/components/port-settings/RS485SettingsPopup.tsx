import React, { useState } from 'react';
import { X, Save, Cable } from 'lucide-react';

interface RS485SettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RS485Config {
  enabled: boolean;
  mode: 'rs485' | 'modbus-rtu' | 'modbus-ascii';
  baudRate: string;
  dataBits: string;
  stopBits: string;
  parity: string;
  flowControl: string;
  rtsMode: string;
  terminationResistor: boolean;
  modbus: {
    address: string;
    timeout: string;
    retries: string;
    interFrameDelay: string;
    responseDelay: string;
  };
  rs485: {
    preTransmitDelay: string;
    postTransmitDelay: string;
    receiveTimeout: string;
    turnaroundDelay: string;
  };
  errorHandling: {
    crcCheck: boolean;
    frameCheck: boolean;
    parityCheck: boolean;
    overrunDetection: boolean;
  };
}

const RS485SettingsPopup: React.FC<RS485SettingsPopupProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<RS485Config>({
    enabled: true,
    mode: 'rs485',
    baudRate: '9600',
    dataBits: '8',
    stopBits: '1',
    parity: 'none',
    flowControl: 'none',
    rtsMode: 'normal',
    terminationResistor: true,
    modbus: {
      address: '1',
      timeout: '1000',
      retries: '3',
      interFrameDelay: '3.5',
      responseDelay: '0'
    },
    rs485: {
      preTransmitDelay: '0',
      postTransmitDelay: '0',
      receiveTimeout: '1000',
      turnaroundDelay: '0'
    },
    errorHandling: {
      crcCheck: true,
      frameCheck: true,
      parityCheck: true,
      overrunDetection: true
    }
  });

  if (!isOpen) return null;

  const handleChange = (field: keyof RS485Config, value: string | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleModbusChange = (field: keyof RS485Config['modbus'], value: string) => {
    setConfig(prev => ({
      ...prev,
      modbus: {
        ...prev.modbus,
        [field]: value
      }
    }));
  };

  const handleRS485Change = (field: keyof RS485Config['rs485'], value: string) => {
    setConfig(prev => ({
      ...prev,
      rs485: {
        ...prev.rs485,
        [field]: value
      }
    }));
  };

  const handleErrorHandlingChange = (field: keyof RS485Config['errorHandling'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      errorHandling: {
        ...prev.errorHandling,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    console.log('Saving RS485/Modbus configuration:', config);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-[90rem] rounded-lg shadow-xl border border-gray-700 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Cable className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400">RS485/Modbus Configuration</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Basic Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Enable RS485/Modbus</span>
                  <button
                    onClick={() => handleChange('enabled', !config.enabled)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.enabled ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.enabled ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Mode
                  </label>
                  <select
                    value={config.mode}
                    onChange={(e) => handleChange('mode', e.target.value as RS485Config['mode'])}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="rs485">RS485</option>
                    <option value="modbus-rtu">Modbus RTU</option>
                    <option value="modbus-ascii">Modbus ASCII</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Baud Rate
                  </label>
                  <select
                    value={config.baudRate}
                    onChange={(e) => handleChange('baudRate', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1200">1200</option>
                    <option value="2400">2400</option>
                    <option value="4800">4800</option>
                    <option value="9600">9600</option>
                    <option value="19200">19200</option>
                    <option value="38400">38400</option>
                    <option value="57600">57600</option>
                    <option value="115200">115200</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Data Bits
                  </label>
                  <select
                    value={config.dataBits}
                    onChange={(e) => handleChange('dataBits', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="7">7 bits</option>
                    <option value="8">8 bits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Stop Bits
                  </label>
                  <select
                    value={config.stopBits}
                    onChange={(e) => handleChange('stopBits', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="1">1 bit</option>
                    <option value="2">2 bits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Parity
                  </label>
                  <select
                    value={config.parity}
                    onChange={(e) => handleChange('parity', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="none">None</option>
                    <option value="even">Even</option>
                    <option value="odd">Odd</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">RS485 Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Flow Control
                  </label>
                  <select
                    value={config.flowControl}
                    onChange={(e) => handleChange('flowControl', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="none">None</option>
                    <option value="rts/cts">RTS/CTS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    RTS Mode
                  </label>
                  <select
                    value={config.rtsMode}
                    onChange={(e) => handleChange('rtsMode', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="normal">Normal</option>
                    <option value="inverted">Inverted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Pre-transmit Delay (ms)
                  </label>
                  <input
                    type="number"
                    value={config.rs485.preTransmitDelay}
                    onChange={(e) => handleRS485Change('preTransmitDelay', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    min="0"
                    max="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Post-transmit Delay (ms)
                  </label>
                  <input
                    type="number"
                    value={config.rs485.postTransmitDelay}
                    onChange={(e) => handleRS485Change('postTransmitDelay', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    min="0"
                    max="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Receive Timeout (ms)
                  </label>
                  <input
                    type="number"
                    value={config.rs485.receiveTimeout}
                    onChange={(e) => handleRS485Change('receiveTimeout', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    min="0"
                    max="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Turnaround Delay (ms)
                  </label>
                  <input
                    type="number"
                    value={config.rs485.turnaroundDelay}
                    onChange={(e) => handleRS485Change('turnaroundDelay', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    min="0"
                    max="1000"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Termination Resistor</span>
                  <button
                    onClick={() => handleChange('terminationResistor', !config.terminationResistor)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.terminationResistor ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.terminationResistor ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Modbus Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Device Address
                  </label>
                  <input
                    type="number"
                    value={config.modbus.address}
                    onChange={(e) => handleModbusChange('address', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    min="1"
                    max="247"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Response Timeout (ms)
                  </label>
                  <input
                    type="number"
                    value={config.modbus.timeout}
                    onChange={(e) => handleModbusChange('timeout', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    min="100"
                    max="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Retries
                  </label>
                  <input
                    type="number"
                    value={config.modbus.retries}
                    onChange={(e) => handleModbusChange('retries', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    min="0"
                    max="10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Inter-frame Delay (char times)
                  </label>
                  <input
                    type="number"
                    value={config.modbus.interFrameDelay}
                    onChange={(e) => handleModbusChange('interFrameDelay', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    min="1.5"
                    max="10"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Response Delay (ms)
                  </label>
                  <input
                    type="number"
                    value={config.modbus.responseDelay}
                    onChange={(e) => handleModbusChange('responseDelay', e.target.value)}
                    className="w-full bg-[#1c2936] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
                    min="0"
                    max="1000"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#141e2a] rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-4">Error Handling</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">CRC Check</span>
                  <button
                    onClick={() => handleErrorHandlingChange('crcCheck', !config.errorHandling.crcCheck)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.errorHandling.crcCheck ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.errorHandling.crcCheck ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Frame Check</span>
                  <button
                    onClick={() => handleErrorHandlingChange('frameCheck', !config.errorHandling.frameCheck)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.errorHandling.frameCheck ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.errorHandling.frameCheck ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Parity Check</span>
                  <button
                    onClick={() => handleErrorHandlingChange('parityCheck', !config.errorHandling.parityCheck)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.errorHandling.parityCheck ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.errorHandling.parityCheck ? 'translate-x-5' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Overrun Detection</span>
                  <button
                    onClick={() => handleErrorHandlingChange('overrunDetection', !config.errorHandling.overrunDetection)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      config.errorHandling.overrunDetection ? 'bg-cyan-400' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        config.errorHandling.overrunDetection ? 'translate-x-5' : 'translate-x-1'
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

export default RS485SettingsPopup;