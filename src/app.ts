import { Hono } from 'hono'

export type Bindings = {
  DATABASE: string
}

export type Env = {
  Bindings: Bindings
}

const app = new Hono<Env>()

app.get('/', (c) => c.text('Hello Warp'))

export default app
