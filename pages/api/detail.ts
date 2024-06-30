import { NextApiRequest, NextApiResponse } from "next";
import { format, subDays, parse } from "date-fns";
import { ItemDetail } from "@/types/item";
import { getPrice, getWiki, retrieveItemDataByCode } from "@/utils/price";

const getDetail = async (
  itemCode: number | string,
  kindName: string,
  date: Date
): Promise<ItemDetail | null> => {
  const item = await retrieveItemDataByCode(itemCode, kindName);
  const stringDate = format(date, "yyyy-MM-dd");
  const itemPrice = await getPrice(item, date);

  if (!itemPrice) {
    return null;
  }

  let lastWeek = subDays(date, 7);
  let lastMonth = subDays(date, 30);
  let lastYear = subDays(date, 365);

  const lastWeekPrice = await getPrice(item, lastWeek);
  const lastMonthPrice = await getPrice(item, lastMonth);
  const lastYearPrice = await getPrice(item, lastYear);

  if (!(lastWeekPrice && lastMonthPrice && lastYearPrice)) {
    return null;
  }

  const diff = itemPrice.price - lastWeekPrice.price;
  const wiki = await getWiki(itemCode);

  const result: ItemDetail = {
    item_code: itemCode,
    item_name: item.itemName,
    kind_name: item.kindName,
    rank: item.rank,
    date: stringDate,
    item_price: itemPrice?.price as number,
    diff: diff,
    last_week: lastWeekPrice.price,
    last_month: lastMonthPrice.price,
    last_year: lastYearPrice.price,
    last_week_date: format(lastWeekPrice.searchDate, "yyyy-MM-dd"),
    last_month_date: format(lastMonthPrice.searchDate, "yyyy-MM-dd"),
    last_year_date: format(lastYearPrice.searchDate, "yyyy-MM-dd"),
    wiki,
  };

  return result;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ItemDetail>
) => {
  const { itemCode, date, kindName } = req.query;
  const dateObject = parse(date as string, "yyyy-MM-dd", "2024-06-05");
  const detail = await getDetail(
    itemCode as string,
    kindName as string,
    dateObject
  );

  if (detail) {
    return res.status(200).json(detail);
  } else {
    return res.status(400);
  }
};

export default handler;
