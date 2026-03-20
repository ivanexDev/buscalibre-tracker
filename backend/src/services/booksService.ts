import { supabase } from '../lib/supabase.js';
import type { 
  UserBookWithBook, 
  PriceHistory,
  UserBooksResponse,
  BookDetailsResponse 
} from '../types/books.js';

export interface IBooksService {
  getUserBooks(userId: string): Promise<UserBooksResponse[]>;
  getBookById(bookId: string, userId: string): Promise<BookDetailsResponse | null>;
}

export class BooksService implements IBooksService {
  async getUserBooks(userId: string): Promise<UserBooksResponse[]> {
    const { data: userBooks, error } = await supabase
      .from('user_books')
      .select(`
        *,
        book:books(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user books:', error);
      throw new Error('Failed to fetch user books');
    }

    if (!userBooks || userBooks.length === 0) {
      return [];
    }

    const booksWithPrices: UserBooksResponse[] = await Promise.all(
      userBooks.map(async (userBook: UserBookWithBook) => {
        const [latestPrice, priceRange] = await Promise.all([
          this.getLatestPrice(userBook.book_id),
          this.getPriceRange(userBook.book_id),
        ]);

        return {
          id: userBook.book?.id ?? userBook.book_id,
          title: userBook.book?.title ?? 'Unknown Title',
          author: userBook.book?.author ?? 'Unknown Author',
          imageUrl: userBook.book?.image_url ?? '',
          currentPrice: latestPrice,
          lowestPrice: priceRange?.lowest ?? null,
          highestPrice: priceRange?.highest ?? null,
          alertEnabled: userBook.alert_enabled,
          alertThreshold: userBook.alert_threshold,
          createdAt: userBook.created_at,
        };
      })
    );

    return booksWithPrices;
  }

  async getBookById(bookId: string, userId: string): Promise<BookDetailsResponse | null> {
    const { data: userBook, error } = await supabase
      .from('user_books')
      .select(`
        *,
        book:books(*)
      `)
      .eq('book_id', bookId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('Error fetching book:', error);
      throw new Error('Failed to fetch book');
    }

    if (!userBook || !userBook.book) {
      return null;
    }

    const [latestPrice, priceRange, priceHistory] = await Promise.all([
      this.getLatestPrice(bookId),
      this.getPriceRange(bookId),
      this.getPriceHistory(bookId),
    ]);

    return {
      id: userBook.book.id,
      title: userBook.book.title,
      author: userBook.book.author,
      imageUrl: userBook.book.image_url,
      url: userBook.book.url,
      isbn: userBook.book.isbn,
      currentPrice: latestPrice,
      lowestPrice: priceRange?.lowest ?? null,
      highestPrice: priceRange?.highest ?? null,
      alertEnabled: userBook.alert_enabled,
      alertThreshold: userBook.alert_threshold,
      createdAt: userBook.created_at,
      priceHistory,
    };
  }

  private async getLatestPrice(bookId: string): Promise<number | null> {
    const { data, error } = await supabase
      .from('price_history')
      .select('price')
      .eq('book_id', bookId)
      .order('scraped_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching latest price:', error);
      return null;
    }

    return data?.price ?? null;
  }

  private async getPriceRange(bookId: string): Promise<{ lowest: number; highest: number } | null> {
    const { data, error } = await supabase
      .from('price_history')
      .select('price')
      .eq('book_id', bookId)
      .order('price', { ascending: true })
      .limit(1);

    if (error) {
      console.error('Error fetching price range:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const lowest = data[0].price;

    const { data: highestData, error: highestError } = await supabase
      .from('price_history')
      .select('price')
      .eq('book_id', bookId)
      .order('price', { ascending: false })
      .limit(1);

    if (highestError) {
      console.error('Error fetching highest price:', highestError);
      return null;
    }

    const highest = highestData?.[0]?.price ?? lowest;

    return { lowest, highest };
  }

  private async getPriceHistory(bookId: string): Promise<PriceHistory[]> {
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('book_id', bookId)
      .order('scraped_at', { ascending: true });

    if (error) {
      console.error('Error fetching price history:', error);
      return [];
    }

    return data || [];
  }
}

export const booksService = new BooksService();
