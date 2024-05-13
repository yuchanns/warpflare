import { Hono } from 'hono'
import { Bindings } from '.'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { ProxyFormat, SubType, generateClash, generateShadowrocket, generateSingBox, getRandomEntryPoints } from '../utils'
import { generateDefaultIPv4, getCurrentAccount, getIPAll } from '../client'
import { HTTPException } from 'hono/http-exception'

const app = new Hono<{ Bindings: Bindings }>()

export const sub = async (
  env: Bindings, randomName: boolean,
  best: boolean, subType: SubType,
  proxyFormat: ProxyFormat, isAndroid: boolean,
) => {
  let ips = await getIPAll(env, randomName)
  if (ips.length == 0) {
    ips = generateDefaultIPv4()
  }
  const random = getRandomEntryPoints(env, ips, best)
  const { private_key: privateKey } = await getCurrentAccount(env)
  switch (subType) {
    default:
      throw new HTTPException(400, { message: 'Unsupported sub type' })
    case SubType.Clash:
      return {
        data: generateClash(random, privateKey, proxyFormat, isAndroid),
        fileName: 'Clash.yaml'
      }
    case SubType.SingBox:
      return {
        data: generateSingBox(random, privateKey),
        fileName: 'SingBox.json'
      }
    case SubType.Shadowrocket:
      return {
        data: generateShadowrocket(random, privateKey),
        fileName: 'Shadowrocket.conf'
      }
    // TODO: other sub types
  }
}

export const queryValidator = zValidator(
  'query',
  z.object({
    best: z.enum(['true', 'false'])
      .nullish()
      .transform((v) => v == 'true'),
    randomName: z.enum(['true', 'false'])
      .nullish()
      .transform((v) => v == 'true'),
    proxyFormat: z.enum(['only_proxies', 'with_groups', 'full'])
      .nullish()
      .transform((v) => v == 'only_proxies' ?
        ProxyFormat.Only : v == 'with_groups' ?
          ProxyFormat.Group : ProxyFormat.Full),
  }),
)

const headerValidator = zValidator(
  'header',
  z.object({
    "user-agent": z.string()
      .nullish()
      .transform((v) => {
        const agents = v?.split(' ').
          map(item => item.toLowerCase())
        for (const agent of agents ?? []) {
          if (agent.includes('clash') || agent.includes('quantumult')) {
            return SubType.Clash
          }
          if (agent.includes('v2ray') || agent.includes('shadowrocket')) {
            return SubType.Shadowrocket
          }
          if (agent.includes('surge')) {
            return SubType.Surge
          }
          if (agent.includes('sing-box')) {
            return SubType.SingBox
          }
        }
        return SubType.Unknown
      })
      .default('clash'),
  }),
)

app.get(
  '/',
  queryValidator,
  headerValidator,
  async (c) => {
    const {
      best, randomName,
      proxyFormat,
    } = c.req.valid('query')
    const { 'user-agent': subType } = c.req.valid('header')
    const isAndroid = (c.req.header('user-agent') ?? '').includes('android')
    const { data, fileName } = await sub(
      c.env, randomName, best, subType, proxyFormat, isAndroid)
    return c.newResponse(data, 200, {
      'Content-Disposition': `attachment; filename=${fileName}`
    })
  },
)

export default app
