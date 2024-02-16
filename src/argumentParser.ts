import { program } from 'commander';

export function parseArguments(argv: string[]): {
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
} {
  program
    .description(
      'A screenshot CLI tool that automates the capture of URLs to a specified directory. It takes full-page or single viewport screenshots, accounts for lazy loaded images and content, handles fixed elements gracefully e.g. nav bars, and attempts to close any popups (using the escape key).',
    )
    .option('-c, --chrome', 'Use headed mode to Chrome while taking screenshots', false)
    .option('-e, --ext <jpg>', 'File extension to use: jpg or png', 'jpg')
    .option('-m, --mobile', 'Mobile emulation mode', false)
    .option('-o, --output <path>', 'Output directory for screenshots', '~/Desktop/screenshots')
    .option('-q, --quality <number>', 'Quality of jpgs: 1-100', parseFloat, 80)
    .option('-s, --single', 'Capture the intial viewport without scrolling', false)
    .option('-d, --delay <delay>', 'Delay for viewport scroll events-triggering lazy-loaded content', parseFloat, 300)
    .option('-u, --urls <url,url,url>', 'Comma-separated list of urls to capture (default: urls.txt)', (value) =>
      value.trim().split(','),
    )
    .option('-x, --width <width>', 'Desktop viewport width', parseFloat, 1280)
    .option('-y, --height <height>', 'Desktop viewport height', parseFloat, 768);
  program.parse(argv);
  return program.opts();
}
