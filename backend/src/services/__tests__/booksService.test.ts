/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('../../lib/supabase.js', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  },
}));

import { BooksService } from '../booksService.js';
import { supabase } from '../../lib/supabase.js';

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('BooksService', () => {
  let booksService: BooksService;

  beforeEach(() => {
    jest.clearAllMocks();
    booksService = new BooksService();
  });

  describe('getUserBooks', () => {
    const mockUserId = 'user-123';

    it('should return empty array when user has no books', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      } as any);

      const result = await booksService.getUserBooks(mockUserId);

      expect(result).toEqual([]);
      expect(mockSupabase.from).toHaveBeenCalledWith('user_books');
    });

    it('should return books with price data', async () => {
      const mockUserBooks = [
        {
          id: 'ub-1',
          user_id: mockUserId,
          book_id: 'book-1',
          alert_threshold: 20000,
          alert_enabled: true,
          created_at: '2024-01-01',
          book: {
            id: 'book-1',
            title: 'Test Book',
            author: 'Test Author',
            image_url: 'https://example.com/image.jpg',
            url: 'https://buscalibre.com/book-1',
            isbn: null,
            created_at: '2024-01-01',
            updated_at: '2024-01-01',
          },
        },
      ];

      mockSupabase.from
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockResolvedValue({ data: mockUserBooks, error: null }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                limit: jest.fn().mockReturnValue({
                  single: jest.fn().mockResolvedValue({ data: { price: 25000 }, error: null }),
                }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue({ data: [{ price: 20000 }], error: null }),
              }),
            }),
          }),
        } as any)
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                limit: jest.fn().mockResolvedValue({ data: [{ price: 30000 }], error: null }),
              }),
            }),
          }),
        } as any);

      const result = await booksService.getUserBooks(mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        id: 'book-1',
        title: 'Test Book',
        author: 'Test Author',
        imageUrl: 'https://example.com/image.jpg',
        currentPrice: 25000,
        alertEnabled: true,
        alertThreshold: 20000,
      });
    });

    it('should throw error on database failure', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({ 
              data: null, 
              error: { message: 'Database error' } 
            }),
          }),
        }),
      } as any);

      await expect(booksService.getUserBooks(mockUserId))
        .rejects.toThrow('Failed to fetch user books');
    });
  });

  describe('getBookById', () => {
    const mockUserId = 'user-123';
    const mockBookId = '12345678-1234-1234-1234-123456789012';

    it.skip('should return book when user owns it', async () => {
      // Complex mock chain required - tested via integration tests
    });

    it('should return null when book not found', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ 
                data: null, 
                error: { code: 'PGRST116', message: 'Not found' } 
              }),
            }),
          }),
        }),
      } as any);

      const result = await booksService.getBookById(mockBookId, mockUserId);

      expect(result).toBeNull();
    });

    it('should throw error on database failure', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({ 
                data: null, 
                error: { message: 'Database error' } 
              }),
            }),
          }),
        }),
      } as any);

      await expect(booksService.getBookById(mockBookId, mockUserId))
        .rejects.toThrow('Failed to fetch book');
    });
  });
});
