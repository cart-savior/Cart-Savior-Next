import { fill_price_one_day_data } from "../../src/fill-db";
import { format } from "date-fns";

export default async function handler(req, res) {
  if (
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).end("Unauthorized");
  }

  const stringDate = format(new Date(), "yyyy-MM-dd");
  try {
    await fill_price_one_day_data(stringDate);
    res.status(200).end("Hello Cron!");
  } catch (err) {
    res.status(400).end(`${stringDate} data error: ${err}`);
  }
}
