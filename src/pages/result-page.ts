import { expect, Page, TestInfo } from "@playwright/test";
import { FlightOccupancy, HotelBooking, HotelOccupancy } from "../types";
import { DateHelper } from "../helpers/date-helper";
import { TIMEOUT } from "../config/constant";

export class ResultPage {
  constructor(
    private page: Page,
    private testInfo: TestInfo,
  ) {}

  /**
   * Verify page URL of result page (for Flights booking)
   */
  async verifyFlightsResultURL() {
    await expect(this.page).toHaveURL(/.*flights\/results/, {
      timeout: TIMEOUT.Long,
    });
  }

  /**
   * Verify the information of first card (best card) in result list
   * @param origin - Origin
   * @param destination - Destination
   */
  async verifyFlightResultInfo(origin: string, destination: string) {
    const firstFlightCard = this.page
      .locator('[data-testid="flightCard-flight-detail"]')
      .first();
    await firstFlightCard.waitFor({ state: "visible" });

    const departureLocator = firstFlightCard.getByTestId("departure-time");
    const arrivalLocator = firstFlightCard.getByTestId("arrival-time");
    const originLocator = firstFlightCard.getByTestId("origin");
    const destinationLocator = firstFlightCard.getByTestId("destination");
    const priceLocator = firstFlightCard
      .getByTestId("flight-price-breakdown")
      .locator('[dir="ltr"]')
      .last();

    await expect(departureLocator).toBeVisible();
    await expect(arrivalLocator).toBeVisible();
    await expect(originLocator).toHaveText(origin);
    await expect(destinationLocator).toHaveText(destination);

    await expect(priceLocator).toHaveText(/[\d,.]+/);
    console.log(`Price: ${await priceLocator.innerText()}`);

    await firstFlightCard.click();
    const flightDetailLocator = this.page.getByTestId("flight-details-expand");
    await expect(flightDetailLocator).toBeVisible();
    console.log(
      `Flight Detail: ${await flightDetailLocator.allTextContents()}`,
    );
  }

  /**
   * Verify flight booking occupancy information
   * @param occupancy - Fligth occupancy object
   */
  async verifyFlightBookedInfo(occupancy: FlightOccupancy) {
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
    await expect(this.page).toHaveURL(/.*search/, { timeout: TIMEOUT.Long });
  }

  /**
   * Verify the information of first card (best card) in result list
   * @param hotelName - Hotel name
   */
  async verifyHotelResultInfo(hotelName: string) {
    const firstHotelCard = this.page
      .locator('li[data-selenium="hotel-item"]')
      .first();
    await expect(firstHotelCard).toBeVisible();

    const hotelNameLocator = firstHotelCard.locator(
      '[data-selenium="hotel-name"]',
    );
    await expect(hotelNameLocator).toHaveText(hotelName, { ignoreCase: true });

    const loadingSpinner = firstHotelCard.locator(
      '[data-selenium="loading-spinner"]',
    );
    await loadingSpinner.waitFor({ state: "hidden", timeout: TIMEOUT.Long });

    const priceLocator = firstHotelCard.locator(
      '[data-element-name="property-card-price"]',
    );
    const soldOutLocator = firstHotelCard.locator(
      'text="Sold out on your dates!"',
    );

    if (
      (await priceLocator.isVisible()) &&
      (await priceLocator.innerText()).trim() !== ""
    ) {
      await expect(priceLocator).not.toBeEmpty();
      console.log(`Price: ${await priceLocator.innerText()}`);
    } else {
      await expect(soldOutLocator).toBeVisible();
      console.warn(`Price: ${await soldOutLocator.innerText()}`);
    }
  }

  /**
   * Verify booked date in the Result Page
   * @param bookingData - HotelBooking
   */
  async verifyHotelBookedInfo(bookingData: HotelBooking) {
    const checkIn = DateHelper.getFutureDate(bookingData.fromTodayToCheckIn);
    const checkOut = DateHelper.getFutureDate(bookingData.fromTodayToCheckOut);

    const checkInLocator = this.page.locator(`[data-selenium="checkInBox"]`);
    const checkoutLocator = this.page.locator(`[data-selenium="checkOutBox"]`);
    const adultsLocator = this.page.locator(`[data-selenium="adultValue"]`);
    const childrenLocator = this.page.locator(`[data-selenium="childValue"]`);
    const roomLocator = this.page.locator(`[data-selenium="roomValue"]`);

    await expect(checkInLocator).toHaveAttribute("data-date", checkIn.fullDate);
    await expect(checkoutLocator).toHaveAttribute(
      "data-date",
      checkOut.fullDate,
    );
    await expect(adultsLocator).toHaveAttribute(
      "data-value",
      `${bookingData.hotelOccupancy.adults}`,
    );

    if (bookingData.hotelOccupancy.children) {
      await expect(childrenLocator).toHaveAttribute(
        "data-value",
        `${bookingData.hotelOccupancy.children}`,
      );
    }

    await expect(roomLocator).toHaveAttribute(
      "data-value",
      `${bookingData.hotelOccupancy.room}`,
    );
  }

  /**
   * Take the screenshot
   */
  async takeResultPageScreenshot() {
    const screenshot = await this.page.screenshot();
    this.testInfo.attach("Result Page", {
      body: screenshot,
      contentType: "image/png",
    });
  }
}
