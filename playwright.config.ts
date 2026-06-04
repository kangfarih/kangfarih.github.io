import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: 0,
  webServer: [
    {
      command: "python3 -m http.server 4173",
      cwd: "./hugo-public",
      url: "http://localhost:4173/",
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: "npm run dev -- --port 4174 --webpack",
      cwd: ".",
      url: "http://localhost:4174/",
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
  use: {
    browserName: "chromium",
    viewport: { width: 1280, height: 720 },
    screenshot: "only-on-failure",
  },
});
