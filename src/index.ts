import app, { Bindings } from "./server";

export default {
  fetch: app.fetch,
  scheduled: app.scheduled,
} satisfies ExportedHandler<Bindings>

