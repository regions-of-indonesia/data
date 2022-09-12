import jetpack from "fs-jetpack";
import mysql2 from "mysql2/promise";

import type { WilayahRow } from "./types";

import { MYSQLConnectionOptions, WILAYAH_QUERY, CACHE_PATH } from "./const";

// MYSQL

async function sqlConnect() {
  return await mysql2.createConnection(MYSQLConnectionOptions);
}

async function sqlExecute(query: string) {
  const conn = await sqlConnect();
  const result = await conn.execute(query);
  await conn.end();
  return result;
}

async function sqlQuery() {
  const [rows] = await sqlExecute(WILAYAH_QUERY);
  return rows as unknown as WilayahRow[];
}

// CACHE

async function cacheExist() {
  return (await jetpack.existsAsync(CACHE_PATH)) === "file";
}

async function cacheRead() {
  const rows = await jetpack.readAsync(CACHE_PATH, "json");
  return rows as unknown as WilayahRow[];
}

async function cacheWrite(data: WilayahRow[]) {
  await jetpack.writeAsync(CACHE_PATH, data);
  return data;
}

// MAIN

async function getWilayahRows() {
  if (await cacheExist()) {
    const result = await cacheRead();
    console.log(`Get rows from cache`);
    return result;
  } else {
    const result = await cacheWrite(await sqlQuery());
    console.log(`Get rows from database`);
    return result;
  }
}

export { getWilayahRows };
