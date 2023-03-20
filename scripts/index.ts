import fsJetpack from "fs-jetpack";
import mysql2 from "mysql2/promise";
import prettier from "prettier";

type Wilayah = {
  kode: string;
  nama: string;
};

type CodeName = {
  code: string;
  name: string;
};

type CodeNameObject = {
  [key: CodeName["code"]]: CodeName["name"];
};

type Collection = {
  province: CodeNameObject;
  district: CodeNameObject;
  subdistrict: CodeNameObject;
  village: CodeNameObject;
};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REWRITE?: string;
    }
  }
}

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
    if (process.env.REWRITE === "true" || !(await this.cache.exist())) {
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
      async function existCollection(key: keyof Collection) {
        return (await fsJetpack.existsAsync(config.cache.name.collection[key])) === "file";
      }
      return [
        await existCollection("province"),
        await existCollection("district"),
        await existCollection("subdistrict"),
        await existCollection("village"),
      ].every(Boolean);
    },
    async read(): Promise<Collection> {
      async function readCollection(key: keyof Collection) {
        return (await fsJetpack.readAsync(config.cache.name.collection[key], "json")) as unknown as CodeNameObject;
      }
      return {
        province: await readCollection("province"),
        district: await readCollection("district"),
        subdistrict: await readCollection("subdistrict"),
        village: await readCollection("village"),
      } as Collection;
    },
    async write(collection: Collection): Promise<Collection> {
      async function writeCollection(key: keyof Collection) {
        await fsJetpack.writeAsync(config.cache.name.collection[key], collection[key]);
      }
      await writeCollection("province");
      await writeCollection("district");
      await writeCollection("subdistrict");
      await writeCollection("village");
      return collection;
    },
  },
  async from(rows: Wilayah[]): Promise<Collection> {
    if (process.env.REWRITE === "true" || !(await this.cache.exist())) {
      console.log("collections:no-cache");
      const collection: Collection = {
        province: {},
        district: {},
        subdistrict: {},
        village: {},
      };

      const duplications: {
        province: CodeName[];
        district: CodeName[];
        subdistrict: CodeName[];
        village: CodeName[];
      } = {
        province: [],
        district: [],
        subdistrict: [],
        village: [],
      };

      rows.forEach((row) => {
        const { kode: code, nama: name } = row;
        const { length } = code.split(".");

        async function checkDuplication(key: keyof Collection) {
          if (collection[key].hasOwnProperty(code)) duplications[key].push({ code, name });
          else collection[key][code] = name;
        }
        if (length === 1) checkDuplication("province");
        if (length === 2) checkDuplication("district");
        if (length === 3) checkDuplication("subdistrict");
        if (length === 4) checkDuplication("village");
      });

      function isDuplicate(key: keyof Collection) {
        return duplications[key].length > 0;
      }
      if (isDuplicate("province") || isDuplicate("district") || isDuplicate("subdistrict") || isDuplicate("village")) {
        throw new Error(
          ["Duplications:", duplications.province, duplications.district, duplications.subdistrict, duplications.village].join("\n")
        );
      }

      return await this.cache.write(collection);
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

    async function writeCollection(key: keyof Collection) {
      const collectionText = typescriptformatter(
        `export const ${variable[key]}: {[key: string]: string} = ${JSON.stringify(collection[key])};`
      );
      await fsJetpack.writeAsync(config.source.name.collection[key], collectionText);
    }
    writeCollection("province");
    writeCollection("district");
    writeCollection("subdistrict");
    writeCollection("village");

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
