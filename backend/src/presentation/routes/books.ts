import { Hono } from 'hono';
import { booksService } from '../../services/booksService.js';

const books = new Hono();

books.get('/', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      c.status(401);
      return c.json({
        success: false,
        error: {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: userData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !userData.user) {
      c.status(401);
      return c.json({
        success: false,
        error: {
          message: 'Invalid authentication token',
          code: 'UNAUTHORIZED',
        },
      });
    }

    const userId = userData.user.id;
    const userBooks = await booksService.getUserBooks(userId);

    return c.json({
      success: true,
      data: {
        books: userBooks,
        count: userBooks.length,
      },
    });
  } catch (error) {
    console.error('Error in GET /books:', error);
    c.status(500);
    return c.json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    });
  }
});

books.get('/:id', async (c) => {
  try {
    const bookId = c.req.param('id');

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(bookId)) {
      c.status(400);
      return c.json({
        success: false,
        error: {
          message: 'Invalid book ID format',
          code: 'INVALID_REQUEST',
        },
      });
    }

    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      c.status(401);
      return c.json({
        success: false,
        error: {
          message: 'Unauthorized',
          code: 'UNAUTHORIZED',
        },
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: userData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !userData.user) {
      c.status(401);
      return c.json({
        success: false,
        error: {
          message: 'Invalid authentication token',
          code: 'UNAUTHORIZED',
        },
      });
    }

    const userId = userData.user.id;
    const bookDetails = await booksService.getBookById(bookId, userId);

    if (!bookDetails) {
      c.status(404);
      return c.json({
        success: false,
        error: {
          message: 'Book not found',
          code: 'NOT_FOUND',
        },
      });
    }

    return c.json({
      success: true,
      data: {
        book: bookDetails,
      },
    });
  } catch (error) {
    console.error('Error in GET /books/:id:', error);
    c.status(500);
    return c.json({
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    });
  }
});

import { supabase } from '../../lib/supabase.js';

export default books;
