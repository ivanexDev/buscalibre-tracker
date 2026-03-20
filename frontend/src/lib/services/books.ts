import { createBrowserClient } from '@supabase/ssr';
import type { UserBook, UserBookWithDetails, BookCardData, Book } from '@/types/books';

export async function getUserBooks(userId: string): Promise<UserBookWithDetails[]> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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

  const booksWithPrices: UserBookWithDetails[] = await Promise.all(
    userBooks.map(async (userBook: UserBook) => {
      const [latestPrice, priceRange] = await Promise.all([
        getLatestPrice(userBook.book_id),
        getPriceRange(userBook.book_id),
      ]);

      const existingBook = userBooks.find((ub: UserBookWithDetails) => ub.book_id === userBook.book_id)?.book;
      const bookData: Book = existingBook || { id: userBook.book_id } as Book;

      return {
        ...userBook,
        book: bookData,
        current_price: latestPrice,
        lowest_price: priceRange?.lowest ?? null,
        highest_price: priceRange?.highest ?? null,
      } as UserBookWithDetails;
    })
  );

  return booksWithPrices;
}

export async function getLatestPrice(bookId: string): Promise<number | null> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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

export async function getPriceRange(bookId: string): Promise<{ lowest: number; highest: number } | null> {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('price_history')
    .select('price')
    .eq('book_id', bookId)
    .order('price', { ascending: true })
    .limit(1);

  if (error || !data || data.length === 0) {
    return null;
  }

  const lowest = data[0].price;

  const { data: highestData } = await supabase
    .from('price_history')
    .select('price')
    .eq('book_id', bookId)
    .order('price', { ascending: false })
    .limit(1);

  const highest = highestData?.[0]?.price ?? lowest;

  return { lowest, highest };
}

export function transformToBookCardData(userBooks: UserBookWithDetails[]): BookCardData[] {
  return userBooks.map((userBook) => ({
    id: userBook.book?.id ?? userBook.book_id,
    title: userBook.book?.title ?? 'Unknown Title',
    author: userBook.book?.author ?? 'Unknown Author',
    imageUrl: userBook.book?.image_url ?? '',
    currentPrice: userBook.current_price ?? 0,
    lowestPrice: userBook.lowest_price ?? undefined,
    highestPrice: userBook.highest_price ?? undefined,
    alertThreshold: userBook.alert_threshold ?? undefined,
    alertEnabled: userBook.alert_enabled,
    lastUpdated: userBook.book?.updated_at,
  }));
}
