# warpflare

![GitHub License](https://img.shields.io/github/license/yuchanns/warpflare)

Keep your WARP+ traffic topped up with Cloudflare Workers.

This project is inspired by [WARP-CLASH](https://github.com/vvbbnn00/WARP-Clash-API).

> **Warning**
>
> This project is entirely non-commercial and is intended solely for educational
> and communicative purposes. Please do not use it for illegal activities, as
> the consequences will be borne by the user.
>
> This project is exclusively for advanced users with programming skills and is not recommended for beginners.

## Requirement
- A Cloudflare account is required.

## Instructions
To get started, follow these steps:

1. **Fork** this project by [![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/yuchanns/warpflare).
2. Add **three** required secrets to `Settings > Security > Secrets and variables > Actions > Repository Secrets > New repository secrets`:
    - `CLOUDFLARE_ACCOUNT_ID`: Find your account ID using the [instructions here](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/).
    - `CLOUDFLARE_API_TOKEN`: Create this token with the `Edit Cloudflare Workers` template and permission of `D1 Edit` included. See image below for reference:
        ![api token](https://github.com/yuchanns/warpflare/assets/25029451/89da63d6-6db4-4320-8d63-46b8fd11fe8d)
    - `SECRET_KEY`: Choose any value for authorizing access to the subscription URL.

3. Go to `Actions > Deploy` and manually run the workflow by clicking `Run workflow`. The firs deploy might be failed, please retry.
4. Find the route for your worker in your Cloudflare dashboard under `Workers & Pages`.
5. Assuming the route is `warp.xxx.workers.dev`, you can access the subscription using:
    - `https://warp.xxx.workers.dev/sub?token=${SECRET_KEY}&proxyFormat=full&randomName=true&best=true`: detect the subscription type based on user-agent.
    - `https://warp.xxx.workers.dev/api/:subType?token=${SECRET_KEY}&proxyFormat=full&randomName=true&best=true`: manually specify the subscription type to use.

The available parameters are shown in the table below:

|Name|Options|Description|
|---|---|---|
|subType|clash, quantumult, v2ray, shadowrocket, sing-box|**PR**s are welcome|
|proxyFormat|only_proxies, with_groups, full|only for clash|

You can control the worker behavior using the following environment variables (**not** secrets):

|Name|Default|Description|
|---|---|---|
|LOSS_THRESHOLD|10|Packet loss rate (percentage)|
|DELAY_THRESHOLD|500|Delay threshold (ms)|
|RANDOM_COUNT|The number of nodes|10|
|GET_DATA_INTERVAL|2|Interval for replenishing `WARP+` traffic (min)|
|SAVE_ACCOUNT_INTERVAL|10|Interval for dropping accounts (min)|

## Optimization

Even though default IPs are embedded, you may encounter varying levels of loss and delay based on your location. To enhance your overall experience, it is essential to optimize your IP.

To get started, clone this project and turn off all the proxies on your local network. Make sure to have a node environment and pnpm installed. Install project dependencies for the first time using `pnpm install`.

Next, navigate to the project path and run the following command:

```bash
pnpm optimize
```

This will upload a sql to your worker to obtain optimized IPs. Once the subscription is refreshed, a set of optimized nodes will be distributed.

## Roadmap

- [ ] Telegram bot
