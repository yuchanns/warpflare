import { generateKeyPair } from '@stablelib/x25519'

export const generateWireguardKeys = () => {
  const pair = generateKeyPair()
  return {
    pubKey: btoa(String.fromCharCode(...pair.publicKey)),
    privKey: btoa(String.fromCharCode(...pair.secretKey)),
  }
}
