import { Page, TestInfo } from "@playwright/test";
import { SearchFlights } from "../components/search-flights";
import { DatePicker } from "../components/date-picker";
import { SearchHotels } from "../components/search-hotels";

export class HomePage {
  private readonly datePicker: DatePicker;
  public readonly searchFlights: SearchFlights;
  public readonly searchHotel: SearchHotels;

  constructor(
    private page: Page,
    private testInfo: TestInfo,
  ) {
    this.datePicker = new DatePicker(page);
    this.searchFlights = new SearchFlights(page, this.datePicker);
    this.searchHotel = new SearchHotels(page, this.datePicker);
  }

  /**
   * Navigate to home page
   */
  async navigate() {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
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

  /**
   * Take the screenshot
   */
  async takeHomePageScreenshot() {
    const screenshot = await this.page.screenshot();
    this.testInfo.attach("Home Page", {
      body: screenshot,
      contentType: "image/png",
    });
  }
}
