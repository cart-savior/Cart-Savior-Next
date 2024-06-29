import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { format, subDays } from "date-fns";
import { openDB } from "@/db";
import { BasicItemSummary, ItemPrice, ItemSummary } from "@/types/item";
import { getPrice, retrieveItemData } from "@/utils/price";

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

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ItemSummary[]>
) => {
  const today = new Date(2024, 5, 28);
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
