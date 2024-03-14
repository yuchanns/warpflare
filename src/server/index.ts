import { Hono } from 'hono'
import { logger } from 'hono/logger'
import task from './task'
import sub from './sub'

export type Bindings = {
  DATABASE: D1Database
  LOSS_THRESHOLD: number
  DELAY_THRESHOLD: number
  RANDOM_COUNT: number
}

const app = new Hono<{ Bindings: Bindings }>().use(logger())

app.get('/', (c) => c.text('Hello Warp'))

app.route('/task', task)
app.route('/sub', sub)

export default app
