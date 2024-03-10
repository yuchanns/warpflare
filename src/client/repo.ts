import { sqliteTable } from "drizzle-orm/sqlite-core"
import { Bindings } from "../server"
import { register } from "./cloudflare"
import { generateWireguardKeys } from "./wireguard"
import { drizzle } from "drizzle-orm/d1"
import { text, integer } from "drizzle-orm/sqlite-core"
import { desc, eq } from "drizzle-orm"

const tableAccount = sqliteTable("Account", {
  account_id: text("account_id").primaryKey(),
  account_type: text("account_type").notNull(),
  created_at: text("created_at").notNull(),
  updated_at: text("updated_at").notNull(),
  model: text("model").notNull(),
  referrer: text("referrer").notNull(),
  private_key: text("private_key").notNull(),
  license_key: text("license_key").notNull(),
  token: text("token").notNull(),
  premium_data: integer("premium_data").notNull(),
  quota: integer("quota").notNull(),
  usage: integer("usage").notNull(),
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
  const { pubKey, privKey } = generateWireguardKeys()
  const result = await register(pubKey)
  account = {
    account_id: result.id,
    account_type: result.type,
    created_at: result.account.created,
    updated_at: result.account.updated,
    model: result.model,
    referrer: "",
    private_key: privKey,
    license_key: result.account.license,
    token: result.token,
    premium_data: result.account.premium_data,
    quota: result.account.quota ?? 0,
    usage: result.account.usage ?? 0,
  }
  await db.insert(tableAccount).values(account)
  return account
}

export const saveAccount = async (
  { DATABASE: DB }: Bindings,
  account: {
    account_id: string,
    license_key: string,
    premium_data: number,
    quota: number,
    usage: number,
    updated_at: string,
  }) => {
  const db = drizzle(DB)
  await db.update(tableAccount)
    .set({
      license_key: account.license_key,
      premium_data: account.premium_data,
      quota: account.quota,
      usage: account.usage,
      updated_at: account.updated_at,
    }).where(
      eq(tableAccount.account_id, account.account_id),
    )
  return
}
