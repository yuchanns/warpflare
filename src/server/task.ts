import { Hono } from 'hono'
import { getCurrentAccount, saveAccount } from '../client/repo'
import { Env } from '.'
import { generateWireguardKeys, getAccount, register } from '../client'

const app = new Hono<Env>()

app.post('/add-data', async (c) => {
  const account = await getCurrentAccount(c.env)
  console.log(`WORK ON ID: ${account.account_id}`)
  try {
    const { pubKey } = generateWireguardKeys()
    register(pubKey, account.account_id)
  } catch (e) {
    console.log('Failed to get account from Cloudflare')
    console.log(e)
    return c.json('no')
  }
  console.log('Got account from Cloudflare')
  return c.json('ok')
})

app.post('/save-account', async (c) => {
  const account = await getCurrentAccount(c.env)
  const info = await getAccount(account.account_id, account.token)
  console.log(`Account info: ${JSON.stringify(info)}`)
  console.log("Save account")
  await saveAccount(c.env, Object.assign({}, account, info))
  return c.json('ok')
})

export default app
