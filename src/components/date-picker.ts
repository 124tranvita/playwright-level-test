import { Page } from "@playwright/test";

export class DatePicker {
  constructor(private page: Page) {}

  /**
   * Accept day and month-year, find the correct month-year on Calendar panel then select valua as provided day
   * @param day - Selected day
   * @param monthYear - Target month-year
   */
  async selectDate(day: string, monthYear: string) {
    const calendarContainer = this.page.locator(".DayPicker");
    const nextButton = this.page.locator(
      '[data-selenium="calendar-next-month-button"]',
    );

    // 1. Graduate Calendar is displayed
    try {
      await calendarContainer.waitFor({ state: "visible", timeout: 3000 });
    } catch (error) {
      await this.page.locator("#flight-departure").click();
    }

    // 2. Loop to find correct month/year (with limit)
    let limit = 0;
    while (limit < 12) {
      const currentMonthYear = await this.page
        .locator(".DayPicker-Caption")
        .first() // Take the value in the left panel (incase: Round- trip, calendar will has Departure - Return)
        .innerText();

      if (currentMonthYear.includes(monthYear)) {
        break; // Found target month-year
      }
      // Continue click next button untuk target month-year is found
      await nextButton.click();
      await this.page.waitForTimeout(500); // Wait for transition animation complete load
      limit++;
    }

    // 3. Select target date
    await this.page
      .locator(".PriceSurgePicker-Day")
      .filter({ hasText: new RegExp(`^${day}$`) }) // Find exactly (e.g., 1 will not match with 10)
      .first()
      .click();
  }

  /**
   * Handle select Check-in & Check-out for Hotel Booking
   * @param dates - Array of fullDate ["2026-02-20", "2026-02-25"]
   * @param monthYears - Array of Month-Year ["February 2026", "February 2026"]
   */
  async selectDatesForHotelBooking(dates: string[], monthYears: string[]) {
    const calendarContainer = this.page.locator(
      '[data-selenium="rangePickerCheckIn"]',
    );
    const nextButton = this.page.locator(
      '[data-selenium="calendar-next-month-button"]',
    );

    // 1. Graduate Calendar is displayed
    try {
      await calendarContainer.waitFor({ state: "visible", timeout: 3000 });
    } catch (error) {
      await this.page.locator("#check-in-box").click();
    }

    for (let i = 0; i < dates.length; i++) {
      const targetDate = dates[i];
      const targetMonthYear = monthYears[i];

      // 2. Loop to find correct month/year (with limit)
      let limit = 0;
      while (limit < 12) {
        const currentMonthYear = await this.page
          .locator(".DayPicker-Caption")
          .first()
          .innerText();

        if (currentMonthYear.includes(targetMonthYear)) {
          break;
        }
        await nextButton.click();
        await this.page.waitForTimeout(500); // Waiting for animation loaded
        limit++;
      }

      // 3. Select target date
      const dateLocator = this.page.locator(
        `span[data-selenium-date="${targetDate}"]`,
      );
      await dateLocator.click();

      // Waiting for UI ready to continue select check-out
      if (i === 0) await this.page.waitForTimeout(300);
    }
  }
}
