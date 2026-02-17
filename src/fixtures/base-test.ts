import { test as base } from "@playwright/test";
import { HomePage } from "../pages/home-page";
import { ALL_BLACKLISTED } from "../config/network-config";
import { ResultPage } from "../pages/result-page";

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

    await context.route("**/*", (route) => {
      const url = route.request().url();
      if (ALL_BLACKLISTED.some((domain) => url.includes(domain))) {
        return route.abort();
      }
      route.continue();
    });

    await context.route("**/*", (route) => {
      const type = route.request().resourceType();
      if (["image", "media"].includes(type)) {
        route.abort();
      } else {
        route.continue();
      }
    });

    await user(context);
    await context.close(); // Automatically close context after test done
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  resultPage: async ({ page }, use) => {
    const resultPage = new ResultPage(page);
    await use(resultPage);
  },
});

export { expect } from "@playwright/test";
