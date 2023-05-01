import {
  Response,
  test as base,
  Dialog,
  expect,
  Locator,
  Page,
} from "@playwright/test";
import { ParsedUrlQuery, stringify } from "querystring";

type OpenFixture = {
  openPage: (url: string) => Promise<Response | null>;
  openPath: (path: string, query?: ParsedUrlQuery) => Promise<Response | null>;
  waitForAlert: (fn: () => unknown | Promise<unknown>) => Promise<Dialog>;
  getExpectTextInBlock: (
    wrapperSelector: string,
    titleSelector: string,
    textSelector: string,
    startLocator?: Locator | Page
  ) => (titleText: string | RegExp, expected: string | RegExp) => Promise<void>;
};

export const openFixture = base.extend<OpenFixture>({
  openPage: async ({ page }, use) => {
    await use(async (url) => {
      const response = await page.goto(url);
      await page.waitForLoadState();
      await page.evaluate(() => document.fonts.ready);
      return response;
    });
  },

  openPath: async ({ openPage }, use) => {
    await use(async (path, query) => {
      const stringifiedQuery = stringify({ locale: "en", ...query });
      return openPage(`${path}?${stringifiedQuery}`);
    });
  },

  waitForAlert: async ({ page }, use) => {
    await use(async (fn) => {
      let alert: Dialog | undefined;
      page.on("dialog", (dialog) => {
        if (dialog.type() !== "alert") {
          return;
        }
        alert = dialog;
      });
      await fn();
      await expect
        .poll(() => Boolean(alert), {
          message: "Make sure alert is being open",
        })
        .toBe(true);
      return alert!;
    });
  },

  getExpectTextInBlock: async ({ page }, use) => {
    await use(
      (wrapperSelector, titleSelector, textSelector, startLocator = page) =>
        async (titleText, expected) => {
          const wrapperLocator = startLocator.locator(wrapperSelector);
          const titleLocator = (
            "page" in startLocator ? startLocator.page() : startLocator
          )
            .locator(titleSelector)
            .getByText(titleText, { exact: true });
          const detailedWrapperLocator = wrapperLocator.filter({
            has: titleLocator,
          });
          const textLocator = detailedWrapperLocator.locator(textSelector);
          try {
            await expect(textLocator).toHaveText(expected);
          } catch (e) {
            // Debug information
            const wrapperCount = await wrapperLocator.count();
            if (wrapperCount === 0) {
              throw new Error(
                `Wrapper with selector "${wrapperSelector}" is not visible`
              );
            }
            const titleCount = await titleLocator.count();
            if (titleCount === 0) {
              throw new Error(
                `Title with selector "${titleSelector}" is not visible`
              );
            }
            const detailedWrapperLocatorCount =
              await detailedWrapperLocator.count();
            if (detailedWrapperLocatorCount === 0) {
              throw new Error(
                `Wrapper with selector "${wrapperSelector}" with title selected by "${titleSelector}" is not visible`
              );
            }
            if (detailedWrapperLocatorCount > 1) {
              throw new Error(
                `There are more than 1 wrappers with selector "${wrapperSelector}" with title selected by "${titleSelector}"`
              );
            }
            const textCount = await textLocator.count();
            if (textCount === 0) {
              throw new Error(
                `Text with selector "${textSelector}" is not visible`
              );
            }
            throw e;
          }
        }
    );
  },
});
