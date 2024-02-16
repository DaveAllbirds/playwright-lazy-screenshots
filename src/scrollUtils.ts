import { type Page } from 'playwright';

export async function scrollToTopOrBottom(page: Page, delay: number, direction: string): Promise<void> {
  await page.evaluate(
    async ({ delay, direction }: { delay: number; direction: string }): Promise<void> => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = direction === 'bottom' ? window.innerHeight * 0.8 : -window.innerHeight * 0.8;
        const timer = setInterval(() => {
          const { scrollHeight } = document.body;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (
            (direction === 'bottom' && totalHeight >= scrollHeight) ||
            (direction === 'top' && window.scrollY === 0)
          ) {
            clearInterval(timer);
            resolve(null);
          }
        }, delay);
      });
    },
    {
      delay,
      direction,
    },
  );
}
