import { router } from "./router.js";

export default {
  async fetch(request, env, ctx) {
    try {
      // Attach env + ctx to request so route handlers can use them
      request.env = env;
      request.ctx = ctx;

      return await router.handle(request, env, ctx);
    } catch (err) {
      return new Response(
        JSON.stringify({ error: err.message }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
  }
};
