import { Hono } from 'hono'
import { Bindings } from '.'
import {
  generateWireguardKeys, getAccount,
  getCurrentAccount, register, saveAccount
} from '../client'

const app = new Hono<{ Bindings: Bindings }>()

app.get('/add-data', async (c) => {
  const account = await getCurrentAccount(c.env)
  console.log(`WORK ON ID: ${account.account_id}`)
  try {
    const { pubKey } = generateWireguardKeys()
    register(pubKey, account.account_id)
  } catch (e) {
    console.error('Failed to get account from Cloudflare')
    console.error(e)
    return c.json('no')
  }
  console.log('Got account from Cloudflare')
  return c.json('ok')
})

app.get('/save-account', async (c) => {
  const account = await getCurrentAccount(c.env)
  const info = await getAccount(account.account_id, account.token)
  console.log(`Account info: ${JSON.stringify(info)}`)
  console.log("Save account")
  await saveAccount(c.env, Object.assign({}, account, info))
  return c.json('ok')
})

export default app
