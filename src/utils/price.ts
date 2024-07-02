import { BasicItemSummary, ItemPrice } from "@/types/item";
import { format, subDays } from "date-fns";
import { pool } from "@/db";

export const retrieveItemData = async (
  keyword: string
): Promise<BasicItemSummary[]> => {
  const result: BasicItemSummary[] = [];
  const { rows: items } = await pool.query("SELECT * FROM items WHERE item_name LIKE $1", [
    `%${keyword}%`,
  ]);
  for (const item of items) {
    console.log('item', item, `%${item.item_code.toString()}%`);
    const { rows: rankItems } = await pool.query(
      "SELECT * FROM item_price WHERE item_code = $1 AND kind_name LIKE $2 ORDER BY date DESC",
      [item.item_code, `%${item.kind_name}%`]
    );

    if (!rankItems[0]) {
      continue;
    }

    const { rank } = rankItems[0];

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
  itemCode: number | string,
  kindName: string
): Promise<BasicItemSummary> => {
  const { rows: items } = await pool.query(
    "SELECT * FROM items WHERE item_code = $1 AND kind_name LIKE $2",
    [itemCode, `%${kindName}%`]
  );
  const { rows: itemPrices } = await pool.query(
    "SELECT * FROM item_price WHERE item_code = $1",
    [itemCode]
  );
  if (!items[0] || !itemPrices[0]) {
    throw new Error("Item not found");
  }

  const newItem = {
    id: items[0].id,
    itemName: items[0].item_name,
    itemCode: items[0].item_code,
    kindName: items[0].kind_name,
    rank: itemPrices[0].rank,
  };

  return newItem;
};

export const getWiki = async (itemCode: number | string): Promise<string> => {
  const { rows } = await pool.query("SELECT * FROM wiki WHERE item_code = $1", [
    itemCode,
  ]);

  if (!rows[0]) {
    throw new Error("Wiki not found");
  }

  return rows[0].wiki;
};

export const getPrice = async (
  item: BasicItemSummary,
  startDate: Date
): Promise<ItemPrice | null> => {
  let daysTracingBack = 0;

  while (daysTracingBack < 10) {
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const { rows } = await pool.query(
      "SELECT * FROM item_price WHERE date = $1 AND item_code = $2 AND kind_name LIKE $3",
      [formattedStartDate, item.itemCode, `%${item.kindName}%`]
    );
    if (rows.length === 0) {
      daysTracingBack++;
      startDate = subDays(startDate, 1);
      continue;
    }

    const price = rows[0].price;
    if (!price || price === 0) {
      daysTracingBack++;
      startDate = subDays(startDate, 1);
    } else {
      const result: ItemPrice = {
        price,
        rank: rows[0].rank,
        searchDate: startDate,
      };
      return result;
    }
  }

  return null;
};
