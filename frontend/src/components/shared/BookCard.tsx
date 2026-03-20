'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, Badge, PriceBadge } from '@/components/ui';
import { TrendingDown, TrendingUp, Minus, Bell, BellOff, BookOpen } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice?: number;
  lowestPrice?: number;
  highestPrice?: number;
  alertThreshold?: number;
  alertEnabled?: boolean;
  lastUpdated?: string;
}

interface BookCardProps {
  book: Book;
  onToggleAlert?: (bookId: string) => void;
}

function getPriceTrendIcon(lowest?: number, highest?: number, current?: number) {
  if (!lowest || !highest || !current) return <Minus className="w-4 h-4 text-gray-400" />;
  if (current === lowest) return <TrendingDown className="w-4 h-4 text-green-600" />;
  if (current === highest) return <TrendingUp className="w-4 h-4 text-red-600" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
}

function getPriceStatus(current?: number, lowest?: number) {
  if (!lowest || !current) return 'normal';
  if (current === lowest) return 'lowest';
  if (current < lowest * 1.1) return 'near-lowest';
  return 'normal';
}

export function BookCard({ book, onToggleAlert }: BookCardProps) {
  const priceStatus = getPriceStatus(book.currentPrice, book.lowestPrice);

  return (
    <Link href={`/books/${book.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
        <div className="flex gap-4">
          <div className="w-24 h-36 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative">
            {book.imageUrl ? (
              <Image src={book.imageUrl} alt={book.title} fill className="object-cover group-hover:scale-105 transition-transform duration-200" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-xs text-center p-2">No Cover</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 truncate group-hover:text-amber-600 transition-colors">{book.title}</h3>
                <p className="text-sm text-gray-500 truncate">{book.author}</p>
              </div>
              {onToggleAlert && (
                <button
                  onClick={(e) => { e.preventDefault(); onToggleAlert(book.id); }}
                  className={`p-1.5 rounded-full transition-colors ${book.alertEnabled ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100'}`}
                >
                  {book.alertEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center gap-3">
              <PriceBadge price={book.currentPrice} originalPrice={book.originalPrice} />
              {getPriceTrendIcon(book.lowestPrice, book.highestPrice, book.currentPrice)}
            </div>

            <div className="mt-3 flex items-center gap-2 flex-wrap">
              {priceStatus === 'lowest' && <Badge variant="success" size="sm">Lowest Price!</Badge>}
              {book.lowestPrice && <span className="text-xs text-gray-500">Low: ${book.lowestPrice.toLocaleString('es-CL')}</span>}
              {book.alertThreshold && book.alertEnabled && <Badge variant="warning" size="sm">Alert: ${book.alertThreshold.toLocaleString('es-CL')}</Badge>}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface BookListProps {
  books: Book[];
  onToggleAlert?: (bookId: string) => void;
}

export function BookList({ books, onToggleAlert }: BookListProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <BookOpen className="w-12 h-12 text-amber-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No books tracked yet</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Start tracking book prices from Buscalibre. Add your first book and we will monitor price changes for you.
        </p>
        <Link href="/books/add">
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors">
            <span>Add Your First Book</span>
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {books.map((book) => <BookCard key={book.id} book={book} onToggleAlert={onToggleAlert} />)}
    </div>
  );
}
