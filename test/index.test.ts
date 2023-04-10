import { describe, expect, it } from "vitest";

import { PROVINCE, DISTRICT, SUBDISTRICT, VILLAGE } from "../src";

const isNotNull = (value: unknown) => value != null,
  isObject = (value: unknown): value is object => typeof value === "object" && isNotNull(value),
  isString = (value: unknown): value is string => typeof value === "string" && isNotNull(value);

const coderegexp = new RegExp(/^\d+(\.\d+)*$/);

const isValidCode = (code: string) => coderegexp.test(code);

const createCodeShouldHaveDot = (count: number) => (code: string) => (code.match(/\./g) || []).length === count,
  isNotEmptyString = (value: string) => value !== "";

const isValidCodeNameObject = (object: Object, dot: number): boolean => {
  const codeShouldHaveDot = createCodeShouldHaveDot(dot);
  return isObject(object)
    ? Object.entries(object).every(
        ([code, name]) =>
          isString(code) &&
          isValidCode(code) &&
          isString(name) &&
          isNotEmptyString(code) &&
          isNotEmptyString(name) &&
          codeShouldHaveDot(code)
      )
    : false;
};

const expectValidCodeNameObject = (object: Object, dot: number) => {
  expect(isValidCodeNameObject(object, dot)).toBeTruthy();
};

describe("PROVINCE", () => {
  it("Valid", async () => {
    expectValidCodeNameObject(PROVINCE, 0);
  });
});

describe("DISTRICT", () => {
  it("Valid", async () => {
    expectValidCodeNameObject(DISTRICT, 1);
  });
});

describe("SUBDISTRICT", () => {
  it("Valid", async () => {
    expectValidCodeNameObject(SUBDISTRICT, 2);
  });
});

describe("VILLAGE", () => {
  it("Valid", async () => {
    expectValidCodeNameObject(VILLAGE, 3);
  });
});
