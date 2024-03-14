import { Hono } from 'hono'
import { Bindings } from '.'
import {
  generateWireguardKeys, getAccount,
  getCurrentAccount, register, saveAccount
} from '../client'

const app = new Hono<{ Bindings: Bindings }>()

export const addData = async (env: Bindings) => {
  const account = await getCurrentAccount(env)
  console.log(`WORK ON ID: ${account.account_id}`)
  try {
    const { pubKey } = generateWireguardKeys()
    const result = await register(pubKey, account.account_id)
    console.log(`Register info: ${JSON.stringify(result)}`)
  } catch (e) {
    console.error('Failed to get account from Cloudflare')
    console.error(e)
    return 'no'
  }
  console.log('Got account from Cloudflare')
  return 'ok'
}

export const save = async (env: Bindings) => {
  try {
    const account = await getCurrentAccount(env)
    const info = await getAccount(account.account_id, account.token)
    console.log(`Account info: ${JSON.stringify(info)}`)
    console.log("Save account")
    await saveAccount(env, Object.assign({}, account, info))
    return 'ok'
  } catch (e) {
    console.error('Failed to save account')
    console.error(e)
    return 'no'
  }
}

app.get('/add-data', async (c) => {
  const ok = await addData(c.env)
  return c.json(ok)
})

app.get('/save-account', async (c) => {
  const ok = await save(c.env)
  return c.json(ok)
})

export default app
