import { Hono } from 'hono'

const alerts = new Hono()

alerts.get('/', (c) => c.json({ message: 'Alerts endpoint - to be implemented' }))

alerts.post('/', (c) => c.json({ message: 'Create alert - to be implemented' }))

alerts.patch('/:id', (c) => c.json({ message: 'Update alert - to be implemented' }))

alerts.delete('/:id', (c) => c.json({ message: 'Delete alert - to be implemented' }))

export default alerts
