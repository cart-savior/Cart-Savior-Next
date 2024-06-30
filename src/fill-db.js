import axios from "axios";
import sqlite3 from "sqlite3"; // Assuming sqlite3 package is installd
import { addDays, format } from "date-fns";

export async function fill_price_one_day_data(date) {
  const categories = ["100", "200", "300", "400", "500", "600"];
  let result = [];

  // Establish SQLite connection
  let db = new sqlite3.Database("src/cart_savior.db");

  for (const category of categories) {
    try {
      const format_date = date; // Assuming api_template.render(date=date) just returns date as string
      const url =
        `http://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList` +
        `&p_cert_key=${process.env.API_KEY}&p_cert_id=${process.env.API_CERT_ID}&p_returntype=json` +
        `&p_product_cls_code=01` +
        `&p_regday=${format_date}` +
        `&p_item_category_code=${category}`;
      const response = await axios.get(url);
      const obj = response.data;
      console.log(category, format_date);

      if (!obj.data || !obj.data.item) {
        continue; // Skip if no data or item in response
      }

      let items = obj.data.item;
      items.forEach((item) => {
        // Create a result object with desired fields
        let newItem = {
          item_name: item.item_name,
          item_code: item.item_code,
          kind_name: item.kind_name,
          rank: item.rank,
          unit: item.unit,
          price: item.dpr1 === "-" ? 0 : parseInt(item.dpr1.replace(",", "")),
        };
        result.push(newItem);
      });
    } catch (error) {
      console.error(
        `Error fetching data for category ${category}: ${error.message}`
      );
    }
  }

  // Insert data into SQLite database
  result.forEach((item) => {
    db.run(
      `INSERT or REPLACE INTO item_price(date, item_name, item_code, kind_name, rank, unit, price) VALUES(?, ?, ?, ?, ?, ?, ?)`,
      [
        date,
        item.item_name,
        item.item_code,
        item.kind_name,
        item.rank,
        item.unit,
        item.price,
      ],
      (err) => {
        if (err) {
          console.error(`Error inserting data: ${err.message}`);
        }
      }
    );
  });

  // Close SQLite connection
  db.close();
}

// Example usage:
const date = "2024-06-27"; // Replace with your desired date
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
const startDate = addDays(endDate, -(365 * 1 + 30)); // One year and a month ago

runForDateRange(startDate, endDate)
  .then(() => {
    console.log("Data import completed successfully.");
  })
  .catch((error) => {
    console.error("Error during data import:", error);
  });
