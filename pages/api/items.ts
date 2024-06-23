import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { format, subDays } from "date-fns";
import { openDB } from "@/db";
import { BasicItemSummary, ItemPrice, ItemSummary } from "@/types/item";

type CategoryCode = "100" | "200" | "300" | "400" | "500" | "600";

interface GetDataProps {
  day: Date;
  categoryCode: CategoryCode;
}

const KEYWORD_REPLACERS = [
  {
    input: "소고기",
    output: ["쇠고기"],
  },
  {
    input: "키위",
    output: ["참다래"],
  },
  {
    input: "고추",
    output: ["고추", "고춧가루"],
  },
  {
    input: "메론",
    output: ["멜론"],
  },
  {
    input: "달걀",
    output: ["계란"],
  },
  {
    input: "대파",
    output: ["파"],
  },
  {
    input: "쪽파",
    output: ["파"],
  },
  {
    input: "삽결살",
    output: ["돼지고기"],
  },
  {
    input: "목살",
    output: ["돼지고기"],
  },
];

const getData = async ({ day, categoryCode }: GetDataProps) => {
  const stringDate = format(day, "yyyy-MM-dd");
  const url = `http://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList&p_product_cls_code=01&p_regday=${stringDate}&p_convert_kg_yn=N&p_item_category_code=${categoryCode}&p_cert_key=${process.env.API_KEY}&p_cert_id=${process.env.API_CERT_ID}&p_returntype=json`;
  const response = await axios.get(url);
  const errorCode = response.data.data.error_code;
  const kamisData = response.data.data.item;
  // console.log(kamisData.map((data: { item_name: any }) => data.item_name));
};

const replaceSearchKeyword = (keyword: string) => {
  // 키워드를 대치해주고 배열로 반환
  let replacedKeywords = [keyword];
  for (const replacer of KEYWORD_REPLACERS) {
    if (replacer.input === keyword) {
      replacedKeywords = replacer.output;
    }
  }

  return replacedKeywords;
};

const retrieveItemData = async (
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
    };
  });

  return newItems;
};

const getPrice = async (
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

// TODO: searchKey 쿼리파람으로 받아서 사과 대치
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ItemSummary[]>
) => {
  const today = new Date(2020, 0, 3);

  const keywords = replaceSearchKeyword("사과");
  let items: Omit<ItemSummary, "diffWeekAgo" | "searchDate" | "rank">[] = [];
  for (const keyword of keywords) {
    const itemDetails = await retrieveItemData(keyword);
    items = [...items, ...itemDetails];
  }

  let result: ItemSummary[] = [];
  for (const item of items) {
    const todayPrice = await getPrice(item, today);
    const lastWeekPrice = await getPrice(item, subDays(today, 7));

    if (todayPrice && lastWeekPrice) {
      const diffWeekAgo = todayPrice.price - lastWeekPrice.price;
      const newItem: ItemSummary = {
        ...item,
        diffWeekAgo,
        rank: todayPrice.rank,
        searchDate: format(todayPrice.searchDate, "yyyy-MM-dd"),
      };
      result = [...result, newItem];
    }
  }

  return res.status(200).json(result);
};

export default handler;
