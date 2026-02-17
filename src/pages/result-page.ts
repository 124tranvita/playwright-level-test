import { expect, Page } from "@playwright/test";
import { FlightOccupancy } from "../types";

export class ResultPage {
  constructor(private page: Page) {}

  /**
   * Verify page URL of result page
   */
  async verifyFlightsResultURL() {
    await expect(this.page).toHaveURL(/.*flights\/results/, { timeout: 30000 });
  }

  /**
   * Verify the information of first card (best card) in result list
   * @param origin - Origin
   * @param destination - Destination
   */
  async verifyFirstFlightDisplay(origin: string, destination: string) {
    const firstFlightCard = this.page
      .locator('[data-testid="flightCard-flight-detail"]')
      .first();
    await firstFlightCard.waitFor({ state: "visible" });

    await expect(firstFlightCard.getByTestId("departure-time")).toBeVisible();
    await expect(firstFlightCard.getByTestId("arrival-time")).toBeVisible();
    await expect(firstFlightCard.getByTestId("origin")).toHaveText(origin);
    await expect(firstFlightCard.getByTestId("destination")).toHaveText(
      destination,
    );

    const priceLocator = firstFlightCard
      .getByTestId("flight-price-breakdown")
      .locator('[dir="ltr"]')
      .last();
    await expect(priceLocator).toHaveText(/[\d,.]+/);

    await firstFlightCard.click();
    await expect(this.page.getByTestId("flight-details-expand")).toBeVisible();
  }

  /**
   * Verify flight booking occupancy information
   * @param occupancy - Fligth occupancy object
   */
  async verifyFlightOccupancy(occupancy: FlightOccupancy) {
    const { adults, children, infants, cabinClass } = occupancy;

    const flightPassengersLocator = this.page
      .locator('[data-element-name="flight-occupancy"]')
      .getByTestId("selection-popover");

    await flightPassengersLocator.waitFor({ state: "visible" });
    await flightPassengersLocator.click();

    await expect(
      this.page.locator('[data-component="adults-count"]'),
    ).toHaveText(`${adults}`);

    await expect(
      this.page.locator('[data-component="children-count"]'),
    ).toHaveText(`${children}`);

    await expect(
      this.page.locator('[data-component="infants-count"]'),
    ).toHaveText(`${infants}`);

    await expect(
      this.page.locator('[data-element-name="flight-cabin-class"]'),
    ).toHaveText(`${cabinClass}`, { ignoreCase: true });
  }
}
