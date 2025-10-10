import { Terrarium } from '../models';
import { HttpError } from '../middleware/errorHandler';

export interface TerrariumResponse {
  id: string;
  name: string;
  description: string | null;
  type: string;
  isActive: boolean;
  temperature: number;
  humidity: number;
  lightLevel: number;
  uviLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

const mapTerrarium = (terrarium: Terrarium): TerrariumResponse => {
  const {
    id,
    name,
    description,
    type,
    isActive,
    temperature,
    humidity,
    lightLevel,
    uviLevel,
    createdAt,
    updatedAt
  } = terrarium.get({ plain: true });

  const created = createdAt instanceof Date ? createdAt : new Date(createdAt ?? Date.now());
  const updated = updatedAt instanceof Date ? updatedAt : created;

  return {
    id,
    name,
    description,
    type,
    isActive,
    temperature,
    humidity,
    lightLevel,
    uviLevel,
    createdAt: created,
    updatedAt: updated
  };
};

export const listTerrariums = async (): Promise<TerrariumResponse[]> => {
  const terrariums = await Terrarium.findAll({ order: [['createdAt', 'ASC']] });
  return terrariums.map(mapTerrarium);
};

export const getTerrarium = async (id: string): Promise<TerrariumResponse> => {
  const terrarium = await Terrarium.findByPk(id);
  if (!terrarium) {
    throw new HttpError(404, 'Terrarium introuvable');
  }
  return mapTerrarium(terrarium);
};

export interface TerrariumInput {
  name: string;
  description?: string | null;
  type: string;
  isActive: boolean;
  temperature: number;
  humidity: number;
  lightLevel: number;
  uviLevel: number;
}

export const createTerrarium = async (payload: TerrariumInput): Promise<TerrariumResponse> => {
  const terrarium = await Terrarium.create(payload);
  return mapTerrarium(terrarium);
};

export const updateTerrarium = async (id: string, payload: Partial<TerrariumInput>): Promise<TerrariumResponse> => {
  try {
    const terrarium = await Terrarium.findByPk(id);
    if (!terrarium) {
      throw new HttpError(404, 'Terrarium introuvable');
    }
    terrarium.set(payload);
    await terrarium.save();
    return mapTerrarium(terrarium);
  } catch (error) {
    throw new HttpError(404, 'Terrarium introuvable', error);
  }
};

export const deleteTerrarium = async (id: string): Promise<void> => {
  try {
    const deleted = await Terrarium.destroy({ where: { id } });
    if (deleted === 0) {
      throw new HttpError(404, 'Terrarium introuvable');
    }
  } catch (error) {
    throw new HttpError(404, 'Terrarium introuvable', error);
  }
};
