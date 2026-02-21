import { Page } from "@playwright/test";
import { DateHelper } from "../helpers/date-helper";
import { TIMEOUT } from "../config/constant";

export class DatePicker {
  constructor(private page: Page) {}
  /**
   * Handle select dates for Agoda Booking (e.g., Hotels, Flights,...)
   * @param dates - Array of Full Date ["2026-02-20", "2026-02-25"]
   * @param monthYears - Array of Month-Year ["February 2026", "February 2026"]
   */
  async selectDates(dates: string[], monthYears: string[]) {
    const nextButton = this.page.locator(
      '[data-selenium="calendar-next-month-button"]',
    );
    const prevButton = this.page.locator(
      '[data-selenium="calendar-previous-month-button"]',
    );

    for (let i = 0; i < dates.length; i++) {
      const targetDate = dates[i];
      const targetMonthYear = monthYears[i];

      const targetValue = DateHelper.getMonthValue(targetMonthYear);

      // Loop to find correct month/year (with limit)
      let limit = 0;
      while (limit < 12) {
        const currentMonthYear = await this.page
          .locator(".DayPicker-Caption")
          .first()
          .innerText();

        if (currentMonthYear.includes(targetMonthYear)) {
          break;
        }

        const currentValue = DateHelper.getMonthValue(targetMonthYear);

        if (targetValue > currentValue) {
          await nextButton.click();
        } else {
          await prevButton.click();
        }

        await this.page.waitForTimeout(TIMEOUT.Animation); // Waiting for animation loaded
        limit++;
      }

      // Select target date
      const dateLocator = this.page.locator(
        `span[data-selenium-date="${targetDate}"]`,
      );
      await dateLocator.click();

      // Waiting for UI ready to continue select check-out
      if (i === 0) await this.page.waitForTimeout(TIMEOUT.StableUI);
    }
  }
}
