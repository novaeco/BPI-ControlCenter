import path from 'path';
import { mkdirSync } from 'fs';
import {
  Sequelize,
  DataTypes,
  Model,
  Optional,
  Association,
  NonAttribute
} from 'sequelize';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const resolveStoragePath = (dbPath: string): string => {
  const absolute = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);
  mkdirSync(path.dirname(absolute), { recursive: true });
  return absolute;
};

const storagePath = resolveStoragePath(env.DB_PATH);

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: env.NODE_ENV === 'production' ? false : (message) => logger.debug(message)
});

export interface UserAttributes {
  id: string;
  email: string;
  passwordHash: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: string;
  declare email: string;
  declare passwordHash: string;
  declare role: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  declare refreshTokens?: NonAttribute<RefreshToken[]>;

  declare static associations: {
    refreshTokens: Association<User, RefreshToken>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.STRING(32),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    indexes: [{ unique: true, fields: ['email'] }]
  }
);

export interface RefreshTokenAttributes {
  id: string;
  token: string;
  expiresAt: Date;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type RefreshTokenCreationAttributes = Optional<RefreshTokenAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  declare id: string;
  declare token: string;
  declare expiresAt: Date;
  declare userId: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  declare user?: NonAttribute<User>;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    token: {
      type: DataTypes.STRING(512),
      allowNull: false,
      unique: true
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'refresh_tokens',
    timestamps: true,
    indexes: [{ unique: true, fields: ['token'] }]
  }
);

export interface TerrariumAttributes {
  id: string;
  name: string;
  description: string | null;
  type: string;
  isActive: boolean;
  temperature: number;
  humidity: number;
  lightLevel: number;
  uviLevel: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TerrariumCreationAttributes = Optional<
  TerrariumAttributes,
  'id' | 'description' | 'createdAt' | 'updatedAt'
>;

export class Terrarium
  extends Model<TerrariumAttributes, TerrariumCreationAttributes>
  implements TerrariumAttributes
{
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare type: string;
  declare isActive: boolean;
  declare temperature: number;
  declare humidity: number;
  declare lightLevel: number;
  declare uviLevel: number;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  declare sensorReadings?: NonAttribute<SensorReading[]>;

  declare static associations: {
    sensorReadings: Association<Terrarium, SensorReading>;
  };
}

Terrarium.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    type: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    humidity: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    lightLevel: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    uviLevel: {
      type: DataTypes.FLOAT,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'terrariums',
    timestamps: true
  }
);

export interface SensorReadingAttributes {
  id: string;
  terrariumId: string | null;
  sensorType: string;
  value: number;
  unit: string;
  capturedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SensorReadingCreationAttributes = Optional<
  SensorReadingAttributes,
  'id' | 'terrariumId' | 'createdAt' | 'updatedAt'
>;

export class SensorReading
  extends Model<SensorReadingAttributes, SensorReadingCreationAttributes>
  implements SensorReadingAttributes
{
  declare id: string;
  declare terrariumId: string | null;
  declare sensorType: string;
  declare value: number;
  declare unit: string;
  declare capturedAt: Date;
  declare createdAt?: Date;
  declare updatedAt?: Date;

  declare terrarium?: NonAttribute<Terrarium | null>;
}

SensorReading.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    terrariumId: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: null
    },
    sensorType: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    unit: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    capturedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'sensor_readings',
    timestamps: true
  }
);

export interface SettingAttributes {
  id: string;
  key: string;
  value: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SettingCreationAttributes = Optional<SettingAttributes, 'id' | 'createdAt' | 'updatedAt'>;

export class Setting extends Model<SettingAttributes, SettingCreationAttributes> implements SettingAttributes {
  declare id: string;
  declare key: string;
  declare value: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
}

Setting.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    key: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'settings',
    timestamps: true,
    indexes: [{ unique: true, fields: ['key'] }]
  }
);

User.hasMany(RefreshToken, {
  foreignKey: 'userId',
  as: 'refreshTokens',
  onDelete: 'CASCADE',
  hooks: true
});
RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });

Terrarium.hasMany(SensorReading, {
  foreignKey: 'terrariumId',
  as: 'sensorReadings',
  onDelete: 'SET NULL'
});
SensorReading.belongsTo(Terrarium, { foreignKey: 'terrariumId', as: 'terrarium' });

export const initDatabase = async (): Promise<void> => {
  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  logger.info({ storagePath }, 'Base de données synchronisée');
};
