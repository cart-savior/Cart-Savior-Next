import { fill_price_one_day_data } from "../../src/fill-db.mjs";
import type { NextApiRequest, NextApiResponse } from "next";
import { format } from "date-fns";

export const config = {
  maxDuration: 300,
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const authHeader = request.headers["authorization"];
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return response.status(401).json({ success: false });
  }

  const stringDate = format(new Date(), "yyyy-MM-dd");
  try {
    await fill_price_one_day_data(stringDate);
    response.status(200).end("Hello Cron!");
  } catch (err) {
    response.status(400).end(`${stringDate} data error: ${err}`);
  }
}
