import { openDB } from "@/db";
import { BasicItemSummary, ItemPrice } from "@/types/item";
import { format, subDays } from "date-fns";

export const retrieveItemData = async (
  keyword: string
): Promise<BasicItemSummary[]> => {
  const result: BasicItemSummary[] = [];
  const db = await openDB();
  const items = await db.all("SELECT * FROM items WHERE item_name LIKE ?", [
    `%${keyword}%`,
  ]);
  for (const item of items) {
    const rankItem = await db.get(
      "SELECT * FROM item_price WHERE item_code LIKE ? AND kind_name LIKE ? ORDER BY date DESC",
      [`%${item.item_code}%`, `%${item.kind_name}%`]
    );

    if (!rankItem) {
      continue;
    }

    const { rank } = rankItem;

    const newItem = {
      id: item.id,
      itemName: item.item_name,
      itemCode: item.item_code,
      kindName: item.kind_name,
      rank,
    };
    result.push(newItem);
  }

  return result;
};

export const retrieveItemDataByCode = async (
  itemCode: number | string
): Promise<BasicItemSummary> => {
  const db = await openDB();
  const item = await db.get("SELECT * FROM items WHERE item_code LIKE ?", [
    `%${itemCode}%`,
  ]);
  const { rank } = await db.get(
    "SELECT * FROM item_price WHERE item_code LIKE ?",
    [`%${item.item_code}%`]
  );

  const newItem = {
    id: item.id,
    itemName: item.item_name,
    itemCode: item.item_code,
    kindName: item.kind_name,
    rank,
  };

  return newItem;
};

export const getWiki = async (itemCode: number | string): Promise<string> => {
  const db = await openDB();
  const item = await db.get("SELECT * FROM wiki WHERE item_code LIKE ?", [
    `%${itemCode}%`,
  ]);

  return item.wiki;
};

export const getPrice = async (
  item: BasicItemSummary,
  startDate: Date
): Promise<ItemPrice | null> => {
  const db = await openDB();
  let daysTracingBack = 0;

  while (daysTracingBack < 10) {
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const data = await db.all(
      `SELECT * FROM item_price WHERE date='${formattedStartDate}'
        AND item_code=${item.itemCode} AND kind_name LIKE ?`,
      [`%${item.kindName}%`]
    );
    if (data.length === 0) {
      daysTracingBack++;
      startDate = subDays(startDate, 1);
      continue;
    }

    const price = data[0].price;
    if (!price || price === 0) {
      daysTracingBack++;
      startDate = subDays(startDate, 1);
    } else {
      const result: ItemPrice = {
        price,
        rank: data[0].rank,
        searchDate: startDate,
      };
      return result;
    }
  }

  return null;
};
