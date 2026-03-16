import { Hono } from 'hono'

const notifications = new Hono()

notifications.get('/', (c) => c.json({ message: 'Notifications endpoint - to be implemented' }))

export default notifications
