import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface AnimalInfo {
  name: string;
  species: string;
  sex: 'male' | 'female';
  dateOfBirth: string;
  age: string;
  diet: string;
  activity: 'nocturnal' | 'diurnal';
  habitat: 'terrestrial' | 'aquatic' | 'arboreal';
}

interface AnimalInfoSettingsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  animal: AnimalInfo;
  onSave: (updatedAnimal: AnimalInfo) => void;
}

const AnimalInfoSettingsPopup: React.FC<AnimalInfoSettingsPopupProps> = ({
  isOpen,
  onClose,
  animal,
  onSave
}) => {
  const [animalInfo, setAnimalInfo] = useState<AnimalInfo>(animal);

  if (!isOpen) return null;

  const calculateAge = (dateOfBirth: string): string => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    
    // Adjust years and months if birth month hasn't occurred this year
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    
    // Adjust for current month
    if (today.getDate() < birthDate.getDate()) {
      months--;
    }
    
    // Format the age string
    if (years > 0) {
      if (months > 0) {
        return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
      }
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      return `${days} day${days !== 1 ? 's' : ''}`;
    }
  };

  const handleChange = (field: keyof AnimalInfo, value: string) => {
    if (field === 'dateOfBirth') {
      const calculatedAge = calculateAge(value);
      setAnimalInfo(prev => ({
        ...prev,
        [field]: value,
        age: calculatedAge
      }));
    } else {
      setAnimalInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(animalInfo);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-md rounded-lg shadow-xl border border-gray-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-cyan-400">Animal Information</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Name
            </label>
            <input
              type="text"
              value={animalInfo.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Species
            </label>
            <input
              type="text"
              value={animalInfo.species}
              onChange={(e) => handleChange('species', e.target.value)}
              className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Sex
            </label>
            <select
              value={animalInfo.sex}
              onChange={(e) => handleChange('sex', e.target.value as 'male' | 'female')}
              className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              value={animalInfo.dateOfBirth}
              onChange={(e) => handleChange('dateOfBirth', e.target.value)}
              className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Age
            </label>
            <input
              type="text"
              value={animalInfo.age}
              className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400 cursor-not-allowed"
              disabled
            />
            <p className="text-xs text-gray-400 mt-1">Age is automatically calculated from date of birth</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Diet
            </label>
            <input
              type="text"
              value={animalInfo.diet}
              onChange={(e) => handleChange('diet', e.target.value)}
              className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Activity Pattern
            </label>
            <select
              value={animalInfo.activity}
              onChange={(e) => handleChange('activity', e.target.value as 'nocturnal' | 'diurnal')}
              className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              required
            >
              <option value="diurnal">Diurnal</option>
              <option value="nocturnal">Nocturnal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Habitat Type
            </label>
            <select
              value={animalInfo.habitat}
              onChange={(e) => handleChange('habitat', e.target.value as 'terrestrial' | 'aquatic' | 'arboreal')}
              className="w-full bg-[#141e2a] text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-cyan-400"
              required
            >
              <option value="terrestrial">Terrestrial</option>
              <option value="aquatic">Aquatic</option>
              <option value="arboreal">Arboreal</option>
            </select>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AnimalInfoSettingsPopup;