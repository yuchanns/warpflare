import { Bindings } from ".";
import { addData, save } from "./task";

export const scheduled: ExportedHandlerScheduledHandler<Bindings> =
  async (event, env, _ctx) => {
    console.log(env)
    switch (event.cron) {
      case "*/5 * * * *": // every five minute
        try {
          const ok = await addData(env)
          console.log(`Trigger proceed: ${ok}`)

        } catch (e) {
          console.error(`Trigger panic: ${e}`)
        }
        break
      case "*/10 * * * *": // every ten minute
        try {
          const ok = await save(env)
          console.log(`Trigger proceed: ${ok}`)
        } catch (e) {
          console.error(`Trigger panic: ${e}`)
        }
        break
      default:
        console.error(`Unknown trigger: ${event.cron}`)
    }
  }
