import jetpack from "fs-jetpack";

import type { WilayahRow } from "./types";

import { COLLECTIONS_PATH } from "./const";

const codeIs = (code: string) => {
  const { length } = code.split(".");
  return { provinces: length === 1, districts: length === 2, subdistricts: length === 3, villages: length === 4 };
};

const initialResults = () => {
  return {
    provinces: {} as Record<string, string>,
    districts: {} as Record<string, string>,
    subdistricts: {} as Record<string, string>,
    villages: {} as Record<string, string>,
  };
};

const initialDuplicates = () => {
  return {
    provinces: [] as { code: string; name: string }[],
    districts: [] as { code: string; name: string }[],
    subdistricts: [] as { code: string; name: string }[],
    villages: [] as { code: string; name: string }[],
  };
};

const getIsNoDuplication = (duplicates: ReturnType<typeof initialDuplicates>) => {
  return (
    duplicates.provinces.length === 0 &&
    duplicates.districts.length === 0 &&
    duplicates.subdistricts.length === 0 &&
    duplicates.villages.length === 0
  );
};

async function getCollections(rows: WilayahRow[]) {
  let results = initialResults();
  let duplicates = initialDuplicates();

  rows.forEach((row) => {
    const { kode: code, nama: name } = row;

    const is = codeIs(code);

    if (is.provinces) {
      if (results.provinces.hasOwnProperty(code)) duplicates.provinces.push({ code, name });
      else results.provinces[code] = name;
    }

    if (is.districts) {
      if (results.districts.hasOwnProperty(code)) duplicates.districts.push({ code, name });
      else results.districts[code] = name;
    }

    if (is.subdistricts) {
      if (results.subdistricts.hasOwnProperty(code)) duplicates.subdistricts.push({ code, name });
      else results.subdistricts[code] = name;
    }

    if (is.villages) {
      if (results.villages.hasOwnProperty(code)) duplicates.villages.push({ code, name });
      else results.villages[code] = name;
    }
  });

  const isNoDuplication = getIsNoDuplication(duplicates);

  async function writeToFile() {
    await jetpack.writeAsync(COLLECTIONS_PATH.provinces, results.provinces);
    await jetpack.writeAsync(COLLECTIONS_PATH.districts, results.districts);
    await jetpack.writeAsync(COLLECTIONS_PATH.subdistricts, results.subdistricts);
    await jetpack.writeAsync(COLLECTIONS_PATH.villages, results.villages);
    console.log("All collection files saved");
  }

  return {
    isNoDuplication,
    writeToFile,
  };
}

export { getCollections };
