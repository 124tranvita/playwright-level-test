export class DateHelper {
  static getFutureDate(daysToAdd: number) {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);

    return {
      day: date.getDate().toString(),
      monthYear: date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      }), // "February 2026"
      fullDate: date.toISOString().split("T")[0], // YYYY-MM-DD
    };
  }
}
