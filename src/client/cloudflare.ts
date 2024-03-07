import { generateRandomString, getLuckyDevice, getLuckyLocale } from "../utils"

const API_URL = "https://api.cloudflareclient.com"
const API_VERSION = "v0i2308311933"

export type RegisterData = {
  fcm_token: string,
  install_id: string,
  key: string,
  warp_enabled: boolean,
  locale: string,
  model: string,
  tos: string,
  type: string,
  referrer: string | undefined
}

export type RegisterResult = {
  id: string,
  type: string,
  model: string,
  key: string,
  token: string,
  account: {
    id: string,
    account_type: string,
    created: string,
    updated: string,
    premium_data: number,
    quota: number,
    usage: number,
    warp_plus: boolean,
    referral_count: number,
    referral_renewal_countdown: number,
    role: string,
    license: string,
    ttl: string,
  },
}

const _register = async (data: RegisterData) => {
  const u = new URL(`${API_URL}/${API_VERSION}/reg`)
  const body = JSON.stringify(data)
  const r = new Request(u, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body
  })
  const response = await fetch(r)
  if (!response.ok) {
    throw Error(response.statusText)
  }
  return await response.json() as {
    result: RegisterResult
  }
}

export const register = async (
  key: string,
  referrer?: string | undefined,
  deviceModel?: string | undefined,
) => {
  const timestamp = new Date().toISOString()
  const installId = generateRandomString(43)

  const data = {
    fcm_token: `${installId}:APA91b${generateRandomString(134)}`,
    install_id: installId,
    key,
    warp_enabled: true,
    locale: getLuckyLocale(),
    model: deviceModel ?? getLuckyDevice(),
    tos: timestamp,
    type: "IOS",
    referrer,
  } satisfies RegisterData
  const { result } = await _register(data)
  return result
}
