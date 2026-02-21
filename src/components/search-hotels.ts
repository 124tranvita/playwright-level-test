import { expect, Locator, Page } from "@playwright/test";
import { DateHelper } from "../helpers/date-helper";
import { DatePicker } from "./date-picker";
import { HotelOccupancy } from "../types";
import { TIMEOUT } from "../config/constant";

export class SearchHotels {
  constructor(
    private page: Page,
    private datePicker: DatePicker,
  ) {}

  /**
   * Handle select the hotel for booking
   * @param hotelName - Hotel name
   */
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

  /**
   * Handle select Check-in/Check-out date for Hotel booking
   * @param dayToAddsForCheckInDate - Number of days from the current day (e.g., 2)
   * @param dayToAddsForCheckOutDate  - Number of days from the current day (e.g., 3)
   */
  async selectStayingDates(
    dayToAddsForCheckInDate: number,
    dayToAddsForCheckOutDate: number,
  ) {
    const hotelCalendarContainer = this.page.locator(
      '[data-selenium="rangePickerCheckIn"]',
    );

    // Graduate Calendar is displayed
    try {
      await hotelCalendarContainer.waitFor({
        state: "visible",
        timeout: TIMEOUT.State.Visible,
      });
    } catch (error) {
      await this.page.locator("#check-in-box").click();
    }

    const checkIn = DateHelper.getFutureDate(dayToAddsForCheckInDate);
    const checkOut = DateHelper.getFutureDate(dayToAddsForCheckOutDate);

    await this.datePicker.selectDates(
      [checkIn.fullDate, checkOut.fullDate],
      [checkIn.monthYear, checkOut.monthYear],
    );
  }

  /**
   * Handle select hotel's occupancy information (e.g., adults, children, infants,...)
   * @param occupancy - { room, adults, children, childrenAges (if any) }
   */
  async setHotelOccupancy(occupancy: HotelOccupancy) {
    const {
      room = 1,
      adults = 2,
      children = 0,
      childrenAges = [8, 8],
    } = occupancy;

    const setQuantity = async (
      btnElement: string,
      targetCount: number,
      currentDefault: number,
      displayLocator: Locator,
    ) => {
      const diff = targetCount - currentDefault;
      if (diff === 0) return;

      // Define if need increase or decrease value
      const isIncrease = diff > 0;

      const buttonSelector = isIncrease
        ? `[data-element-name="${btnElement}"][data-selenium="plus"]`
        : `[data-element-name="${btnElement}"][data-selenium="minus"]`;

      const btn = this.page.locator(buttonSelector);
      const clickCount = Math.abs(diff);

      for (let i = 0; i < clickCount; i++) {
        await btn.waitFor({ state: "visible" });
        if (await btn.isEnabled()) {
          await btn.click();
        }
      }

      await expect(displayLocator).toHaveText(`${targetCount}`);
    };

    const roomDisplayLocator = this.page.locator(
      '[data-selenium="desktop-occ-room-value"]',
    );
    const adultDisplayLocator = this.page.locator(
      '[data-selenium="desktop-occ-adult-value"]',
    );
    const childrenDisplayLocator = this.page.locator(
      '[data-selenium="desktop-occ-children-value"]',
    );

    await setQuantity(
      "occupancy-selector-panel-rooms",
      room,
      1,
      roomDisplayLocator,
    );
    await setQuantity(
      "occupancy-selector-panel-adult",
      adults,
      2,
      adultDisplayLocator,
    );
    await setQuantity(
      "occupancy-selector-panel-children",
      children,
      0,
      childrenDisplayLocator,
    );

    if (children > 0) {
      await this.selectAgeOfChild(childrenAges);
    }
  }

  /**
   * Handle select the age of children appear on occupancy information
   * @param childrenAges - Array of children age
   */
  async selectAgeOfChild(childrenAges: number[]) {
    const selectAgeOfchildLocator = this.page.locator(
      '[data-element-name="occ-child-age-dropdown"]',
    );

    // Wait at least first element is stable
    await selectAgeOfchildLocator.first().waitFor({ state: "visible" });

    // Get the dropdown array when UI is stable
    const dropdowns = await selectAgeOfchildLocator.all();

    for (const [index, item] of dropdowns.entries()) {
      await item.click();

      const age = childrenAges[index] || 8;
      const listOfAgeLocator = this.page.getByTestId(
        `child-ages-dropdown-${index}-${age}`,
      );

      await listOfAgeLocator.waitFor({
        state: "visible",
        timeout: TIMEOUT.State.Visible,
      });
      await listOfAgeLocator.click();
    }
  }

  /**
   * Click on HOTEL SEARCH button
   */
  async hotelSearch() {
    await this.page.locator('[data-element-name="search-button"]').click();
  }
}
