import { Page } from "@playwright/test";
import { DateHelper } from "../helpers/date-helper";
import { DatePicker } from "./date-picker";
import { HotelOccupancy } from "../types";

export class SearchHotels {
  constructor(
    private page: Page,
    private datePicker: DatePicker,
  ) {}

  async selectBookingHotel(hotelName: string) {
    const searchLocator = this.page.locator("#autocomplete-box");
    const searchInputLocator = this.page.locator("#textInput");
    await searchLocator.waitFor({ state: "visible" });
    await searchLocator.click();

    await searchInputLocator.fill(hotelName);

    const suggestListLocator = this.page.getByTestId("autocomplete-list-box");
    await suggestListLocator.waitFor({ state: "visible" });

    await suggestListLocator
      .locator("li")
      .filter({ hasText: hotelName })
      .first()
      .click();
  }

  async selectHotelStayingDates(
    dayToAddsForCheckIn: number,
    dayToAddsForCheckOut: number,
  ) {
    const checkIn = DateHelper.getFutureDate(dayToAddsForCheckIn);
    const checkOut = DateHelper.getFutureDate(dayToAddsForCheckOut);

    await this.datePicker.selectDatesForHotelBooking(
      [checkIn.fullDate, checkOut.fullDate],
      [checkIn.monthYear, checkOut.monthYear],
    );
  }

  async setHotelOccupancy(occupancy: HotelOccupancy) {
    const { room = 1, adults = 2, children = 0 } = occupancy;

    const setQuantity = async (
      selector: string,
      targetCount: number,
      currentDefault: number,
    ) => {
      const diff = targetCount - currentDefault;
      if (diff === 0) return;

      // Define if need increase or decrease value
      const isIncrease = diff > 0;

      const buttonSelector = isIncrease
        ? `[data-element-name="${selector}"][data-selenium="plus"]`
        : `[data-element-name="${selector}"][data-selenium="minus"]`;

      const btn = this.page.locator(buttonSelector);
      const clickCount = Math.abs(diff);

      for (let i = 0; i < clickCount; i++) {
        await btn.waitFor({ state: "visible" });
        if (await btn.isEnabled()) {
          await btn.click();
          await this.page.waitForTimeout(300);
        }
      }
    };

    await setQuantity("occupancy-selector-panel-rooms", room, 1);
    await setQuantity("occupancy-selector-panel-adult", adults, 2);
    await setQuantity("occupancy-selector-panel-children", children, 0);
  }

  /**
   * Click on SEARCH button
   */
  async hotelSearch() {
    await this.page.locator('[data-component="search-button"]').click();
  }
}
