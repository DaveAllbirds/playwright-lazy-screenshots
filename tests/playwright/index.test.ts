import { expect } from '@playwright/test';
import { test } from './setup';

test('with url, width, and height', async ({ height, page, urls, width }) => {
  await page.setViewportSize({ height, width });
  await page.goto(urls[0], { waitUntil: 'load' });
  const innerWidth = await page.evaluate(() => window.innerWidth);
  const innerHeight = await page.evaluate(() => window.innerHeight);
  expect(innerWidth).toBe(width);
  expect(innerHeight).toBe(height);
  await expect(page).toHaveURL(urls[0]);
});
