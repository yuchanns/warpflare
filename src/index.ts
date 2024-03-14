import app, { Bindings } from "./server";

export default {
  fetch: app.fetch,
  scheduled: async (event, env, ctx) => {
    switch (event.cron) {
    }
  }
} satisfies ExportedHandler<{ Bindings: Bindings }>

