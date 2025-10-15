import { promises as fs } from 'fs';
import path from 'path';
import initSqlJs, { SqlJsDatabase } from 'sql.js';
import { env } from './config/env';
import { logger } from './utils/logger';

export interface SqlJsConnectionOptions {
  filename?: string;
  readonly?: boolean;
}

const locateWasm = (file: string): string => {
  if (env.SQLJS_PATH) {
    const candidate = env.SQLJS_PATH.endsWith('.wasm') ? env.SQLJS_PATH : path.join(env.SQLJS_PATH, file);
    return path.resolve(candidate);
  }
  return path.resolve(process.cwd(), 'node_modules/sql.js/dist', file);
};

export const createSqlJsDatabase = async (
  options: SqlJsConnectionOptions = {}
): Promise<{ db: SqlJsDatabase; persist: () => Promise<void> }> => {
  const filename = options.filename ?? env.SQLJS_PERSISTENCE_PATH ?? path.resolve(process.cwd(), 'data/database.sqlite');
  const readonly = options.readonly ?? false;

  const SQL = await initSqlJs({ locateFile: (file: string) => locateWasm(file) });

  let data: Uint8Array | undefined;
  try {
    const buffer = await fs.readFile(filename);
    data = new Uint8Array(buffer);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT') {
      throw error;
    }
    if (readonly) {
      throw new Error(`La base de données ${filename} est introuvable en mode lecture seule.`);
    }
    await fs.mkdir(path.dirname(filename), { recursive: true });
  }

  const db = data ? new SQL.Database(data) : new SQL.Database();

  const persist = async (): Promise<void> => {
    if (readonly) {
      return;
    }
    const contents = Buffer.from(db.export());
    await fs.mkdir(path.dirname(filename), { recursive: true });
    await fs.writeFile(filename, contents);
    logger.debug({ filename }, 'Base SQL.js persistée');
  };

  return { db, persist };
};

export const runSqlJsMigrations = async (db: SqlJsDatabase): Promise<void> => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
};
