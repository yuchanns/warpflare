import { Hono } from 'hono'
import { Bindings } from '.'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { ProxyFormat, SubType, generateClash, getRandomEntryPoints } from '../utils'
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
      random_name: z.enum(['true', 'false'])
        .nullish()
        .transform((v) => v == 'true'),
      is_android: z.enum(['true', 'false'])
        .nullish()
        .transform((v) => v == 'true'),
      proxy_format: z.enum(['only_proxies', 'with_groups', 'full'])
        .nullish()
        .transform((v) => v == 'only_proxies' ?
          ProxyFormat.Only : v == 'with_groups' ?
            ProxyFormat.Group : ProxyFormat.Full),
      sub_type: z.enum(['clash', 'wireguard', 'surge', 'shadowrocket', 'sing-box'])
        .nullish()
        .transform((v) => v == 'clash' ?
          SubType.Clash : v == 'wireguard' ?
            SubType.Wireguard : v == 'surge' ?
              SubType.Surge : v == 'shadowrocket' ?
                SubType.Shadowrocket : v == 'sing-box' ?
                  SubType.SingBox : SubType.Unknown)
        .default('clash'),
    }),
  ),
  async (c) => {
    const {
      best, random_name: randomName, sub_type: subType,
      is_android: isAndroid, proxy_format: proxyFormat,
    } = c.req.valid('query')
    // TODO: support IPv6
    const ips = await getIPv4All(c.env)
    const random = getRandomEntryPoints(c.env, ips, best)
    const { private_key: privateKey } = await getCurrentAccount(c.env)
    let data: any
    let fileName: any
    switch (subType) {
      default:
        throw new HTTPException(400, { message: 'Unsupported sub type' })
      case SubType.Clash:
        data = generateClash(random, privateKey, proxyFormat, randomName, isAndroid)
        fileName = 'Clash.yaml'
        break
      // TODO: support others
    }
    return c.newResponse(data, 200, {
      'Content-Disposition': `attachment; filename=${fileName}`
    })
  })

export default app
