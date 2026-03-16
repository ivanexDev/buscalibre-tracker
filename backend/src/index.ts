import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { cors as corsConfig } from './config/cors.js'
import routes from './routes.js'

const app = new Hono()

app.use('/*', cors(corsConfig))

app.get('/', (c) => c.text('Buscalibre Backend API'))

app.route('/api', routes)

app.notFound((c) => c.json({ error: 'Not Found' }, 404))
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app
