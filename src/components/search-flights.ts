import { Page } from "@playwright/test";
import { DateHelper } from "../helpers/date-helper";
import { DatePicker } from "./date-picker";
import { FlightOccupancy } from "../types";

export class SearchFlights {
  constructor(
    private page: Page,
    private datePicker: DatePicker,
  ) {}

  /**
   * Set Flying From and Flying To
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
   * Set Flight Departure (One-way) or Departure/Return (Round-trip)
   * @param dayToAdds
   */
  async selectFightDate(dayToAdds: number) {
    const departure = DateHelper.getFutureDate(dayToAdds);
    this.datePicker.selectDate(departure.day, departure.monthYear);
  }

  /**
   * Set the occupancy information (e.g., adults, children, infants,...)
   * @param occupancy - Fligth occupancy object
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
