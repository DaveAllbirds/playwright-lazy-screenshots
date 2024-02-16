import { test as base } from '@playwright/test';

export type TestOptions = {
  chrome: boolean;
  delay: number;
  ext: 'jpg' | 'png';
  height: number;
  mobile: boolean;
  output: string;
  quality: number;
  single: boolean;
  urls: string[];
  view: boolean;
  width: number;
};

export const test = base.extend<TestOptions>({
  chrome: [true, { option: true }],
  delay: [375, { option: true }],
  ext: ['jpg', { option: true }],
  height: [800, { option: true }],
  mobile: [false, { option: true }],
  output: ['screenshots', { option: true }],
  quality: [80, { option: true }],
  single: [false, { option: true }],
  urls: [['https://www.allbirds.com'], { option: true }],
  view: [false, { option: true }],
  width: [1400, { option: true }],
});
