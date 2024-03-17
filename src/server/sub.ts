import { Hono } from 'hono'
import { Bindings } from '.'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { ProxyFormat, SubType, generateClash, generateShadowrocket, generateSingBox, getRandomEntryPoints } from '../utils'
import { getCurrentAccount, getIPv4All } from '../client'
import { HTTPException } from 'hono/http-exception'

const app = new Hono<{ Bindings: Bindings }>()

app.get(
  '/',
  zValidator(
    'query',
    z.object({
      best: z.enum(['true', 'false'])
        .nullish()
        .transform((v) => v == 'true'),
      randomName: z.enum(['true', 'false'])
        .nullish()
        .transform((v) => v == 'true'),
      isAndroid: z.enum(['true', 'false'])
        .nullish()
        .transform((v) => v == 'true'),
      proxyFormat: z.enum(['only_proxies', 'with_groups', 'full'])
        .nullish()
        .transform((v) => v == 'only_proxies' ?
          ProxyFormat.Only : v == 'with_groups' ?
            ProxyFormat.Group : ProxyFormat.Full),
    }),
  ),
  zValidator(
    'header',
    z.object({
      "user-agent": z
        .enum(['clash', 'shadowrocket', 'v2ray', 'quantumult', 'surge', 'sing-box'])
        .nullish()
        .transform((v) => ['clash', 'quantumult'].includes(v ?? '') ?
          SubType.Clash : ['v2ray', 'shadowrocket'].includes(v ?? '') ?
            SubType.Shadowrocket : v == 'surge' ?
              SubType.Surge : v == 'sing-box' ?
                SubType.SingBox : SubType.Unknown)
        .default('clash'),
    })),
  async (c) => {
    const {
      best, randomName,
      isAndroid, proxyFormat,
    } = c.req.valid('query')
    const { 'user-agent': subType } = c.req.valid('header')
    // TODO: support IPv6
    const ips = await getIPv4All(c.env, randomName)
    const random = getRandomEntryPoints(c.env, ips, best)
    const { private_key: privateKey } = await getCurrentAccount(c.env)
    let data: string
    let fileName: string
    switch (subType) {
      default:
        throw new HTTPException(400, { message: 'Unsupported sub type' })
      case SubType.Clash:
        data = generateClash(random, privateKey, proxyFormat, isAndroid)
        fileName = 'Clash.yaml'
        break
      case SubType.SingBox:
        data = generateSingBox(random, privateKey)
        fileName = 'SingBox.json'
        break
      case SubType.Shadowrocket:
        data = generateShadowrocket(random, privateKey)
        fileName = 'Shadowrocket.conf'
        break
      // TODO: other sub types
    }
    return c.newResponse(data, 200, {
      'Content-Disposition': `attachment; filename=${fileName}`
    })
  })

export default app
