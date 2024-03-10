import { Hono } from 'hono'
import { logger } from 'hono/logger'
import task from './task'

export type Bindings = {
  DATABASE: D1Database
}

const app = new Hono<{ Bindings: Bindings }>().use(logger())

app.get('/', (c) => c.text('Hello Warp'))

app.route('/task', task)

export default app
