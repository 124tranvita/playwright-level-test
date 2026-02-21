export interface FlightOccupancy {
  adults: number;
  children: number;
  infants: number;
  cabinClass?: "economy" | "business" | "premium-economy" | "first";
}

export interface FlightBooking {
  TestCase: string;
  booking: "Hotels" | "Flights" | "Homes & Apts" | "Flight + Hotel";
  trip: "one-way" | "round-trip";
  flyingFrom: string;
  flyingTo: string;
  numOfDays: number;
  occupancy: FlightOccupancy;
}

export interface HotelOccupancy {
  room: number;
  adults: number;
  children: number;
  childrenAges?: number[];
}

export interface HotelBooking {
  TestCase: string;
  booking: "Hotels" | "Flights" | "Homes & Apts" | "Flight + Hotel";
  hotelName: string;
  fromTodayToCheckIn: number;
  fromTodayToCheckOut: number;
  hotelOccupancy: HotelOccupancy;
}
