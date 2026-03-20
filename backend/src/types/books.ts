export interface Book {
  id: string;
  url: string;
  title: string;
  author: string;
  image_url: string;
  isbn: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  alert_threshold: number | null;
  alert_enabled: boolean;
  created_at: string;
}

export interface UserBookWithBook extends UserBook {
  book: Book;
}

export interface PriceHistory {
  id: string;
  book_id: string;
  price: number;
  currency: string;
  available: boolean;
  scraped_at: string;
}

export interface UserBookWithDetails extends UserBook {
  book: Book;
  current_price: number | null;
  lowest_price: number | null;
  highest_price: number | null;
}

export interface UserBooksResponse {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  currentPrice: number | null;
  lowestPrice: number | null;
  highestPrice: number | null;
  alertEnabled: boolean;
  alertThreshold: number | null;
  createdAt: string;
}

export interface BookDetailsResponse {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  url: string;
  isbn: string | null;
  currentPrice: number | null;
  lowestPrice: number | null;
  highestPrice: number | null;
  alertEnabled: boolean;
  alertThreshold: number | null;
  createdAt: string;
  priceHistory: PriceHistory[];
}
