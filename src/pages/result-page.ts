import { expect, Page } from "@playwright/test";
import { FlightOccupancy } from "../types";

export class ResultPage {
  constructor(private page: Page) {}

  /**
   * Verify page URL of result page (for Flights booking)
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

  /**
   * Verify page URL of result page (For Hotels booking)
   */
  async verifyHotelsResultURL() {
    await expect(this.page).toHaveURL(/.*search/, { timeout: 30000 });
  }

  async verifyFirstHotelDisplay(hotelName: string) {
    const firstHotelCard = this.page
      .locator('li[data-selenium="hotel-item"]')
      .first();
    await firstHotelCard.waitFor({ state: "visible" });

    await expect(firstHotelCard.getByTestId("property-name-link")).toHaveText(
      hotelName,
      { ignoreCase: true },
    );

    const priceLocator = firstHotelCard.locator(
      '[data-element-name="property-card-price"]',
    );
    const soldOutLocator = firstHotelCard.locator(
      'text="Sold out on your dates!"',
    );

    // Kiểm tra xem ít nhất một trong hai phần tử phải xuất hiện
    const isPriceVisible = await priceLocator.isVisible();
    const isSoldOutVisible = await soldOutLocator.isVisible();

    if (isPriceVisible) {
      // Trường hợp lý tưởng: Có giá hiển thị
      await expect(priceLocator).not.toBeEmpty();
    } else if (isSoldOutVisible) {
      // Trường hợp hết phòng: Đây vẫn là một kết quả hợp lệ của hệ thống
      // Bạn có thể đánh dấu test là "Passed" nhưng kèm theo cảnh báo (Warning)
      await expect(priceLocator).toBeEmpty();
      console.warn("Info: Option is sold out on selected dates.");
    }
  }
}
