# Screenshot CLI

A screenshot CLI tool that automates the capture of URLs to a specified directory. It takes full-page or single viewport screenshots, accounts for lazy loaded images and content, handles fixed elements gracefully e.g. nav bars, and attempts to close any popups (using the escape key).

## Installation

To install the dependencies, run the following command in the terminal:

```bash
npm install
```

## Usage

To use the script, copy `urls-sample.txt` to `urls.txt` and add the URLs you want to take screenshots of, one URL per line. If you leave off the protocol, `https://` will be added.

```bash
https://www.nytimes.com
google.com
```

### Default Options:

If you run `npm start` or link and run `screenshot` and have a `urls.txt` present, the script will take desktop images at 1400x800 pixels, with a delay of 300ms between scroll events, and save the images to `~/Desktop/screenshots` as jpgs.

The scroll event delay is used to trigger lazy-loaded content by scrolling until the bottom of the page is reached and then back to the top. This should ensure enough time to load any lazy-loaded content and the page is fully rendered before taking the screenshot. Scrolling back to the top is necessary to ensure fixed nav bars are captured in the screenshot correctly.

```js
{
  "urls": "urls.txt", // urls are read from this file
  "width": 1400, // viewport
  "height": 800, // viewport
  "mobile": false, //desktop only
  "delay": 300,
  "ext": "jpg",
  "quality": 80,
  "single": false, // full-page
  "output": "~/Desktop/screenshots",
  "chrome": false // headless (no ui while running)
}
```

### Configurable Optione:

```bash
npm start -- [options]
```

where `[options]` are the command line options you can pass to the script:

## Options

| Command       | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| --help        | Print this usage guide                                                     |
| --chrome, -c  | Headed mode opens Chrome while taking screenshots (default: headless mode) |
| --delay, -d   | Delay between scroll events (default: 300)                                 |
| --ext, -e     | File extension to use: jpg or png (default: jpg)                           |
| --height, -y  | Viewport height in pixels (default: 800)                                   |
| --mobile, -m  | Mobile emulation mode (default: false)                                     |
| --output, -o  | Output directory (default: ~/Desktop/screenshots)                          |
| --quality, -q | Quality of images: 1-100 (default: 80, png is always 100)                  |
| --single, -s  | Screenshot of only the viewport without scrolling (default: false)         |
| --urls, -u    | List of urls: slack.com,stripe.com (default: urls.txt)                     |
| --width, -x   | Viewport width in pixels (default: 1400)                                   |

### Examples:

```bash
npm start -- --help
npm start -- -mu allbirds.com,stripe.com -e png
npm start -- --mobile --urls=allbirds.com,stripe.com --ext=png
npm start -- -msu allbirds.com
npm start -- --mobile --single --urls=allbirds.com,stripe.com
```

### Run globally:

To run the script globally, you can build the script and link it to your global node_modules folder.

```bash
npm run link
```

Then you can run the script from any directory using `screenshot`

```bash
screenshot --help
screenshot -mu allbirds.com,stripe.com -e png
screenshot --mobile --urls=allbirds.com,stripe.com --ext=png
screenshot -msu allbirds.com
screenshot --mobile --single --urls=allbirds.com,stripe.com
```

### Screenshot Example:

![nytimes_com](https://github.com/DaveAllbirds/playwright-lazy-screenshots/assets/94491191/659e2d80-cb12-4aba-826c-38329ec2608f)
