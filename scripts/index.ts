import fsJetpack from "fs-jetpack";
import mysql2 from "mysql2/promise";
import prettier from "prettier";

type Wilayah = { kode: string; nama: string };

type CodeName = { code: string; name: string };

type CodeNameObject = { [key: CodeName["code"]]: CodeName["name"] };

type RegionLevel = "province" | "district" | "subdistrict" | "village";

type Collection = Record<RegionLevel, CodeNameObject>;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REWRITE_WILAYAH?: string;
      REWRITE_COLLECTION?: string;
    }
  }
}

const RegionLevelArray = ["province", "district", "subdistrict", "village"] satisfies RegionLevel[];
const mapRegionLevelArray = <T extends any>(callback: (level: RegionLevel) => T) => RegionLevelArray.map(callback);

const config = {
  cache: {
    get $base() {
      return [`.regions-of-indonesia`, "cache"].join("/");
    },
    path(...args: string[]) {
      return [this.$base].concat(args).join("/");
    },
    location: {
      database(...args: string[]) {
        return config.cache.path("database", ...args);
      },
      collection(...args: string[]) {
        return config.cache.path("collection", ...args);
      },
    },
    name: {
      database: {
        get wilayah() {
          return config.cache.location.database("wilayah.json");
        },
      },
      collection: {
        get province() {
          return config.cache.location.collection("province.json");
        },
        get district() {
          return config.cache.location.collection("district.json");
        },
        get subdistrict() {
          return config.cache.location.collection("subdistrict.json");
        },
        get village() {
          return config.cache.location.collection("village.json");
        },
      },
    },
  },
  source: {
    get $base() {
      return "src";
    },
    path(...args: string[]) {
      return [this.$base].concat(args).join("/");
    },
    name: {
      collection: {
        get province() {
          return config.source.path("province.ts");
        },
        get district() {
          return config.source.path("district.ts");
        },
        get subdistrict() {
          return config.source.path("subdistrict.ts");
        },
        get village() {
          return config.source.path("village.ts");
        },
      },
      get index() {
        return config.source.path("index.ts");
      },
    },
  },
};

const wilayah = {
  sql: {
    async connect() {
      return await mysql2.createConnection({ host: "localhost", user: "root", database: "wilayah" });
    },
    async execute(query: string) {
      const conn = await this.connect();
      const result = await conn.execute(query);
      await conn.end();
      return result;
    },
    async query() {
      const [rows] = await this.execute("SELECT * FROM wilayah");
      return rows as unknown as Wilayah[];
    },
  },
  cache: {
    async exist(): Promise<boolean> {
      return (await fsJetpack.existsAsync(config.cache.name.database.wilayah)) === "file";
    },
    async read(): Promise<Wilayah[]> {
      const rows = await fsJetpack.readAsync(config.cache.name.database.wilayah, "json");
      return rows as unknown as Wilayah[];
    },
    async write(data: Wilayah[]): Promise<Wilayah[]> {
      await fsJetpack.writeAsync(config.cache.name.database.wilayah, data);
      return data;
    },
  },
  async rows(): Promise<Wilayah[]> {
    if (process.env.REWRITE_WILAYAH === "true" || !(await this.cache.exist())) {
      console.log("wilayah:no-cache");
      return await this.cache.write(await this.sql.query());
    }

    console.log("wilayah:cache");
    return await this.cache.read();
  },
};

const collections = {
  cache: {
    async exist(): Promise<boolean> {
      return (
        await Promise.all(
          mapRegionLevelArray(async (key: keyof Collection) => (await fsJetpack.existsAsync(config.cache.name.collection[key])) === "file")
        )
      ).every(Boolean);
    },
    async read(): Promise<Collection> {
      const readCollection = async (key: keyof Collection) =>
        (await fsJetpack.readAsync(config.cache.name.collection[key], "json")) as unknown as CodeNameObject;
      return {
        province: await readCollection("province"),
        district: await readCollection("district"),
        subdistrict: await readCollection("subdistrict"),
        village: await readCollection("village"),
      } as Collection;
    },
    async write(collection: Collection): Promise<Collection> {
      await Promise.all(
        mapRegionLevelArray(async (key: keyof Collection) => fsJetpack.writeAsync(config.cache.name.collection[key], collection[key]))
      );
      return collection;
    },
  },
  async from(rows: Wilayah[]): Promise<Collection> {
    if (process.env.REWRITE_COLLECTION === "true" || !(await this.cache.exist())) {
      console.log("collections:no-cache");
      const C: Collection = { province: {}, district: {}, subdistrict: {}, village: {} };

      const D: Record<RegionLevel, CodeName[]> = { province: [], district: [], subdistrict: [], village: [] };

      let code: string, name: string, length: number;

      const checkCodeDuplication = (key: keyof Collection) => {
        if (C[key].hasOwnProperty(code)) D[key].push({ code, name });
        else C[key][code] = name;
      };

      const mapCodeNameToCode_fn = (codename: CodeName) => codename.code;
      const mapCodeNameToCode = (codenames: CodeName[]) => codenames.map(mapCodeNameToCode_fn);

      rows.forEach((row) => {
        (code = row.kode), (name = row.nama), (length = code.split(".").length);

        if (length === 1) checkCodeDuplication("province");
        if (length === 2) checkCodeDuplication("district");
        if (length === 3) checkCodeDuplication("subdistrict");
        if (length === 4) checkCodeDuplication("village");
      });

      const isDuplicate = (key: keyof Collection) => D[key].length > 0;
      if (isDuplicate("province") || isDuplicate("district") || isDuplicate("subdistrict") || isDuplicate("village")) {
        throw new Error(
          [
            "Duplications:",
            `          province : ${mapCodeNameToCode(D.province).join(",")}`,
            `          district : ${mapCodeNameToCode(D.district).join(",")}`,
            `       subdistrict : ${mapCodeNameToCode(D.subdistrict).join(",")}`,
            `           village : ${mapCodeNameToCode(D.village).join(",")}`,
          ].join("\n")
        );
      }

      return await this.cache.write(C);
    }

    console.log("collections:cache");
    return await this.cache.read();
  },
};

const typescriptformatter = (source: string) => prettier.format(source, { parser: "typescript" });

const source = {
  async write(collection: Collection) {
    const variable = {
      province: "PROVINCE",
      district: "DISTRICT",
      subdistrict: "SUBDISTRICT",
      village: "VILLAGE",
    };

    await Promise.all(
      mapRegionLevelArray(async (key: keyof Collection) => {
        const collectionText = typescriptformatter(
          `export const ${variable[key]}: {[key: string]: string} = ${JSON.stringify(collection[key])};`
        );
        await fsJetpack.writeAsync(config.source.name.collection[key], collectionText);
      })
    );

    const indexText = typescriptformatter(
      Object.entries(variable)
        .map(([from, variable]) => `export { ${variable} } from './${from}';`)
        .join("")
    );
    await fsJetpack.writeAsync(config.source.name.index, indexText);
  },
};

async function start() {
  await source.write(await collections.from(await wilayah.rows()));
  return "Done";
}

start().then(console.info).catch(console.error);
