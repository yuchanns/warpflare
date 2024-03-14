import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { logger } from 'hono/logger'
import task from './task'
import sub from './sub'
import { scheduled } from './scheduled'

export type Bindings = {
  DATABASE: D1Database
  LOSS_THRESHOLD: number
  DELAY_THRESHOLD: number
  RANDOM_COUNT: number
  SECRET_KEY: string
}

export const authorize = () => {
  return createMiddleware<{ Bindings: Bindings }>(async (c, next) => {
    if (c.env.SECRET_KEY == '') {
      return await next()
    }
    if (c.req.query('token') !== c.env.SECRET_KEY) {
      return c.newResponse('Unauthorized', 403)
    }
    return await next()
  })
}

const app = new Hono<{ Bindings: Bindings }>()
  .use(logger(), authorize())

// TODO: friendly homepage
app.get('/', (c) => c.text('Hello Warp'))

app.route('/task', task)
app.route('/sub', sub)

export default Object.assign({}, app, { scheduled })
