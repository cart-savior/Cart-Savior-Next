import { addDays, format } from "date-fns";
import { fill_price_one_day_data } from "./fill-db.mjs";

// Example usage:
const date = "2024-07-05"; // Replace with your desired date
fill_price_one_day_data(date);

async function runForDateRange(startDate, endDate) {
  let currentDate = startDate;
  while (currentDate <= endDate) {
    const stringDate = format(currentDate, "yyyy-MM-dd");
    await fill_price_one_day_data(stringDate);
    currentDate = addDays(currentDate, 1);
  }
}

const endDate = new Date(); // Today's date
const startDate = addDays(endDate, -5); // One year and a month ago

runForDateRange(startDate, endDate)
  .then(() => {
    console.log("Data import completed successfully.");
  })
  .catch((error) => {
    console.error("Error during data import:", error);
  });
