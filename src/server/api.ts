import { Hono } from 'hono'
import { Bindings } from '.'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { SubType } from '../utils'
import { queryValidator, sub } from './sub'

const app = new Hono<{ Bindings: Bindings }>()

const paramValidator = zValidator(
  'param',
  z.object({
    subType: z
      .enum(['clash', 'quantumult', 'v2ray', 'shadowrocket', 'surge', 'sing-box'])
      .transform(v => ['clash', 'quantumult'].includes(v) ?
        SubType.Clash : ['v2ray', 'shadowrocket'].includes(v) ?
          SubType.Shadowrocket : v == 'surge' ?
            SubType.Surge : v == 'sing-box' ?
              SubType.SingBox : SubType.Unknown)
  }),
)

app.get('/:subType',
  paramValidator,
  queryValidator,
  async (c) => {
    const {
      best, randomName,
      proxyFormat, ipv6,
    } = c.req.valid('query')
    const { subType } = c.req.valid('param')
    const isAndroid = (c.req.header('user-agent') ?? '').includes('android')
    const { data, fileName } = await sub(
      c.env, randomName, best, subType, proxyFormat, isAndroid, ipv6)
    return c.newResponse(data, 200, {
      'Content-Disposition': `attachment; filename=${fileName}`
    })
  },
)

export default app
