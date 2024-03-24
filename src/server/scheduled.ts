import { Bindings } from ".";
import { getTaskAll, saveTask } from "../client";
import { addData, reset, save } from "./task";

const getTask = ({
  GET_DATA_INTERVAL = 5,
  SAVE_ACCOUNT_INTERVAL = 10,
  RESET_ACCOUNT_INTERVAL = 2880,
}: Bindings, name: string) => {
  switch (name) {
    default:
      throw new Error(`Unknown task: ${name}`)
    case "add-data":
      return { interval: GET_DATA_INTERVAL, task: addData }
    case "save-account":
      return { interval: SAVE_ACCOUNT_INTERVAL, task: save }
    case "reset-account":
      return { interval: RESET_ACCOUNT_INTERVAL, task: reset }
  }
}

export const scheduled: ExportedHandlerScheduledHandler<Bindings> =
  async (_event, env, _ctx) => {
    const tasks = await getTaskAll(env)
    await Promise.all(tasks.map(async ({ name, triggered_at }) => {
      try {
        const interval = Math.round((Date.now() - Date.parse(triggered_at)) / 1000 / 60)
        console.log(`Task ${name} interval: ${interval} min(s)`)
        const { interval: taskInterval, task } = getTask(env, name)
        if (interval < taskInterval) {
          console.warn(`Task ${name} suspend`)
          return
        }
        const ok = await task(env)
        console.log(`Task ${name} proceed: ${ok}`)
        await saveTask(env, name)
        console.log(`Task ${name} saved`)
      } catch (e) {
        console.error(`Task ${name} panic: ${e}`)
      }
    }))
  }
