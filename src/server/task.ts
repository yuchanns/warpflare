import { Hono } from 'hono'
import { getCurrentAccount } from '../client/repo'
import { Env } from '.'
import { generateWireguardKeys, register } from '../client'

const app = new Hono<Env>()

app.get('/add-data', async (c) => {
  const account = await getCurrentAccount(c.env)
  console.log(`WORK ON ID: ${account.account_id}`)
  try {
    const pair = generateWireguardKeys()
    register(pair.pubKey, account.account_id)
  } catch (e) {
    console.log('Failed to get account from Cloudflare')
    console.log(e)
    return c.json('no')
  }
  console.log('Got account from Cloudflare')
  return c.json('ok')
})

export default app
