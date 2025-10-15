import { promises as fs } from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import initSqlJs, { SqlJsDatabase, SqlJsStatic, type Statement as SqlJsStatementType } from 'sql.js';
import { env } from '../config/env';
import { logger } from '../utils/logger';

type Callback<T = unknown> = (err: Error | null, result?: T) => void;

type Params = unknown[] | Record<string, unknown> | undefined;

const OPEN_READONLY = 0x0001;
const OPEN_READWRITE = 0x0002;
const OPEN_CREATE = 0x0004;

const require = createRequire(import.meta.url);

const locateSqlJsAsset = (file: string): string => {
  if (env.SQLJS_PATH) {
    const candidate = env.SQLJS_PATH.endsWith('.wasm') ? env.SQLJS_PATH : path.join(env.SQLJS_PATH, file);
    return path.resolve(candidate);
  }

  try {
    const resolved = require.resolve(`sql.js/dist/${file}`);
    return resolved;
  } catch (error) {
    const baseDir = path.dirname(fileURLToPath(import.meta.url));
    return path.resolve(baseDir, '../../node_modules/sql.js/dist', file);
  }
};

const normalizeParams = (params: Params): Params => {
  if (!params) {
    return undefined;
  }

  if (Array.isArray(params)) {
    return params.map((value) => {
      if (value instanceof Uint8Array) {
        return value;
      }
      if (Buffer.isBuffer(value)) {
        return new Uint8Array(value);
      }
      return value;
    });
  }

  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (value instanceof Uint8Array) {
        return [key, value];
      }
      if (Buffer.isBuffer(value)) {
        return [key, new Uint8Array(value)];
      }
      return [key, value];
    })
  );
};

const extractParams = <T>(args: unknown[]): { sql: string; params?: Params; callback?: Callback<T> } => {
  if (args.length === 0 || typeof args[0] !== 'string') {
    throw new TypeError('SQL statement must be a string.');
  }

  const sql = args[0];
  let params: Params;
  let callback: Callback<T> | undefined;

  if (typeof args[1] === 'function') {
    callback = args[1] as Callback<T>;
  } else if (Array.isArray(args[1]) || typeof args[1] === 'object') {
    params = args[1] as Params;
    if (typeof args[2] === 'function') {
      callback = args[2] as Callback<T>;
    }
  }

  return { sql, params: normalizeParams(params), callback };
};

const ensureDirectory = async (target: string): Promise<void> => {
  await fs.mkdir(path.dirname(target), { recursive: true });
};

const loadSqlJs = (() => {
  let instance: Promise<SqlJsStatic> | undefined;
  return (): Promise<SqlJsStatic> => {
    if (!instance) {
      instance = initSqlJs({
        locateFile: (file: string) => locateSqlJsAsset(file)
      });
    }
    return instance;
  };
})();

class SqlJsStatement {
  private readonly statementPromise: Promise<SqlJsStatementType>;
  private readonly db: SqlJsDatabase;
  private readonly queue: SqlJsTaskQueue;

  constructor(
    db: SqlJsDatabase,
    queue: SqlJsTaskQueue,
    sql: string,
    params?: Params,
    callback?: Callback
  ) {
    this.db = db;
    this.queue = queue;
    this.statementPromise = queue.enqueue(async () => {
      const stmt = this.db.prepare(sql);
      if (params) {
        stmt.bind(params as Parameters<typeof stmt.bind>[0]);
      }
      callback?.(null);
      return stmt;
    });
  }

  public run(params?: Params, callback?: Callback): SqlJsStatement {
    void this.queue.enqueue(async () => {
      const stmt = await this.statementPromise;
      if (params) {
        stmt.bind(params as Parameters<typeof stmt.bind>[0]);
      }
      stmt.step();
      callback?.(null);
    });
    return this;
  }

  public all(params?: Params, callback?: Callback<unknown[]>): SqlJsStatement {
    void this.queue.enqueue(async () => {
      const stmt = await this.statementPromise;
      if (params) {
        stmt.bind(params as Parameters<typeof stmt.bind>[0]);
      }
      const rows: unknown[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.reset();
      callback?.(null, rows);
      return rows;
    });
    return this;
  }

  public get(params?: Params, callback?: Callback<Record<string, unknown> | undefined>): SqlJsStatement {
    void this.queue.enqueue(async () => {
      const stmt = await this.statementPromise;
      if (params) {
        stmt.bind(params as Parameters<typeof stmt.bind>[0]);
      }
      const row = stmt.step() ? stmt.getAsObject() : undefined;
      stmt.reset();
      callback?.(null, row);
      return row;
    });
    return this;
  }

  public finalize(callback?: Callback): void {
    void this.queue.enqueue(async () => {
      const stmt = await this.statementPromise;
      stmt.free();
      callback?.(null);
    });
  }

  public reset(callback?: Callback): SqlJsStatement {
    void this.queue.enqueue(async () => {
      const stmt = await this.statementPromise;
      stmt.reset();
      callback?.(null);
    });
    return this;
  }
}

class SqlJsTaskQueue {
  private queue: Promise<void> = Promise.resolve();

  public enqueue<T>(task: () => T | Promise<T>): Promise<T> {
    const resultPromise = this.queue.then(task);
    this.queue = resultPromise.then(() => undefined, (error) => {
      logger.error({ err: error }, 'sql.js task failed');
    });
    return resultPromise;
  }
}

export class Database {
  public filename: string;
  public uuid?: string;
  public lastID = 0;
  public changes = 0;
  private readonly mode: number;
  private readonly queue = new SqlJsTaskQueue();
  private dbInstance: Promise<SqlJsDatabase>;
  private closed = false;

  constructor(filename: string, mode: number, callback?: Callback) {
    this.filename = filename ?? ':memory:';
    this.mode = mode;
    this.dbInstance = this.initialize();
    this.dbInstance.then(
      () => callback?.(null),
      (error) => callback?.(error as Error)
    );
  }

  private async initialize(): Promise<SqlJsDatabase> {
    const SQL = await loadSqlJs();
    const filename = this.filename === ':memory:' ? ':memory:' : path.resolve(this.filename);
    let data: Uint8Array | undefined;
    if (filename !== ':memory:') {
      try {
        const file = await fs.readFile(filename);
        data = new Uint8Array(file);
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code !== 'ENOENT' && (this.mode & OPEN_CREATE) === 0) {
          throw error;
        }
      }
    }
    const db = data ? new SQL.Database(data) : new SQL.Database();
    if (filename !== ':memory:') {
      db.filename = filename;
    }
    if (env.NODE_ENV !== 'production') {
      logger.debug({ filename }, 'sql.js database initialised');
    }
    return db;
  }

  private async withDb<T>(handler: (db: SqlJsDatabase) => T | Promise<T>): Promise<T> {
    const db = await this.dbInstance;
    if (this.closed) {
      throw new Error('Database is closed');
    }
    return handler(db);
  }

  private enqueue<T>(handler: (db: SqlJsDatabase) => T | Promise<T>, callback?: Callback<T>): Promise<T> {
    const promise = this.queue.enqueue(() => this.withDb(handler));
    if (callback) {
      promise.then(
        (result) => callback(null, result),
        (error) => callback(error as Error)
      );
    }
    return promise;
  }

  public run(...args: unknown[]): this {
    const { sql, params, callback } = extractParams(args);
    const task = this.enqueue((db) => {
      const stmt = db.prepare(sql);
      if (params) {
        stmt.bind(params as Parameters<typeof stmt.bind>[0]);
      }
      stmt.step();
      const changes = db.getRowsModified();
      const lastRowId = db.exec('SELECT last_insert_rowid() as id');
      const lastID = lastRowId?.[0]?.values?.[0]?.[0] ?? 0;
      stmt.free();
      this.lastID = typeof lastID === 'number' ? lastID : Number(lastID) || 0;
      this.changes = changes;
      if (callback) {
        Reflect.apply(callback as (err: Error | null) => void, { lastID: this.lastID, changes: this.changes }, [null]);
      }
      return undefined;
    });
    if (callback) {
      task.catch((error) => {
        Reflect.apply(callback as (err: Error) => void, { lastID: this.lastID, changes: this.changes }, [error as Error]);
      });
    }
    return this;
  }

  public exec(sql: string, callback?: Callback): this {
    void this.enqueue((db) => {
      db.exec(sql);
      callback?.(null);
    }, callback);
    return this;
  }

  public all(...args: unknown[]): this {
    const { sql, params, callback } = extractParams<unknown[]>(args);
    void this.enqueue((db) => {
      const stmt = db.prepare(sql);
      if (params) {
        stmt.bind(params as Parameters<typeof stmt.bind>[0]);
      }
      const rows: unknown[] = [];
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
      callback?.(null, rows);
      return rows;
    }, callback);
    return this;
  }

  public get(...args: unknown[]): this {
    const { sql, params, callback } = extractParams<Record<string, unknown> | undefined>(args);
    void this.enqueue((db) => {
      const stmt = db.prepare(sql);
      if (params) {
        stmt.bind(params as Parameters<typeof stmt.bind>[0]);
      }
      const row = stmt.step() ? stmt.getAsObject() : undefined;
      stmt.free();
      callback?.(null, row);
      return row;
    }, callback);
    return this;
  }

  public prepare(...args: unknown[]): SqlJsStatement {
    const { sql, params, callback } = extractParams(args);
    const statementPromise = this.enqueue(async (db) => {
      return new SqlJsStatement(db, this.queue, sql, params, callback);
    });
    return new Proxy({} as SqlJsStatement, {
      get: (_target, property: keyof SqlJsStatement) => {
        return (...methodArgs: unknown[]) => {
          return statementPromise.then((stmt) =>
            (stmt[property] as (...innerArgs: unknown[]) => unknown)(...methodArgs)
          );
        };
      }
    }) as SqlJsStatement;
  }

  public close(callback?: Callback): void {
    void this.enqueue(async (db) => {
      if (this.closed) {
        callback?.(null);
        return;
      }
      if (db.filename && db.filename !== ':memory:') {
        const target = env.SQLJS_PERSISTENCE_PATH ? path.resolve(env.SQLJS_PERSISTENCE_PATH) : db.filename;
        await ensureDirectory(target);
        const buffer = Buffer.from(db.export());
        await fs.writeFile(target, buffer);
      }
      db.close();
      this.closed = true;
      callback?.(null);
    }, callback);
  }

  public serialize(callback: () => void): void {
    void this.enqueue(() => {
      callback();
      return undefined;
    });
  }

  public parallelize(callback: () => void): void {
    void this.enqueue(() => {
      callback();
      return undefined;
    });
  }
}

export const OPEN_URI = 0x0040;
export const OPEN_MEMORY = 0x0080;

export default {
  OPEN_READONLY,
  OPEN_READWRITE,
  OPEN_CREATE,
  OPEN_URI,
  OPEN_MEMORY,
  Database
};
