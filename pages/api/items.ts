import { NextApiRequest, NextApiResponse } from "next";
import { format, subDays } from "date-fns";
import { BasicItemSummary, ItemSummary } from "@/types/item";
import { getPrice, retrieveItemData } from "@/utils/price";

const KEYWORD_REPLACERS = [
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
    output: ["돼지"],
  },
  {
    input: "목살",
    output: ["돼지"],
  },
];

const replaceSearchKeyword = (keyword: string) => {
  // 키워드를 대치해주고 배열로 반환
  // 최근 데이터에서 고기가 누락되어 고기 제거
  keyword = keyword.replace("고기", "");
  let replacedKeywords = [keyword];
  for (const replacer of KEYWORD_REPLACERS) {
    if (replacer.input === keyword) {
      replacedKeywords = replacer.output;
    }
  }

  return replacedKeywords;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ItemSummary[]>
) => {
  const today = new Date();
  const { keyword } = req.query;

  const keywords = replaceSearchKeyword(keyword as string);
  let items: BasicItemSummary[] = [];
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
        itemPrice: todayPrice.price,
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
