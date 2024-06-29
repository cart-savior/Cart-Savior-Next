export interface ItemSummary {
  id: number;
  itemName: string;
  itemCode: number;
  rank: string;
  kindName: string;
  diffWeekAgo: number;
  searchDate: string;
}

export type BasicItemSummary = Omit<
  ItemSummary,
  "diffWeekAgo" | "searchDate" | "rank"
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
