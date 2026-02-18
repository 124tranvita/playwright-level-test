import { test } from "../src/fixtures/base-test";
import { FlightBooking } from "../src/types";

import FlightBookingData from "../src/test-data/flight-booking.json";

test.describe("One-way Flight Booking", () => {
  // for (const rawData of FlightBookingData) {
  //   const bookingData = rawData as unknown as FlightBooking;

  //   test(`Verify flight booking: ${bookingData.TestCase}`, async ({
  //     homePage,
  //     resultPage,
  //   }) => {
  //     // 1. Navigate to the Agoda homepage.
  //     await homePage.navigate();

  //     // 2. Close some unexpected popup.
  //     await homePage.closeCookieRefConfirm();
  //     await homePage.closeProminentPopup();

  //     // 3. Select booking type as Flights.
  //     await homePage.selectBooking(bookingData.booking);

  //     // 4. Input origin and destination.
  //     await homePage.searchFlights.setFlightRoute(
  //       bookingData.flyingFrom,
  //       bookingData.flyingTo,
  //     );

  //     // 5. Select the departure date.
  //     await homePage.searchFlights.selectFightDate(bookingData.numOfDays);

  //     // 6. Configure passengers and cabin class.
  //     await homePage.searchFlights.setFlightOccupancy(bookingData.occupancy);

  //     // 7. Execute search.
  //     await homePage.searchFlights.flightSearch();

  //     // 8. Verify that flight details and prices are correctly displayed in the results.
  //     await resultPage.verifyFlightsResultURL();
  //     await resultPage.verifyFlightOccupancy(bookingData.occupancy);
  //     await resultPage.verifyFirstFlightDisplay(
  //       bookingData.flyingFrom,
  //       bookingData.flyingTo,
  //     );
  //   });
  // }

  test(`Verify hotels booking:`, async ({ homePage, resultPage }) => {
    // 1. Navigate to the Agoda homepage.
    await homePage.navigate();

    // 2. Close some unexpected popup.
    await homePage.closeCookieRefConfirm();
    await homePage.closeProminentPopup();

    // 3. Select booking type as Flights.
    await homePage.selectBooking("Hotels");

    await homePage.searchHotel.selectBookingHotel(
      "Muong Thanh Saigon Centre Hotel",
    );
    await homePage.searchHotel.selectHotelStayingDates(2, 3);
    await homePage.searchHotel.setHotelOccupancy({
      room: 2,
      adults: 4,
      children: 2,
    });
    await homePage.searchHotel.hotelSearch();

    await resultPage.verifyHotelsResultURL();
    await resultPage.verifyFirstHotelDisplay("Muong Thanh Saigon Centre Hotel");
  });
});
