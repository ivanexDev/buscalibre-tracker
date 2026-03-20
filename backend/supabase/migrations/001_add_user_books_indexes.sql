-- Migration: Add indexes for user_books and price_history queries
-- Date: 2024-01-01
-- Purpose: Optimize queries for fetching user's books and price history

-- Index for user_books queries by user_id (most common lookup)
CREATE INDEX IF NOT EXISTS idx_user_books_user_id ON user_books(user_id);

-- Index for user_books queries by book_id
CREATE INDEX IF NOT EXISTS idx_user_books_book_id ON user_books(book_id);

-- Composite index for efficient user_books lookups (user + book)
CREATE INDEX IF NOT EXISTS idx_user_books_user_book ON user_books(user_id, book_id);

-- Index for price_history queries by book_id (for price range queries)
CREATE INDEX IF NOT EXISTS idx_price_history_book_id ON price_history(book_id);

-- Index for price_history ordering by scraped_at (for latest price queries)
CREATE INDEX IF NOT EXISTS idx_price_history_book_scraped ON price_history(book_id, scraped_at DESC);

-- Index for price_history ordering by price (for min/max price queries)
CREATE INDEX IF NOT EXISTS idx_price_history_book_price ON price_history(book_id, price ASC);
