import { prisma } from './prisma';
import { HttpError } from '../middleware/errorHandler';

export const terrariumSelect = {
  id: true,
  name: true,
  description: true,
  type: true,
  isActive: true,
  temperature: true,
  humidity: true,
  lightLevel: true,
  uviLevel: true,
  createdAt: true,
  updatedAt: true
} as const;

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

export const listTerrariums = async (): Promise<TerrariumResponse[]> =>
  prisma.terrarium.findMany({
    select: terrariumSelect,
    orderBy: { createdAt: 'asc' }
  });

export const getTerrarium = async (id: string): Promise<TerrariumResponse> => {
  const terrarium = await prisma.terrarium.findUnique({
    where: { id },
    select: terrariumSelect
  });
  if (!terrarium) {
    throw new HttpError(404, 'Terrarium introuvable');
  }
  return terrarium;
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
  return prisma.terrarium.create({
    data: payload,
    select: terrariumSelect
  });
};

export const updateTerrarium = async (id: string, payload: Partial<TerrariumInput>): Promise<TerrariumResponse> => {
  try {
    return await prisma.terrarium.update({
      where: { id },
      data: payload,
      select: terrariumSelect
    });
  } catch (error) {
    throw new HttpError(404, 'Terrarium introuvable', error);
  }
};

export const deleteTerrarium = async (id: string): Promise<void> => {
  try {
    await prisma.terrarium.delete({ where: { id } });
  } catch (error) {
    throw new HttpError(404, 'Terrarium introuvable', error);
  }
};
