import { generateWireguardKeys, register } from "./index"

describe("wireguard", () => {
  test("generateWireguardKeys", async () => {
    const pair = generateWireguardKeys()
    expect(pair.pubKey).toBeTruthy()
    expect(pair.privKey).toBeTruthy()
  })
})

describe("cloudflare", () => {
  test("register", async () => {
    const pair = generateWireguardKeys()
    const result = await register(pair.pubKey)
    console.log(result)
  })
})
