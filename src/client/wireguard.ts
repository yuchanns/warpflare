import { generateKeyPair } from '@stablelib/x25519'

export const generateWireguardKeys = () => {
  const { publicKey, secretKey } = generateKeyPair()
  return {
    pubKey: btoa(String.fromCharCode(...publicKey)),
    privKey: btoa(String.fromCharCode(...secretKey)),
  }
}
