export interface ItemSummary {
  id: number;
  itemName: string;
  itemCode: number;
  itemPrice: number;
  rank: string;
  kindName: string;
  diffWeekAgo: number;
  searchDate: string;
}

export interface ItemDetail {
  item_code: string | number;
  item_name: string;
  kind_name: string;
  rank: string;
  date: string;
  item_price: number;
  diff: number;
  last_week: number;
  last_month: number;
  last_year: number;
  last_week_date: string;
  last_month_date: string;
  last_year_date: string;
  wiki: string;
}
export type BasicItemSummary = Omit<
  ItemSummary,
  "diffWeekAgo" | "searchDate" | "itemPrice"
>;

export interface ItemPrice {
  price: number;
  rank: string;
  searchDate: Date;
}

export interface ItemTips {
  tips: string;
  substitute: string[];
  recipe: {
    title: string;
    ingredients: string[];
    steps: string[];
  };
}
