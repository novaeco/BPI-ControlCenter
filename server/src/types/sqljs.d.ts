declare module 'sql.js' {
  export interface Statement {
    bind(params?: unknown): boolean;
    step(): boolean;
    reset(): void;
    free(): void;
    getAsObject(): Record<string, unknown>;
  }

  export interface SqlJsDatabase {
    filename?: string;
    close(): void;
    export(): Uint8Array;
    run(sql: string, params?: unknown): void;
    exec(sql: string): Array<{ columns: string[]; values: unknown[][] }>;
    prepare(sql: string): Statement;
    getRowsModified(): number;
  }

  export interface SqlJsStatic {
    Database: new (data?: Uint8Array) => SqlJsDatabase;
    Statement: Statement;
  }

  type InitSqlJs = (config?: { locateFile?: (file: string) => string }) => Promise<SqlJsStatic>;

  const initSqlJs: InitSqlJs;
  export default initSqlJs;
  export { SqlJsDatabase, SqlJsStatic, Statement };
}
