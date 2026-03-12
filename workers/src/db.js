export async function query(env, sql, params = []) {
  return await env.DB.prepare(sql).bind(...params).all();
}

export async function run(env, sql, params = []) {
  return await env.DB.prepare(sql).bind(...params).run();
}
