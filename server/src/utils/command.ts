import { execFile } from 'child_process';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

export interface CommandResult {
  stdout: string;
  stderr: string;
}

export const runCommand = async (command: string, args: readonly string[]): Promise<CommandResult> => {
  const result = await execFileAsync(command, args, { encoding: 'utf8' });
  return {
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim()
  };
};
