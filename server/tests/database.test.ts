import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { initDatabase, sequelize, Setting, User } from '../src/models';

describe('PostgreSQL layer', () => {
  beforeAll(async () => {
    await initDatabase();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('crée un utilisateur et retrouve ses informations', async () => {
    const created = await User.create({
      email: 'unit@test.dev',
      passwordHash: 'hash',
      role: 'admin'
    });

    const fetched = await User.findByPk(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.email).toBe('unit@test.dev');
  });

  it('enregistre et lit un paramètre', async () => {
    const setting = await Setting.create({ key: 'theme', value: 'dark' });
    const fetched = await Setting.findOne({ where: { key: 'theme' } });
    expect(fetched?.value).toBe(setting.value);
  });
});
