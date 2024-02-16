import fs from 'fs';
import path from 'path';
import os from 'os';

import { ensureDirectoryExists, formatUrl, readUrls, untildify } from '../../src/fileUtils';

it('should replace leading ~ with home directory', () => {
  const homeDirectory = os.homedir();
  const input = '~/path/to/file';
  const expected = `${homeDirectory}/path/to/file`;
  const output = untildify(input);
  expect(output).toBe(expected);
});

it('should return path unchanged if no leading ~', () => {
  const input = '/some/path';
  const output = untildify(input);
  expect(output).toBe(input);
});

it('ensureDirectoryExists should create directory if it does not exist', () => {
  const testDir = './testDir';
  if (fs.existsSync(testDir)) {
    fs.rmdirSync(testDir, { recursive: true });
  }
  ensureDirectoryExists(testDir);
  expect(fs.existsSync(testDir)).toBeTruthy();
  fs.rmdirSync(testDir, { recursive: true });
});

it('formatUrl should add https protocol if not present', () => {
  const url = 'www.example.com';
  const formattedUrl = formatUrl(url);
  expect(formattedUrl).toBe('https://www.example.com');
});

it('formatUrl should not change url if protocol is present', () => {
  const url = 'http://www.example.com';
  const formattedUrl = formatUrl(url);
  expect(formattedUrl).toBe('http://www.example.com');
});

it('readUrls should read urls from file', () => {
  const filePath = path.join(__dirname, 'testUrls.txt');
  fs.writeFileSync(filePath, 'www.example1.com\nwww.example2.com\n');
  const urls = readUrls(filePath);
  expect(urls).toEqual(['www.example1.com', 'www.example2.com']);
  fs.unlinkSync(filePath);
});
