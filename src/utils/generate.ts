import { CLASH } from "./clash_config"
import YAML from 'yaml'

const CF_PUBLIC_KEY = "bmXOC+F1FxEMF9dyiK2H5/1SUtzH0JuVo51h2wPfgyo="

export enum SubType {
  Clash,
  Wireguard,
  Surge,
  Shadowrocket,
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
    unique_name: string,
  }[],
  privateKey: string,
  proxyFormat: ProxyFormat = ProxyFormat.Full,
  randomName: boolean,
  isAndroid: boolean,
) => {
  const config = Object.assign({}, {
    type: "wireguard",
    ip: "172.16.0.2",
    udp: true,
    mtu: 1280,
  }, isAndroid ? {} : { dns: ['1.1.1.1', '1.0.0.1'] })
  const proxies = ips
    .map(({ ip: server, port, name, unique_name }) => ({
      name: randomName ? unique_name : name,
      server,
      port,
      "private-key": privateKey,
      "public-key": CF_PUBLIC_KEY,
      "remote-dns-resolve": true,
      ...Object.assign({}, config),
    }))
  const clash = Object.assign({}, CLASH, { proxies })
  if (proxyFormat == ProxyFormat.Only) {
    return YAML.stringify({ "proxies": clash.proxies })
  } else if (proxyFormat == ProxyFormat.Group) {
    return YAML.stringify({ "proxies": clash.proxies, "proxy-groups": clash["proxy-groups"] })
  }
  return YAML.stringify(clash)
}
