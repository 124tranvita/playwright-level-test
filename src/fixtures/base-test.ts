import { test as base } from "@playwright/test";
import { HomePage } from "../pages/home-page";
import { ALL_BLACKLISTED, MOCK_API } from "../config/network-config";
import { ResultPage } from "../pages/result-page";
// import * as mockApiRes from "../config/mock-api-data";

type PagesFixtures = {
  homePage: HomePage;
  resultPage: ResultPage;
};

export const test = base.extend<PagesFixtures>({
  context: async ({ browser }, user) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      locale: "en-US",
    });

    await context.addCookies([
      {
        name: "agoda.consent",
        value: "VN||2026-02-19 12:31:33Z",
        domain: ".agoda.com",
        path: "/",
      },
    ]);

    await context.route("**/*", (route) => {
      const url = route.request().url();
      if (ALL_BLACKLISTED.some((domain) => url.includes(domain))) {
        return route.abort();
      }

      const matchedMock = MOCK_API.find((mock) =>
        url.includes(mock.api.replace(/\*/g, "")),
      );

      if (matchedMock) {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(matchedMock.res),
        });
      }

      const type = route.request().resourceType();
      if (["image", "media"].includes(type)) {
        return route.abort();
      }

      return route.continue();
    });

    // Add init script to avoid Google signin popup display
    await context.addInitScript(() => {
      (window as any).google = {
        accounts: {
          id: {
            initialize: () => {},
            prompt: () => {},
            disableAutoSelect: () => {},
            renderButton: () => {},
          },
        },
      };
    });

    await user(context);
    await context.close(); // Automatically close context after test done
  },

  homePage: async ({ page }, use, testInfo) => {
    const homePage = new HomePage(page, testInfo);
    await use(homePage);
  },

  resultPage: async ({ page }, use, testInfo) => {
    const resultPage = new ResultPage(page, testInfo);
    await use(resultPage);
  },
});

export { expect } from "@playwright/test";
