import React, { useState } from 'react';
import { X, Calendar, Clock, Utensils, ClipboardList, Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import type { AnimalInfo, VetAppointment, MealSchedule, CareRoutine } from '../types';

interface AnimalInfoPopupProps {
  isOpen: boolean;
  onClose: () => void;
  animal: AnimalInfo;
}

const AnimalInfoPopup: React.FC<AnimalInfoPopupProps> = ({
  isOpen,
  onClose,
  animal
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'vet' | 'meals' | 'care'>('info');

  if (!isOpen) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUpcomingAppointments = () => {
    return animal.vetAppointments
      .filter(apt => !apt.completed && new Date(apt.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getPastAppointments = () => {
    return animal.vetAppointments
      .filter(apt => apt.completed || new Date(apt.date) < new Date())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getDaySchedule = (day: MealSchedule['dayOfWeek']) => {
    return animal.mealSchedule
      .filter(meal => meal.dayOfWeek === day)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const renderInfoTab = () => (
    <div className="space-y-3">
      <div>
        <span className="text-gray-400">Species:</span>
        <span className="text-white ml-2">{animal.species}</span>
      </div>
      <div>
        <span className="text-gray-400">Sex:</span>
        <span className="text-white ml-2">{animal.sex}</span>
      </div>
      <div>
        <span className="text-gray-400">Age:</span>
        <span className="text-white ml-2">{animal.age}</span>
      </div>
      <div>
        <span className="text-gray-400">Born:</span>
        <span className="text-white ml-2">{formatDate(animal.dateOfBirth)}</span>
      </div>
      <div>
        <span className="text-gray-400">Diet:</span>
        <span className="text-white ml-2">{animal.diet}</span>
      </div>
      <div>
        <span className="text-gray-400">Activity:</span>
        <span className="text-white ml-2">{animal.activity}</span>
      </div>
      <div>
        <span className="text-gray-400">Habitat:</span>
        <span className="text-white ml-2">{animal.habitat}</span>
      </div>
    </div>
  );

  const renderVetTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-cyan-400 font-medium mb-2">Upcoming Appointments</h3>
        <div className="space-y-2">
          {getUpcomingAppointments().map(apt => (
            <div key={apt.id} className="bg-[#141e2a] rounded-lg p-3 border border-gray-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-white font-medium">{formatDate(apt.date)}</div>
                  <div className="text-gray-400 text-sm">{apt.time}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-cyan-400 hover:text-cyan-300">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <div className="text-white text-sm">{apt.reason}</div>
                {apt.notes && (
                  <div className="text-gray-400 text-sm mt-1">{apt.notes}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-cyan-400 font-medium mb-2">Past Appointments</h3>
        <div className="space-y-2">
          {getPastAppointments().map(apt => (
            <div 
              key={apt.id} 
              className={`bg-[#141e2a] rounded-lg p-3 border border-gray-700 ${
                apt.completed ? 'opacity-70' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-white font-medium">{formatDate(apt.date)}</div>
                  <div className="text-gray-400 text-sm">{apt.time}</div>
                </div>
                <div className="flex items-center gap-2">
                  {apt.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              <div className="mt-2">
                <div className="text-white text-sm">{apt.reason}</div>
                {apt.notes && (
                  <div className="text-gray-400 text-sm mt-1">{apt.notes}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMealsTab = () => (
    <div className="space-y-4">
      {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map(day => (
        <div key={day}>
          <h3 className="text-cyan-400 font-medium capitalize mb-2">{day}</h3>
          <div className="space-y-2">
            {getDaySchedule(day).map(meal => (
              <div key={meal.id} className="bg-[#141e2a] rounded-lg p-3 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="text-white font-medium">{meal.time}</div>
                  <div className="flex items-center gap-2">
                    <button className="text-cyan-400 hover:text-cyan-300">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-1">
                  <div className="text-white text-sm">{meal.foodType}</div>
                  <div className="text-gray-400 text-sm">Quantity: {meal.quantity}</div>
                  {meal.notes && (
                    <div className="text-gray-400 text-sm mt-1">{meal.notes}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderCareTab = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-cyan-400 font-medium mb-2">Daily Tasks</h3>
        <div className="space-y-2">
          {animal.careRoutine
            .filter(task => task.frequency === 'daily')
            .map(task => (
              <div key={task.id} className="bg-[#141e2a] rounded-lg p-3 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="text-white font-medium">{task.task}</div>
                  <div className="flex items-center gap-2">
                    <button className="text-cyan-400 hover:text-cyan-300">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {task.lastPerformed && (
                  <div className="text-gray-400 text-sm mt-1">
                    Last done: {formatDate(task.lastPerformed)}
                  </div>
                )}
                {task.notes && (
                  <div className="text-gray-400 text-sm mt-1">{task.notes}</div>
                )}
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-cyan-400 font-medium mb-2">Weekly Tasks</h3>
        <div className="space-y-2">
          {animal.careRoutine
            .filter(task => task.frequency === 'weekly')
            .map(task => (
              <div key={task.id} className="bg-[#141e2a] rounded-lg p-3 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="text-white font-medium">{task.task}</div>
                  <div className="flex items-center gap-2">
                    <button className="text-cyan-400 hover:text-cyan-300">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {task.lastPerformed && (
                  <div className="text-gray-400 text-sm mt-1">
                    Last done: {formatDate(task.lastPerformed)}
                  </div>
                )}
                {task.nextDue && (
                  <div className="text-gray-400 text-sm">
                    Next due: {formatDate(task.nextDue)}
                  </div>
                )}
                {task.notes && (
                  <div className="text-gray-400 text-sm mt-1">{task.notes}</div>
                )}
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-cyan-400 font-medium mb-2">Monthly Tasks</h3>
        <div className="space-y-2">
          {animal.careRoutine
            .filter(task => task.frequency === 'monthly')
            .map(task => (
              <div key={task.id} className="bg-[#141e2a] rounded-lg p-3 border border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="text-white font-medium">{task.task}</div>
                  <div className="flex items-center gap-2">
                    <button className="text-cyan-400 hover:text-cyan-300">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {task.lastPerformed && (
                  <div className="text-gray-400 text-sm mt-1">
                    Last done: {formatDate(task.lastPerformed)}
                  </div>
                )}
                {task.nextDue && (
                  <div className="text-gray-400 text-sm">
                    Next due: {formatDate(task.nextDue)}
                  </div>
                )}
                {task.notes && (
                  <div className="text-gray-400 text-sm mt-1">{task.notes}</div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-[#1c2936] w-full max-w-2xl rounded-lg shadow-xl border border-gray-700 max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-cyan-400">{animal.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-700 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'info' 
                ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400' 
                : 'text-gray-400 hover:bg-[#141e2a]/50'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab('vet')}
            className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'vet'
                ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:bg-[#141e2a]/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Vet Visits
          </button>
          <button
            onClick={() => setActiveTab('meals')}
            className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'meals'
                ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:bg-[#141e2a]/50'
            }`}
          >
            <Utensils className="w-4 h-4" />
            Meals
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`flex-1 p-3 flex items-center justify-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'care'
                ? 'bg-[#141e2a] text-cyan-400 border-b-2 border-cyan-400'
                : 'text-gray-400 hover:bg-[#141e2a]/50'
            }`}
          >
            <Clock className="w-4 h-4" />
            Care
          </button>
        </div>

        <div className="p-4 overflow-y-auto">
          {activeTab === 'info' && renderInfoTab()}
          {activeTab === 'vet' && renderVetTab()}
          {activeTab === 'meals' && renderMealsTab()}
          {activeTab === 'care' && renderCareTab()}
        </div>

        <div className="p-4 border-t border-gray-700">
          <button
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white py-2 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add New {activeTab === 'info' ? 'Information' : activeTab === 'vet' ? 'Appointment' : activeTab === 'meals' ? 'Meal' : 'Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalInfoPopup;