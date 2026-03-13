export async function query(env, sql, params = []) {
  const stmt = env.DB.prepare(sql);
  const bound = params.length ? stmt.bind(...params) : stmt;
  const result = await bound.all();
  return result;
}

export async function exec(env, sql, params = []) {
  const stmt = env.DB.prepare(sql);
  const bound = params.length ? stmt.bind(...params) : stmt;
  return await bound.run();
}
