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

export const resetCurrentAccount = async (
  { DATABASE: DB }: Bindings,
  accountId: string,
) => {
  console.log("Reset current account")
  const db = drizzle(DB)
  // NOTE: To register a brand new account, an old pubKey cannot be used as
  // doing so will result in an Unauthorized error.
  // Therefore, it is necessary to regenerate the key pair.
  const { pubKey, privKey } = generateWireguardKeys()
  const result = await register(pubKey)
  const account = {
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
  await db.update(tableAccount)
    .set(account).where(
      eq(tableAccount.account_id, accountId),
    )
  return account
}

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

const tableIP = sqliteTable("IP", {
  address: text("address").primaryKey(),
  loss: text("loss").notNull(),
  delay: text("delay").notNull(),
  name: text("name").notNull(),
  unique_name: text("unique_name").notNull()
})

export const generateDefaultIPv4 = () => {
  return [
    { ip: "162.159.192.116", "port": 3854, loss: 0.00, delay: 165, name: "🇺🇸 US-CF-Orange" },
    { ip: "162.159.192.237", "port": 8742, loss: 0.00, delay: 165, name: "🇺🇸 US-CF-Brown" },
    { ip: "162.159.195.211", "port": 939, loss: 0.00, delay: 165, name: "🇺🇸 US-CF-Indigo" },
    { ip: "162.159.195.122", "port": 8742, loss: 0.00, delay: 166, name: "🇺🇸 US-CF-Green" },
    { ip: "162.159.195.122", "port": 4177, loss: 0.00, delay: 166, name: "🇺🇸 US-CF-Gray" },
    { ip: "162.159.195.202", "port": 4177, loss: 0.00, delay: 166, name: "🇺🇸 US-CF-Yellow" },
    { ip: "162.159.195.78", "port": 8742, loss: 0.00, delay: 166, name: "🇺🇸 US-CF-Red" },
    { ip: "162.159.192.197", "port": 8742, loss: 0.00, delay: 167, name: "🇺🇸 US-CF-White" },
    { ip: "162.159.195.186", "port": 8742, loss: 0.00, delay: 167, name: "🇺🇸 US-CF-Blue" },
    { ip: "162.159.195.186", "port": 4177, loss: 0.00, delay: 167, name: "🇺🇸 US-CF-Pink" },
    { ip: "162.159.195.199", "port": 2408, loss: 0.00, delay: 167, name: "🇺🇸 US-CF-Purple" },
  ]
}

export const getIPAll = async (
  { DATABASE: DB, LOSS_THRESHOLD = 10, DELAY_THRESHOLD = 500 }: Bindings,
  randomName: boolean, ipv6: boolean,
) => {
  const db = drizzle(DB)
  const rows = await db.select().from(tableIP).all()
  return rows.map(({ address, loss, delay, name, unique_name }) => {
    name = randomName ? unique_name : name
    const [ip, port] = splitIpPort(address)
    return {
      ip,
      port: parseInt(port, 10),
      loss: parseFloat(loss.replaceAll("%", "")),
      delay: parseInt(delay.replace("ms", ""), 10),
      name,
    }
  }).filter(({ loss, delay }) =>
    loss <= LOSS_THRESHOLD && delay <= DELAY_THRESHOLD)
    .filter(({ ip }) => ipv6 || !ip.includes(":"))
}

function splitIpPort(address: string): [string, string] {
  // check if the address is IPv6
  const bracketRegex = /^\[(.*?)]:(\d+)$/;
  const v6match = address.match(bracketRegex);
  if (v6match) {
    return [v6match[1], v6match[2]];
  }

  const [ip, port] = address.split(":");
  return [ip, port];
}

const tableTask = sqliteTable("Task", {
  name: text("name").primaryKey(),
  triggered_at: text("triggered_at").notNull(),
})

export const getTaskAll = async ({ DATABASE: DB }: Bindings) => {
  const db = drizzle(DB)
  const rows = await db.select().from(tableTask).all()
  return rows.map(({ name, triggered_at }) => ({ name, triggered_at }))
}

export const saveTask = async ({ DATABASE: DB }: Bindings, name: string) => {
  const db = drizzle(DB)
  const triggered_at = new Date().toISOString().replace("T", " ").substring(0, 19)
  return await db.update(tableTask)
    .set({ triggered_at })
    .where(eq(tableTask.name, name))
}
