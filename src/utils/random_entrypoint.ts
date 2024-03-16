import { Bindings } from "../server"

const sample = <T>(arr: T[], count: number) => {
  const shuffled = arr.slice(0)
  let i = arr.length
  while (i-- > arr.length - count) {
    const index = Math.floor((i + 1) * Math.random()) as number
    [shuffled[i], shuffled[index]] = [shuffled[index], shuffled[i]]
  }
  return shuffled.slice(arr.length - count)
}

export const getRandomEntryPoints = (
  { RANDOM_COUNT = 10 }: Bindings,
  ips: {
    ip: string,
    port: number,
    loss: number,
    delay: number,
    name: string,
  }[],
  best: boolean,
) => {
  if (ips.length == 0) {
    throw Error("No entrypoints available. Please try again later.")
  }
  if (ips.length < RANDOM_COUNT) {
    console.log(`Entrypoints are less than ${RANDOM_COUNT}, only ${ips.length}`)
    return ips
  }
  if (best) {
    return ips.sort((a, b) =>
      a.loss == b.loss ?
        a.delay - b.delay :
        a.loss - b.loss).slice(0, RANDOM_COUNT)
  }
  return sample(ips, RANDOM_COUNT)
}
