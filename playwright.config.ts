import type { PlaywrightTestConfig } from '@playwright/test';
import { devices } from '@playwright/test';

const baseURL = process.env.DOMAIN;

const date = new Date().toISOString().slice(0, 10);
const outputDir = `./test-results/${date}`;

// enable this if you have self sign certificate error on local env only!!
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const config: PlaywrightTestConfig = {
    testDir: './tests',
    /* Maximum time one test can run for. */
    timeout: 30 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 5000
    },
    /* Run tests in files in parallel */
    // fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: 0,
    /* Opt out of parallel tests on CI. */
    workers: 5,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: [
        [
            'monocart-reporter',
            {
                name: `Visual Tests / Date: ${date} / URL: ${baseURL}`,
                outputFile: `${outputDir}/index.html`,
                onEnd: async (reportData) => {
                    console.log('Test finished. Generating report...');
                }
            }
        ],
        ['list']
    ],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        ignoreHTTPSErrors: true,
        viewport: { height: 1000, width: 1200 },
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL,
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'off'
        // video: {
        //     mode: 'on-first-retry',
        //     size: { width: 640, height: 480 }
        // }
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                trace: 'off',
                viewport: { height: 1000, width: 1200 },
                screenshot: 'only-on-failure'
                // video: 'on-first-retry'
            }
        }

        // {
        //     name: 'firefox',
        //     use: {
        //         trace: 'retain-on-failure',
        //         ...devices['Desktop Firefox'],
        //         viewport: { height: 1000, width: 1200 },
        //     },
        // },

        // {
        //     name: 'webkit',
        //     use: {
        //         trace: 'retain-on-failure',
        //         ...devices['Desktop Safari'],
        //         viewport: { height: 1000, width: 1200 },
        //     },
        // },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: {
        //     ...devices['Pixel 5'],
        //   },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: {
        //     ...devices['iPhone 12'],
        //   },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: {
        //     channel: 'msedge',
        //   },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: {
        //     channel: 'chrome',
        //   },
        // },
    ]

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   port: 3000,
    // },
};

export default config;
