import { test, expect, type Page } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import { writeFile } from "node:fs/promises";

const hugoBase = process.env.HUGO_BASE_URL ?? "http://localhost:4173";
const nextBase = process.env.NEXT_BASE_URL ?? "http://localhost:4174";
const maxDiffRatio = Number(process.env.PARITY_MAX_DIFF_RATIO ?? "0.05");

const routes = [
  "/",
  "/posts/",
  "/portfolios/",
  "/portfolios/myslife-mobile-app/",
] as const;

test.describe("Hugo vs Next parity (visual)", () => {
  for (const route of routes) {
    test(`route ${route}`, async ({ page }, testInfo) => {
      const hugoUrl = `${hugoBase}${route}`;
      const nextUrl = `${nextBase}${route}`;

      await page.goto(hugoUrl, { waitUntil: "networkidle" });
      await waitForCriticalAssets(page, route);
      await page.evaluate(() => window.scrollTo(0, 0));
      const hugoShot = await page.screenshot({ fullPage: true });
      await writeFile(testInfo.outputPath(`hugo__${snapshotNameForRoute(route)}`), hugoShot);

      await page.goto(nextUrl, { waitUntil: "networkidle" });
      await waitForCriticalAssets(page, route);
      await page.evaluate(() => window.scrollTo(0, 0));
      const nextShot = await page.screenshot({ fullPage: true });
      await writeFile(testInfo.outputPath(`next__${snapshotNameForRoute(route)}`), nextShot);

      const diffRatio = await comparePngs({
        hugoPng: hugoShot,
        nextPng: nextShot,
        outDiffPath: testInfo.outputPath(`diff__${snapshotNameForRoute(route)}`),
      });

      expect(diffRatio, `Diff ratio for ${route} was ${diffRatio}`).toBeLessThanOrEqual(maxDiffRatio);
    });
  }
});

function snapshotNameForRoute(route: string) {
  const safe = route === "/" ? "home" : route.replaceAll("/", "_").replace(/^_+|_+$/g, "");
  return `next-parity__${safe}.png`;
}

async function waitForCriticalAssets(page: Page, route: string) {
  const patterns: RegExp[] =
    route === "/"
      ? [/star-background/i]
      : [/\/hero\.(png|jpg|jpeg|webp)(\?|$)/i];

  for (const pattern of patterns) {
    await page
      .waitForResponse((r) => pattern.test(r.url()) && r.status() === 200, {
        timeout: 5000,
      })
      .catch(() => undefined);
  }

  await page.waitForTimeout(750);
}

async function comparePngs({
  hugoPng,
  nextPng,
  outDiffPath,
}: {
  hugoPng: Buffer;
  nextPng: Buffer;
  outDiffPath: string;
}) {
  const img1 = PNG.sync.read(hugoPng);
  const img2 = PNG.sync.read(nextPng);

  const width = Math.min(img1.width, img2.width);
  const height = Math.min(img1.height, img2.height);

  const cropped1 = crop(img1, width, height);
  const cropped2 = crop(img2, width, height);

  const diff = new PNG({ width, height });
  const diffPixels = pixelmatch(cropped1.data, cropped2.data, diff.data, width, height, {
    threshold: 0.1,
    includeAA: true,
  });

  await writeFile(outDiffPath, PNG.sync.write(diff));
  return diffPixels / (width * height);
}

function crop(img: PNG, width: number, height: number) {
  if (img.width === width && img.height === height) return img;

  const out = new PNG({ width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (img.width * y + x) << 2;
      const o = (width * y + x) << 2;
      out.data[o] = img.data[i];
      out.data[o + 1] = img.data[i + 1];
      out.data[o + 2] = img.data[i + 2];
      out.data[o + 3] = img.data[i + 3];
    }
  }
  return out;
}
