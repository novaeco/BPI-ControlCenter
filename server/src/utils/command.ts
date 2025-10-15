import { execFile } from 'child_process';
import { promisify } from 'util';
import { env } from '../config/env';

const execFileAsync = promisify(execFile);

export interface CommandResult {
  stdout: string;
  stderr: string;
}

export interface CommandOptions {
  timeoutMs?: number;
  cwd?: string;
  signal?: AbortSignal;
}

export class CommandExecutionError extends Error {
  public readonly command: string;
  public readonly args: readonly string[];
  public readonly exitCode?: number;
  public readonly signal?: NodeJS.Signals;
  public readonly stdout?: string;
  public readonly stderr?: string;

  constructor(
    message: string,
    command: string,
    args: readonly string[],
    options: {
      exitCode?: number;
      signal?: NodeJS.Signals;
      stdout?: string;
      stderr?: string;
    }
  ) {
    super(message);
    this.name = 'CommandExecutionError';
    this.command = command;
    this.args = args;
    this.exitCode = options.exitCode;
    this.signal = options.signal;
    this.stdout = options.stdout;
    this.stderr = options.stderr;
  }
}

export const runCommand = async (
  command: string,
  args: readonly string[],
  options: CommandOptions = {}
): Promise<CommandResult> => {
  const timeoutMs = Math.max(options.timeoutMs ?? env.COMMAND_TIMEOUT_MS, 500);
  try {
    const result = await execFileAsync(command, args, {
      encoding: 'utf8',
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024,
      cwd: options.cwd,
      signal: options.signal
    });
    return {
      stdout: result.stdout.trim(),
      stderr: result.stderr.trim()
    };
  } catch (error) {
    const execError = error as NodeJS.ErrnoException & {
      code?: string;
      stdout?: string;
      stderr?: string;
      signal?: NodeJS.Signals;
      status?: number;
    };

    const exitCode = typeof execError.status === 'number' ? execError.status : undefined;
    throw new CommandExecutionError(
      `La commande ${command} a échoué`,
      command,
      args,
      {
        exitCode,
        signal: execError.signal,
        stdout: execError.stdout,
        stderr: execError.stderr
      }
    );
  }
};
