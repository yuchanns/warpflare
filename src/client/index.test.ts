import { generateWireguardKeys, register } from "./index"

describe("wireguard", () => {
  test("generateWireguardKeys", async () => {
    const { pubKey, privKey } = generateWireguardKeys()
    expect(pubKey).toBeTruthy()
    expect(privKey).toBeTruthy()
  })
})

describe("cloudflare", () => {
  test("register", async () => {
    const { pubKey } = generateWireguardKeys()
    const result = await register(pubKey)
    console.log(result)
  })
})
