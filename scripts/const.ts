import type { ConnectionOptions } from "mysql2/promise";

const MYSQLConnectionOptions: ConnectionOptions = {
  host: "localhost",
  user: "root",
  database: "wilayah",
};

const WILAYAH_QUERY = "SELECT * FROM wilayah";

const CACHE_PATH = "database/wilayah.json";

const COLLECTIONS_PATH = {
  provinces: "collections/provinces.json",
  districts: "collections/districts.json",
  subdistricts: "collections/subdistricts.json",
  villages: "collections/villages.json",
};

const SOURCE_PATH = {
  index: "src/index.ts",
  provinces: "src/provinces.ts",
  districts: "src/districts.ts",
  subdistricts: "src/subdistricts.ts",
  villages: "src/villages.ts",
};

export { MYSQLConnectionOptions, WILAYAH_QUERY, CACHE_PATH, COLLECTIONS_PATH, SOURCE_PATH };
