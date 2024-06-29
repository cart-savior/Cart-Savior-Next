import { openDB } from "@/db";
import { BasicItemSummary, ItemPrice } from "@/types/item";
import { format, subDays } from "date-fns";

export const retrieveItemData = async (
  keyword: string
): Promise<BasicItemSummary[]> => {
  // 해당 키워드를 items 테이블에서 찾아서 itemName, item_code, kindName 넣어서 반환.
  const db = await openDB();
  const items = await db.all("SELECT * FROM items WHERE item_name LIKE ?", [
    `%${keyword}%`,
  ]);
  const newItems = items.map((item) => {
    return {
      id: item.id,
      itemName: item.item_name,
      itemCode: item.item_code,
      kindName: item.kind_name,
      rank: item.rank,
    };
  });

  return newItems;
};

export const retrieveItemDataByCode = async (
  itemCode: number | string
): Promise<BasicItemSummary> => {
  // 해당 키워드를 items 테이블에서 찾아서 itemName, item_code, kindName 넣어서 반환.
  const db = await openDB();
  const item = await db.get("SELECT * FROM items WHERE item_code LIKE ?", [
    `%${itemCode}%`,
  ]);

  const newItem = {
    id: item.id,
    itemName: item.item_name,
    itemCode: item.item_code,
    kindName: item.kind_name,
    rank: item.rank,
  };

  return newItem;
};

export const getWiki = async (itemCode: number | string): Promise<string> => {
  // 해당 키워드를 items 테이블에서 찾아서 itemName, item_code, kindName 넣어서 반환.
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
      subDays(startDate, 1);
      continue;
    }

    const price = data[0].price;
    if (price === 0) {
      daysTracingBack++;
      subDays(startDate, 1);
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
