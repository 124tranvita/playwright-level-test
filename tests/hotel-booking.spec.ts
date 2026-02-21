import { test } from "../src/fixtures/base-test";
import { HotelBooking } from "../src/types";

import HotelBookingData from "../src/test-data/hotel-booking.json";

test.describe("Overnight Stays Hotel Booking", () => {
  for (const rawData of HotelBookingData) {
    const bookingData = rawData as unknown as HotelBooking;

    test(`Verify case: ${bookingData.TestCase}`, async ({
      homePage,
      resultPage,
    }) => {
      // 1. Navigate to the Agoda homepage.
      await homePage.navigate();

      // 2. Select booking type as Hotels.
      await homePage.selectBooking(bookingData.booking);

      // 3. Input origin and destination.
      await homePage.searchHotel.selectBookingHotel(bookingData.hotelName);

      await homePage.searchHotel.selectStayingDates(
        bookingData.fromTodayToCheckIn,
        bookingData.fromTodayToCheckOut,
      );

      // 4. Configure passengers and cabin class.
      await homePage.searchHotel.setHotelOccupancy(bookingData.hotelOccupancy);

      // 5. Execute search.
      await homePage.searchHotel.hotelSearch();

      // 6. Verify that flight details and prices are correctly displayed in the results.
      await resultPage.verifyHotelsResultURL();
      await resultPage.verifyHotelBookedInfo(bookingData);
      await resultPage.verifyHotelResultInfo(bookingData.hotelName);
    });
  }
});
