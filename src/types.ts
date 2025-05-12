export type Status = 'active' | 'warning' | 'error' | 'disabled';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type Frequency = 'daily' | 'weekly' | 'monthly';
export type Activity = 'nocturnal' | 'diurnal';
export type Habitat = 'terrestrial' | 'aquatic' | 'arboreal';

export interface BaseEntity {
  id: string;
  name: string;
}

export interface TimestampedEntity extends BaseEntity {
  lastPerformed?: string;
  nextDue?: string;
}

export interface VetAppointment extends BaseEntity {
  date: string;
  time: string;
  reason: string;
  notes?: string;
  completed: boolean;
}

export interface MealSchedule extends BaseEntity {
  dayOfWeek: DayOfWeek;
  time: string;
  foodType: string;
  quantity: string;
  notes?: string;
}

export interface CareRoutine extends TimestampedEntity {
  task: string;
  frequency: Frequency;
  notes?: string;
}

export interface AnimalInfo {
  name: string;
  species: string;
  sex: 'male' | 'female';
  dateOfBirth: string;
  age: string;
  diet: string;
  activity: Activity;
  habitat: Habitat;
  vetAppointments: VetAppointment[];
  mealSchedule: MealSchedule[];
  careRoutine: CareRoutine[];
}

export interface EnvironmentReadings {
  temperature: number;
  humidity: number;
  lightLevel: number;
  uviLevel: number;
}

export interface DayNightSettings {
  dayTemperature?: number;
  nightTemperature?: number;
  dayHumidity?: number;
  nightHumidity?: number;
}

export interface AquariumType extends EnvironmentReadings, DayNightSettings {
  id: number;
  name: string;
  type: string;
  image: string;
  isActive?: boolean;
  animal?: AnimalInfo;
}