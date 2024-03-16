export const SING_BOX = {
  "log": {
    "level": "info"
  },
  "dns": {
    "servers": [
      {
        "tag": "dns_proxy",
        "address": "https://1.1.1.1/dns-query",
        "address_resolver": "dns_resolver",
        "strategy": "ipv4_only",
        "detour": "select"
      },
      {
        "tag": "dns_direct",
        "address": "h3://dns.alidns.com/dns-query",
        "address_resolver": "dns_resolver",
        "strategy": "ipv4_only",
        "detour": "direct"
      },
      {
        "tag": "dns_block",
        "address": "rcode://refused"
      },
      {
        "tag": "dns_resolver",
        "address": "223.5.5.5",
        "strategy": "ipv4_only",
        "detour": "direct"
      }
    ],
    "rules": [
      {
        "outbound": "any",
        "server": "dns_direct"
      },
      {
        "clash_mode": "Direct",
        "server": "dns_direct"
      },
      {
        "clash_mode": "Global",
        "server": "dns_proxy"
      },
      {
        "rule_set": "geosite-geolocation-cn",
        "server": "dns_direct"
      }
    ],
    "disable_cache": false,
    "final": "dns_proxy"
  },
  "inbounds": [
    {
      "type": "mixed",
      "tag": "mixed-in",
      "listen": "0.0.0.0",
      "listen_port": 5353,
      "tcp_fast_open": false,
      "tcp_multi_path": false,
      "udp_fragment": false,
      "udp_timeout": "5m",
      "sniff": false,
      "sniff_override_destination": false,
      "sniff_timeout": "300ms",
      "domain_strategy": "prefer_ipv4",
      "udp_disable_domain_unmapping": false
    }
  ],
  "outbounds": [
    {
      "tag": "select",
      "type": "selector",
      "default": "urltest",
      "outbounds": [
        "urltest"
      ]
    },
    {
      "tag": "urltest",
      "type": "urltest",
      "outbounds": []
    },
    {
      "tag": "direct",
      "type": "direct"
    },
    {
      "tag": "block",
      "type": "block"
    },
    {
      "tag": "dns-out",
      "type": "dns"
    }
  ],
  "route": {
    "rules": [
      {
        "type": "logical",
        "mode": "or",
        "rules": [{ "protocol": "dns" }, { "port": 53 }],
        "outbound": "dns-out"
      },
      { "ip_is_private": true, "outbound": "direct" },
      { "clash_mode": "Direct", "outbound": "direct" },
      { "clash_mode": "Global", "outbound": "select" },
      {
        "type": "logical",
        "mode": "or",
        "rules": [
          { "port": 853 },
          { "network": "udp", "port": 443 },
          { "protocol": "stun" }
        ],
        "outbound": "dns-out"
      },
      {
        "rule_set": ["geoip-cn", "geosite-geolocation-cn"],
        "outbound": "direct"
      }
    ],
    "rule_set": [
      {
        "type": "remote",
        "tag": "geoip-cn",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geoip/rule-set/geoip-cn.srs"
      },
      {
        "type": "remote",
        "tag": "geosite-geolocation-cn",
        "format": "binary",
        "url": "https://raw.githubusercontent.com/SagerNet/sing-geosite/rule-set/geosite-geolocation-cn.srs"
      }
    ]
  }
}
