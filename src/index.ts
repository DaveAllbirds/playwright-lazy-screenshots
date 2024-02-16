#!/usr/bin/env node

import path from 'path';
import progress from 'cli-progress';
import { type Browser, chromium, devices, type Page, type BrowserContext } from 'playwright';

import { parseArguments } from './argumentParser';
import { scrollToTopOrBottom } from './scrollUtils';
import { ensureDirectoryExists, formatUrl, openDirectory, readUrls } from './fileUtils';

export async function main(): Promise<void> {
  const {
    chrome,
    delay,
    ext,
    height,
    mobile,
    output: outputDirectory,
    quality,
    single,
    urls: cliUrls,
    width,
  } = parseArguments(process.argv);

  const browser: Browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--lang=en-US,en;q=0.9'],
    devtools: false,
    headless: !chrome,
  });

  const context: BrowserContext = await browser.newContext({
    ...(mobile ? devices['iPhone 13'] : {}),
  });

  const progressBar = new progress.MultiBar(
    {
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      format: `Progress | [{bar}] | {percentage}% {value}/{total} Steps | {fullUrl}`,
      hideCursor: false,
    },
    progress.Presets.shades_grey,
  );

  try {
    const fullDirectoryPath = ensureDirectoryExists(outputDirectory);

    const extention = ext ?? 'jpg';
    const urls: string[] = cliUrls?.length ? cliUrls : readUrls('urls.txt');
    const stepsPerUrl = single ? 3 : 4;

    openDirectory(fullDirectoryPath, (error) => {
      console.error(error);
    });

    for (const url of urls) {
      const fullUrl: string = formatUrl(url);
      const currentBar = progressBar.create(stepsPerUrl, 0, { fullUrl });
      const page: Page = await context.newPage();
      const { hostname, pathname } = new URL(fullUrl);
      const imageName: string = `${hostname}${pathname}`.replaceAll(/[^\dA-Za-z]/g, '_');
      const sizeFlag: string = mobile ? '_mobile' : '_desktop';

      if (!mobile) {
        await page.setViewportSize({
          height,
          width,
        });
      }

      await page.goto(fullUrl, { waitUntil: 'load' });
      currentBar.increment(1, { fullUrl });

      await page.keyboard.down('Escape'); // Close modals
      await page.keyboard.down('Escape'); // Close modals Again
      currentBar.increment(1, { fullUrl });

      if (!single) {
        await scrollToTopOrBottom(page, delay, 'bottom');
        await page.waitForTimeout(1000);
        await scrollToTopOrBottom(page, delay, 'top');
        currentBar.increment(1, { fullUrl });
      }

      await page.screenshot({
        animations: 'disabled',
        fullPage: !single,
        path: path.join(fullDirectoryPath, `${imageName}${sizeFlag}.${ext}`),
        ...(extention === 'png' ? {} : { quality }),
      });
      currentBar.increment(1, { fullUrl });

      await page.close({ runBeforeUnload: false });
    }

    progressBar.stop();
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
}

if (process.env.TEST !== '1') {
  main().catch((error: Error) => {
    console.error(error.message);
    process.exit(1);
  });
}
