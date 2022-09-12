import { getWilayahRows } from "./database";
import { getCollections } from "./collections";
import { writeSourceFile } from "./source";

async function start() {
  const rows = await getWilayahRows();

  const collections = await getCollections(rows);

  if (collections.isNoDuplication) {
    await collections.writeToFile();

    await writeSourceFile();
  }
}

start().catch(console.error);

export {};
