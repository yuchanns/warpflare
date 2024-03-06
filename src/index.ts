import app, { Env } from "./app";

export default {
  fetch: app.fetch,
  scheduled: async (event, env, ctx) => {
    switch (event.cron) {
    }
  }
} satisfies ExportedHandler<Env>

