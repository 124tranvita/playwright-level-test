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
}
