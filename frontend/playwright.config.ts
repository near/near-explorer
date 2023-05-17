import { defineConfig, devices, Project, selectors } from "@playwright/test";

selectors.register("class", () => {
  const getClassSelector = (className: string) => `[class*="c-${className}-"]`;
  return {
    query: (root: Document, className: string) =>
      root.querySelector(getClassSelector(className)),
    queryAll: (root: Document, className: string) =>
      Array.from(root.querySelectorAll(getClassSelector(className))),
  };
});

const FRONTEND_PORT = Number(process.env.PORT) || 3000;
const FRONTEND_BASE_URL = `http://localhost:${FRONTEND_PORT}`;
const BACKEND_BASE_URL = "http://localhost:10000";

const visualProjectsMatch = "tests/visual/**/*.spec.ts";
// Will get reenabled when mocks will be implemented
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const visualProjects: Project[] = [
  {
    name: "<breakpoint>-<browser>",
    use: {
      // or ...devices["Desktop Firefox"] or ...devices["Desktop Safari"] etc
      ...devices["Desktop Chrome"],
      // Set width & height for each expected breakpoint
      viewport: { width: 1440, height: 1000 },
    },
    testMatch: visualProjectsMatch,
  },
];

const functionalProject: Project = {
  name: "functional",
  use: { ...devices["Desktop Chrome"] },
  testMatch: "tests/@(functional|pages)/**/*.spec.ts",
};

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: FRONTEND_BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  projects: [functionalProject],
  // TODO: reenable visual tests when mocks will be implemented
  // projects: [...visualProjects, functionalProject],

  /* Run local dev server before starting the tests */
  webServer: [
    {
      cwd: "..",
      command: "npm run -w frontend start",
      reuseExistingServer: !(process.env.CI || process.env.PW_SERVER),
      url: `${FRONTEND_BASE_URL}/api/ping`,
    },
    {
      cwd: "..",
      command: "npm run -w backend start:mainnet",
      reuseExistingServer: !(process.env.CI || process.env.PW_SERVER),
      url: `${BACKEND_BASE_URL}/global-state`,
      env: {
        DB_NAME_PREFIX: "test",
      },
    },
  ],
});
