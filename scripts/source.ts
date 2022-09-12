import jetpack from "fs-jetpack";

import { COLLECTIONS_PATH, SOURCE_PATH } from "./const";

const variables = {
  provinces: "Provinces",
  districts: "Districts",
  subdistricts: "Subdistricts",
  villages: "Villages",
};

type KeyofVariable = keyof typeof variables;

function toTypescriptFormat(Variable: string, json: string) {
  return `export const ${Variable}: {[key: string]: string} = ${json};`;
}

async function execute(filename: KeyofVariable) {
  const result = await jetpack.readAsync(COLLECTIONS_PATH[filename]);

  const typescriptResult = toTypescriptFormat(variables[filename], result);

  await jetpack.writeAsync(SOURCE_PATH[filename], typescriptResult);
}

const filenames = Object.keys(variables) as KeyofVariable[];

async function index() {
  const text = [filenames.map((filename) => `export { ${variables[filename]} } from './${filename}';`).join("\n")].join("\n\n");
  await jetpack.writeAsync(SOURCE_PATH.index, text);
}

async function writeSourceFile() {
  filenames.forEach(execute);
  await index();
  console.log("All source files saved");
}

export { writeSourceFile };
