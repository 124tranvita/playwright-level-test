import { test } from "../src/fixtures/base-test";
import { FlightBooking } from "../src/types";

import FlightBookingData from "../src/test-data/flight-booking.json";

test.describe("One-way Flight Booking", () => {
  for (const rawData of FlightBookingData) {
    const bookingData = rawData as unknown as FlightBooking;

    test(`Verify case: ${bookingData.TestCase}`, async ({
      homePage,
      resultPage,
    }) => {
      // 1. Navigate to the Agoda homepage.
      await homePage.navigate();

      // 2. Select booking type as Flights.
      await homePage.selectBooking(bookingData.booking);

      // 3. Select origin and destination.
      await homePage.searchFlights.setFlightRoute(
        bookingData.flyingFrom,
        bookingData.flyingTo,
      );

      // 4. Select the departure date.
      await homePage.searchFlights.selectFightDate(bookingData.numOfDays);

      // 5. Configure passengers and cabin class.
      await homePage.searchFlights.setFlightOccupancy(bookingData.occupancy);

      // 6. Execute search.
      await homePage.searchFlights.flightSearch();

      // 7. Verify that flight details and prices are correctly displayed in the results.
      await resultPage.verifyFlightsResultURL();
      await resultPage.verifyFlightBookedInfo(bookingData.occupancy);
      await resultPage.verifyFlightResultInfo(
        bookingData.flyingFrom,
        bookingData.flyingTo,
      );
    });
  }
});
