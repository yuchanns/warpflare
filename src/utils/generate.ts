import { CLASH, SING_BOX } from "./config"
import YAML from 'yaml'

const CF_PUBLIC_KEY = "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo="

export enum SubType {
  Clash,
  Shadowrocket,
  Surge,
  SingBox,
  Unknown,
}

export enum ProxyFormat {
  Only,
  Group,
  Full,
}

export const generateClash = (
  ips: {
    ip: string,
    port: number,
    name: string,
  }[],
  privateKey: string,
  proxyFormat: ProxyFormat = ProxyFormat.Full,
  _isAndroid: boolean,
) => {
  const config = Object.assign({}, {
    type: "wireguard",
    ip: "172.16.0.2/32",
    udp: true,
    mtu: 1280,
    "public-key": CF_PUBLIC_KEY,
    "remote-dns-resolve": true,
    "private-key": privateKey,
  })
  const proxies = ips
    .map(({ ip: server, port, name }) =>
      Object.assign({}, { server, name, port }, config))
  const clash = Object.assign({}, structuredClone(CLASH), { proxies: structuredClone(proxies) })
  clash["proxy-groups"][1] = Object.assign({}, clash["proxy-groups"][1],
    { proxies: structuredClone(proxies.map(({ name }) => name)) })
  if (proxyFormat == ProxyFormat.Only) {
    return YAML.stringify({ "proxies": clash.proxies })
  } else if (proxyFormat == ProxyFormat.Group) {
    return YAML.stringify({ "proxies": clash.proxies, "proxy-groups": clash["proxy-groups"] })
  }
  return YAML.stringify(clash)
}

export const generateSingBox = (
  ips: {
    ip: string,
    port: number,
    name: string,
  }[],
  privateKey: string,
) => {
  const config = {
    type: "wireguard",
    local_address: ["172.16.0.2/32"],
    private_key: privateKey,
    peer_public_key: CF_PUBLIC_KEY,
    system_interface: false,
    mtu: 1280
  }
  const outbounds = ips.map(({ ip: server, port: server_port, name: tag }) =>
    Object.assign({}, {
      server,
      server_port,
      peers: [{
        server,
        server_port,
        public_key: CF_PUBLIC_KEY,
        pre_shared_key: "",
        allowed_ips: ['0.0.0.0/0', '::/0']
      }],
      tag,
    }, config))
  const names = ips.map(({ name }) => name)
  const singBox = structuredClone(SING_BOX)
  singBox.outbounds.push(...outbounds)
  for (let idx of [0, 1]) {
    const obs = singBox.outbounds[idx].outbounds as string[]
    obs.push(...names)
  }
  return JSON.stringify(singBox, null, 2)
}

export const generateShadowrocket = (
  ips: {
    ip: string,
    port: number,
    name: string,
  }[],
  privateKey: string,
) => {
  const urls = ips.map(({ ip, port, name }) =>
    `wg://[${ip}]:${port}?publicKey=${CF_PUBLIC_KEY}&privateKey=${privateKey}`
    + `&dns=1.1.1.1,1.0.0.1&ip=172.16.0.2&udp=1`
    + `&flag=${name.split('-')[0].replace(/[^\x00-\x7F]/g, "")}#${encodeURIComponent(name)}`)
  return btoa(urls.join("\n"))
}
