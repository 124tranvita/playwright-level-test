import { Page } from "@playwright/test";
import { DateHelper } from "../helpers/date-helper";
import { DatePicker } from "./date-picker";
import { FlightOccupancy } from "../types";
import { TIMEOUT } from "../config/constant";

export class SearchFlights {
  constructor(
    private page: Page,
    private datePicker: DatePicker,
  ) {}

  /**
   * Handle select Flying From (Origin) and Flying To (Destination)
   * @param from - Origin (e.g., SNG)
   * @param to - Destination (e.g., VLC)
   */
  async setFlightRoute(from: string, to: string) {
    // 1. Process Origin
    await this.page.locator("#flight-origin-search-input").fill(from);

    const fromSuggestion = this.page
      .locator(`[data-element-object-id="${from}"]`)
      .last();

    await fromSuggestion.waitFor({ state: "visible" });
    await fromSuggestion.click();

    // 2. Process Destination
    await this.page.locator("#flight-destination-search-input").fill(to);

    const toSuggestion = this.page
      .locator(`[data-element-object-id="${to}"]`)
      .last();

    await toSuggestion.waitFor({ state: "visible" });
    await toSuggestion.click();
  }

  /**
   * Handle select Flight Departure (One-way) or Departure/Return (Round-trip)
   * @param dayToAddsForDeparture - Number of days from the current day (e.g., 2)
   * @param dayToAddsForReturn - Number of days from the current day (e.g., 2)
   */
  async selectFightDate(
    dayToAddsForDeparture: number,
    dayToAddsForReturn?: number,
  ) {
    const flightCalendarContainer = this.page.locator(
      '[data-selenium="range-picker-date"]',
    );

    // Graduate Calendar is displayed
    try {
      await flightCalendarContainer.waitFor({
        state: "visible",
        timeout: TIMEOUT.State.Visible,
      });
    } catch (error) {
      await this.page.locator("#flight-departure").click();
    }

    const fullDate: string[] = [];
    const monthYear: string[] = [];

    const departureDate = DateHelper.getFutureDate(dayToAddsForDeparture);
    fullDate.push(departureDate.fullDate);
    monthYear.push(departureDate.monthYear);

    // Round-trip also require choose return date
    if (dayToAddsForReturn) {
      const returnDate = DateHelper.getFutureDate(dayToAddsForReturn);
      fullDate.push(returnDate.fullDate);
      monthYear.push(returnDate.monthYear);
    }

    await this.datePicker.selectDates(fullDate, monthYear);
  }

  /**
   * Handle select flight's occupancy information (e.g., adults, children, infants,...)
   * @param occupancy - { adults, children, infants, cabinClass }
   */
  async setFlightOccupancy(occupancy: FlightOccupancy) {
    const { adults = 1, children = 0, infants = 0, cabinClass } = occupancy;

    const setQuantity = async (
      selector: string,
      targetCount: number,
      currentDefault: number,
    ) => {
      const clickCount = targetCount - currentDefault;
      if (clickCount > 0) {
        const plusBtn = this.page.locator(`[data-element-name="${selector}"]`);
        for (let i = 0; i < clickCount; i++) {
          await plusBtn.click();
        }
      }
    };

    await setQuantity("flight-occupancy-adult-increase", adults, 1);
    await setQuantity("flight-occupancy-children-increase", children, 0);
    await setQuantity("flight-occupancy-infant-increase", infants, 0);

    if (cabinClass) {
      await this.page
        .locator(`[data-element-object-id="${cabinClass}"]`)
        .click();
    }
  }

  /**
   * Click on SEARCH FLIGHTS button
   */
  async flightSearch() {
    await this.page.locator('[data-component="flight-search-button"]').click();
  }
}
