import { Page } from "@playwright/test";
import { SearchFlights } from "../components/search-flights";
import { DatePicker } from "../components/date-picker";

export class HomePage {
  public readonly datePicker: DatePicker;
  public readonly searchFlights: SearchFlights;

  constructor(private page: Page) {
    this.datePicker = new DatePicker(page);
    this.searchFlights = new SearchFlights(page, this.datePicker);
  }

  /**
   * Navigate to home page
   */
  async navigate() {
    await this.page.goto("/");
  }

  /**
   * Close Cookie Ref Popup if displays
   */
  async closeCookieRefConfirm() {
    const dismissButton = this.page.getByRole("button", { name: "Dismiss" });
    await dismissButton
      .waitFor({ state: "visible", timeout: 1000 })
      .catch(() => {});
    if (await dismissButton.isVisible()) {
      await dismissButton.click();
    }
  }

  /**
   * Close Prominent Popup if displays
   */
  async closeProminentPopup() {
    const popup = this.page.locator(
      '[data-element-test="prominent-app-download-popover"]',
    );
    const closeBtn = this.page.locator(
      '[data-element-name="prominent-app-download-floating-button"]',
    );
    await popup.waitFor({ state: "visible", timeout: 1000 }).catch(() => {});
    if (await popup.isVisible()) {
      await closeBtn.click();
    }
  }

  /**
   * Select booking types (e.g., Flights, Hotels,...)
   * @param bookingType - "Hotels" | "Flights" | "Homes & Apts" | "Flight + Hotel"
   */
  async selectBooking(
    bookingType: "Hotels" | "Flights" | "Homes & Apts" | "Flight + Hotel",
  ) {
    const selectors: Record<string, string> = {
      Hotels: "#tab-all-rooms-tab",
      Flights: "#tab-flight-tab",
      "Homes & Apts": "#tab-home",
      "Flight + Hotel": "#tab-packages-tab",
    };

    const id = selectors[bookingType];
    const bookingTabLocator = this.page.locator(id);
    await bookingTabLocator.waitFor({ state: "visible" });
    await bookingTabLocator.click();
  }
}
