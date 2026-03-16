import { serve } from '@hono/node-server'
import { readFileSync } from 'fs'
import { parse } from 'dotenv'
import app from './index.js'

const config = parse(readFileSync('.env.local'))

const port = parseInt(process.env.PORT || config.PORT || '3001', 10)

console.log(`🚀 Server running at: http://localhost:${port}`)
console.log(`📚 API available at: http://localhost:${port}/api`)

serve({
  fetch: app.fetch,
  port,
})
