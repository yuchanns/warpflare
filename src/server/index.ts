import { Hono } from 'hono'
import { logger } from 'hono/logger'
import task from './task'

export type Bindings = {
  DATABASE: D1Database
}

export type Env = {
  Bindings: Bindings
}

const app = new Hono<Env>().use(logger())

app.get('/', (c) => c.text('Hello Warp'))

app.route('/task', task)

export default app
