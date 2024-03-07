import { sqliteTable } from "drizzle-orm/sqlite-core"
import { Bindings } from "../server"
import { register } from "./cloudflare"
import { generateWireguardKeys } from "./wireguard"
import { drizzle } from "drizzle-orm/d1"
import { text, integer } from "drizzle-orm/sqlite-core"
import { desc } from "drizzle-orm"

const tableAccount = sqliteTable("Account", {
  account_id: text("account_id").primaryKey(),
  account_type: text("account_type"),
  created_at: text("created_at"),
  updated_at: text("updated_at"),
  model: text("model"),
  referrer: text("referrer"),
  private_key: text("private_key"),
  license_key: text("license_key"),
  token: text("token"),
  premium_data: integer("premium_data"),
  quota: integer("quota"),
  usage: integer("usage"),
})

export const getCurrentAccount = async ({ DATABASE: DB }: Bindings) => {
  console.log("Get current account")
  // FIXME: construct db from context
  const db = drizzle(DB)
  let account = await db.select()
    .from(tableAccount).limit(1)
    .orderBy(desc(tableAccount.created_at)).get()
  if (account) {
    return account
  }
  console.log("No account found, register a new one")
  const pair = generateWireguardKeys()
  const result = await register(pair.pubKey)
  account = {
    account_id: result.account.id,
    account_type: result.type,
    created_at: result.account.created,
    updated_at: result.account.updated,
    model: result.model,
    referrer: "",
    private_key: pair.privKey,
    license_key: result.account.license,
    token: result.token,
    premium_data: result.account.premium_data,
    quota: result.account.quota,
    usage: result.account.usage,
  }
  await db.insert(tableAccount).values(account)
  return account
}
