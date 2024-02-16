import { exec, type ExecException } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

interface LogError {
  (error: Error): void;
}

export function untildify(pathWithTilde: string): string {
  const homeDirectory = os.homedir();
  if (typeof pathWithTilde !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof pathWithTilde}`);
  }
  return homeDirectory ? pathWithTilde.replace(/^~(?=$|\/|\\)/, homeDirectory) : pathWithTilde;
}

export function ensureDirectoryExists(outputPath: string): string {
  const resolvedPath = path.resolve(untildify(outputPath));
  fs.mkdirSync(resolvedPath, { recursive: true });
  return resolvedPath;
}

export function formatUrl(url: string): string {
  if (!url) return '';
  let urlWithProtocol = url;
  if (!/^[A-Za-z]+:\/\//.test(urlWithProtocol)) {
    urlWithProtocol = `https://${urlWithProtocol}`;
  }
  return urlWithProtocol;
}

export function openDirectory(path: string, logError: LogError): void {
  try {
    const openCommand = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';

    exec(`${openCommand} "${path}"`, (error: ExecException | null): void => {
      if (error) {
        logError(error as Error);
      }
    });
  } catch (error: unknown) {
    logError(error as Error);
  }
}

export function readUrls(filePath: string): string[] {
  return fs
    .readFileSync(filePath, { encoding: 'utf8' })
    .split('\n')
    .filter((url) => url.trim() !== '');
}
