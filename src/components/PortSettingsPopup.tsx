import React, { useState } from 'react';
import { X, ChevronRight, Usb, Cpu, Cable, BrainCircuit as Circuit, Radio, Terminal, Network, Wifi, Zap, Monitor, MemoryStick as Memory, Camera, HardDrive, Microwave as Microchip, AudioWaveform as Waveform } from 'lucide-react';
import UARTSettingsPopup from './port-settings/UARTSettingsPopup';
import I2CSettingsPopup from './port-settings/I2CSettingsPopup';
import USBSettingsPopup from './port-settings/USBSettingsPopup';
import GPIOSettingsPopup from './port-settings/GPIOSettingsPopup';
import SPISettingsPopup from './port-settings/SPISettingsPopup';
import SSHSettingsPopup from './port-settings/SSHSettingsPopup';
import CANBusSettingsPopup from './port-settings/CANBusSettingsPopup';
import RS485SettingsPopup from './port-settings/RS485SettingsPopup';
import ZigbeeLoRaSettingsPopup from './port-settings/ZigbeeLoRaSettingsPopup';
import FPGASettingsPopup from './port-settings/FPGASettingsPopup';
import HDMISettingsPopup from './port-settings/HDMISettingsPopup';
import LPDDR5SettingsPopup from './port-settings/LPDDR5SettingsPopup';
import MIPICSISettingsPopup from './port-settings/MIPICSISettingsPopup';
import NVMePCIeSettingsPopup from './port-settings/NVMePCIeSettingsPopup';
import ProcessorSettingsPopup from './port-settings/ProcessorSettingsPopup';
import PWMSettingsPopup from './port-settings/PWMSettingsPopup';
import SODIMMSettingsPopup from './port-settings/SODIMMSettingsPopup';
import EMMCSettingsPopup from './port-settings/EMMCSettingsPopup';

interface PortSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const PortSettingsPopup: React.FC<PortSettingsPopupProps> = ({ isOpen, onClose }) => {
  const [activePopup, setActivePopup] = useState<string | null>(null);

  if (!isOpen) return null;

  const ports = [
    { id: 'canbus', name: 'CAN Bus', icon: Network, description: 'Controller Area Network bus configuration' },
    { id: 'emmc', name: 'eMMC', icon: HardDrive, description: 'Embedded Multi-Media Card configuration' },
    { id: 'fpga', name: 'FPGA', icon: Microchip, description: 'Field Programmable Gate Array settings' },
    { id: 'gpio', name: 'GPIO', icon: Radio, description: 'General Purpose Input/Output configuration' },
    { id: 'hdmi', name: 'HDMI', icon: Monitor, description: 'High-Definition Multimedia Interface settings' },
    { id: 'i2c', name: 'I2C', icon: Circuit, description: 'Inter-Integrated Circuit configuration' },
    { id: 'lpddr5', name: 'LPDDR5', icon: Memory, description: 'Low Power DDR5 memory configuration' },
    { id: 'mipicsi', name: 'MIPI CSI', icon: Camera, description: 'MIPI Camera Serial Interface settings' },
    { id: 'nvme', name: 'NVMe/PCIe', icon: HardDrive, description: 'NVMe over PCIe configuration' },
    { id: 'processor', name: 'Processor', icon: Cpu, description: 'CPU and core settings' },
    { id: 'pwm', name: 'PWM', icon: Waveform, description: 'Pulse Width Modulation configuration' },
    { id: 'rs485', name: 'RS485/Modbus', icon: Cable, description: 'RS485 and Modbus communication settings' },
    { id: 'sodimm', name: 'SO-DIMM', icon: Memory, description: 'Small Outline Dual In-Line Memory Module settings' },
    { id: 'spi', name: 'SPI', icon: Circuit, description: 'Serial Peripheral Interface settings' },
    { id: 'ssh', name: 'SSH', icon: Terminal, description: 'Secure Shell connection settings' },
    { id: 'uart', name: 'UART', icon: Cable, description: 'Universal Asynchronous Receiver/Transmitter settings' },
    { id: 'usb', name: 'USB/USB-C', icon: Usb, description: 'Universal Serial Bus settings' },
    { id: 'zigbeelora', name: 'Zigbee/LoRa', icon: Wifi, description: 'Zigbee and LoRa wireless communication settings' }
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div 
          className="bg-[#1c2936] w-full max-w-4xl rounded-lg shadow-xl border border-gray-700"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-cyan-400">Port Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ports.map(port => (
                <button
                  key={port.id}
                  onClick={() => setActivePopup(port.id)}
                  className="w-full p-3 rounded-lg bg-[#141e2a] hover:bg-[#141e2a]/70 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-400/10 flex items-center justify-center">
                      <port.icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-white font-medium">{port.name}</div>
                      <div className="text-gray-400 text-sm">{port.description}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <UARTSettingsPopup
        isOpen={activePopup === 'uart'}
        onClose={() => setActivePopup(null)}
      />
      <I2CSettingsPopup
        isOpen={activePopup === 'i2c'}
        onClose={() => setActivePopup(null)}
      />
      <USBSettingsPopup
        isOpen={activePopup === 'usb'}
        onClose={() => setActivePopup(null)}
      />
      <GPIOSettingsPopup
        isOpen={activePopup === 'gpio'}
        onClose={() => setActivePopup(null)}
      />
      <SPISettingsPopup
        isOpen={activePopup === 'spi'}
        onClose={() => setActivePopup(null)}
      />
      <SSHSettingsPopup
        isOpen={activePopup === 'ssh'}
        onClose={() => setActivePopup(null)}
      />
      <CANBusSettingsPopup
        isOpen={activePopup === 'canbus'}
        onClose={() => setActivePopup(null)}
      />
      <RS485SettingsPopup
        isOpen={activePopup === 'rs485'}
        onClose={() => setActivePopup(null)}
      />
      <ZigbeeLoRaSettingsPopup
        isOpen={activePopup === 'zigbeelora'}
        onClose={() => setActivePopup(null)}
      />
      <FPGASettingsPopup
        isOpen={activePopup === 'fpga'}
        onClose={() => setActivePopup(null)}
      />
      <HDMISettingsPopup
        isOpen={activePopup === 'hdmi'}
        onClose={() => setActivePopup(null)}
      />
      <LPDDR5SettingsPopup
        isOpen={activePopup === 'lpddr5'}
        onClose={() => setActivePopup(null)}
      />
      <MIPICSISettingsPopup
        isOpen={activePopup === 'mipicsi'}
        onClose={() => setActivePopup(null)}
      />
      <NVMePCIeSettingsPopup
        isOpen={activePopup === 'nvme'}
        onClose={() => setActivePopup(null)}
      />
      <ProcessorSettingsPopup
        isOpen={activePopup === 'processor'}
        onClose={() => setActivePopup(null)}
      />
      <PWMSettingsPopup
        isOpen={activePopup === 'pwm'}
        onClose={() => setActivePopup(null)}
      />
      <SODIMMSettingsPopup
        isOpen={activePopup === 'sodimm'}
        onClose={() => setActivePopup(null)}
      />
      <EMMCSettingsPopup
        isOpen={activePopup === 'emmc'}
        onClose={() => setActivePopup(null)}
      />
    </>
  );
};

export default PortSettingsPopup;