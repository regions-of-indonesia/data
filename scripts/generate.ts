import fs from "fs-jetpack";
import { createConnection } from "mysql2/promise";
import { format } from "prettier";
import { table } from "table";

import type { Region } from "@regions-of-indonesia/types";

type Wilayah = { kode: string; nama: string };

const src = fs.cwd("src");

const start = async () => {
  // read wilayah.sql (require mysql server)
  const connection = await createConnection({ host: "localhost", user: "root", database: "wilayah" });
  let [rows] = (await connection.execute("SELECT * FROM wilayah")) as unknown as [Wilayah[]];
  await connection.end();

  // remove src
  await src.removeAsync("./");

  // variables
  type KEY = "PROVINCE" | "DISTRICT" | "SUBDISTRICT" | "VILLAGE";
  const KEYS: KEY[] = ["PROVINCE", "DISTRICT", "SUBDISTRICT", "VILLAGE"];
  const RECORDS: Record<KEY, Record<string, string>> = { PROVINCE: {}, DISTRICT: {}, SUBDISTRICT: {}, VILLAGE: {} };
  const COUNTS: Record<KEY, number> = { PROVINCE: 0, DISTRICT: 0, SUBDISTRICT: 0, VILLAGE: 0 };
  const DUPLICATES: Record<KEY, Region[]> = { PROVINCE: [], DISTRICT: [], SUBDISTRICT: [], VILLAGE: [] };

  // simulate duplicates
  ((enable: boolean = false) => {
    if (enable) {
      rows = rows.map(({ kode, nama }) => {
        if (["11", "12", "13"].includes(kode)) kode = "11";
        if (["11.01", "11.02", "11.03"].includes(kode)) kode = "11.01";
        if (["11.01.01", "11.01.02", "11.01.03"].includes(kode)) kode = "11.01.01";
        if (["11.01.01.2001", "11.01.01.2002", "11.01.01.2003"].includes(kode)) kode = "11.01.01.2001";
        return { kode, nama };
      });
    }
  })();

  // classification
  for (const { kode, nama } of rows) {
    const splitted = kode.split(".");

    const insert = (key: KEY) => {
      if (kode in RECORDS[key]) {
        const found = DUPLICATES[key].find((region) => region.code === kode && region.name === RECORDS[key][kode]);
        if (!found) DUPLICATES[key].push({ code: kode, name: RECORDS[key][kode] });
        DUPLICATES[key].push({ code: kode, name: nama });
      } else {
        RECORDS[key][kode] = nama;
        COUNTS[key]++;
      }
    };

    switch (splitted.length) {
      case 1:
        insert("PROVINCE");
        break;

      case 2:
        insert("DISTRICT");
        break;

      case 3:
        insert("SUBDISTRICT");
        break;

      case 4:
        insert("VILLAGE");
        break;
    }
  }

  // catch duplicates
  if (
    DUPLICATES.PROVINCE.length >= 1 ||
    DUPLICATES.DISTRICT.length >= 1 ||
    DUPLICATES.SUBDISTRICT.length >= 1 ||
    DUPLICATES.VILLAGE.length >= 1
  ) {
    const max = Math.max(DUPLICATES.PROVINCE.length, DUPLICATES.DISTRICT.length, DUPLICATES.SUBDISTRICT.length, DUPLICATES.VILLAGE.length);

    const CONTENT: string[][] = [
      ["PROVINCE", "", "DISTRICT", "", "SUBDISTRICT", "", "VILLAGE", ""],
      ["CODE", "NAME", "CODE", "NAME", "CODE", "NAME", "CODE", "NAME"],
    ];

    for (let index = 0; index < max; index++) {
      const ROW: string[] = [];
      const push = (key: KEY) => {
        const region = DUPLICATES[key].at(index);
        ROW.push(...(region ? [region.code, region.name] : ["", ""]));
      };
      KEYS.forEach(push);
      CONTENT.push(ROW);
    }

    throw table(CONTENT, {
      spanningCells: [
        { col: 0, row: 0, colSpan: 2, alignment: "center" },
        { col: 2, row: 0, colSpan: 2, alignment: "center" },
        { col: 4, row: 0, colSpan: 2, alignment: "center" },
        { col: 6, row: 0, colSpan: 2, alignment: "center" },
      ],
      header: { content: "DUPLICATES", alignment: "center" },
    });
  }

  // format typescript
  const ts = (source: string) => format(source, { parser: "typescript" });

  // write records[key]
  await Promise.all(
    KEYS.map((key) =>
      src.writeAsync(
        `${key.toLowerCase()}.ts`,
        ts(`
  export const ${key}: Record<string, string> = ${JSON.stringify(RECORDS[key])};
  `)
      )
    )
  );

  // then generated
  return table([["key", "count"]].concat(KEYS.map((key) => [key, `${COUNTS[key]}`])), {
    header: { content: "GENERATED", alignment: "center" },
  });
};

start().then(console.info).catch(console.error);
