import { Bindings } from ".";
import app from "./task";

export const scheduled: ExportedHandlerScheduledHandler<{ Bindings: Bindings }> =
  async (event, _env, _ctx) => {
    switch (event.cron) {
      case "* * * * *": // every minute
        try {
          const resp = await app.request(`/add-data`)
          if (resp.status != 200) {
            console.error(`${resp.statusText}`)
            return
          }
          console.log(`Trigger proceed: ${await resp.text()}`)

        } catch (e) {
          console.error(`Trigger panic: ${e}`)
        }
        break
      case "*/3 * * * *": // every three minute
        try {
          const resp = await app.request(`/save-account`)
          if (resp.status != 200) {
            console.error(`${resp.statusText}`)
            return
          }
          console.log(`Trigger proceed: ${await resp.text()}`)
        } catch (e) {
          console.error(`Trigger panic: ${e}`)
        }
        break
      default:
        console.error(`Unknown trigger: ${event.cron}`)
    }
  }
