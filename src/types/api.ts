import { ItemSummary, ItemTips } from "./item";

interface GetPriceApiResponse {
  items: ItemSummary[];
}

export interface PostItemTipsApiRequest {
  itemName: string;
}

export interface PostItemTipsApiResponse extends ItemTips {}
