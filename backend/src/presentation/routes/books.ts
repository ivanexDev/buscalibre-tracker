import { Hono } from 'hono'

const books = new Hono()

books.get('/', (c) => c.json({ message: 'Books endpoint - to be implemented' }))

books.get('/:id', (c) => c.json({ message: 'Book details - to be implemented' }))

export default books
