import { Hono } from 'hono'
import books from './presentation/routes/books.js'
import alerts from './presentation/routes/alerts.js'
import notifications from './presentation/routes/notifications.js'

const routes = new Hono()

routes.route('/books', books)
routes.route('/alerts', alerts)
routes.route('/notifications', notifications)

export default routes
