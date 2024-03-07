import app, { Env } from "./server";

export default {
  fetch: app.fetch,
  scheduled: async (event, env, ctx) => {
    switch (event.cron) {
    }
  }
} satisfies ExportedHandler<Env>

