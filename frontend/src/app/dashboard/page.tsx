import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { getUserBooks, transformToBookCardData } from '@/lib/services/books';
import { BookList } from '@/components/shared/BookCard';
import { Navigation } from '@/components/shared/Navigation';
import { LayoutDashboard, TrendingDown } from 'lucide-react';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component - cookies cannot be set
          }
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/auth/login');
  }

  let books: import('@/types/books').BookCardData[] = [];
  try {
    const userBooks = await getUserBooks(user.id);
    books = transformToBookCardData(userBooks);
  } catch (error) {
    console.error('Error loading books:', error);
    books = [];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-amber-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Books</h1>
            </div>
            <p className="text-gray-500 ml-14">Track and monitor prices for your favorite books</p>
          </div>

          {books.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <LayoutDashboard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{books.length}</p>
                    <p className="text-sm text-gray-500">Books tracked</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingDown className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {books.filter(b => b.currentPrice === b.lowestPrice).length}
                    </p>
                    <p className="text-sm text-gray-500">At lowest price</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <BookList books={books} />
        </div>
      </main>
    </div>
  );
}
