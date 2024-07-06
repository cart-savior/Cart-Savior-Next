import axios from "axios";
import { pool } from "./db";

export async function fill_price_one_day_data(date) {
  const categories = ["100", "200", "300", "400", "500", "600"];
  let result = [];

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

  // Insert data into psql database
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    for (const item of result) {
      await client.query(
        `INSERT INTO item_price(date, item_name, item_code, kind_name, rank, unit, price) VALUES($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`,
        [
          date,
          item.item_name,
          item.item_code,
          item.kind_name,
          item.rank,
          item.unit,
          item.price,
        ]
      );
    }
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
