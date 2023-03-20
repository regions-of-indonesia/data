import { describe, expect, it } from "vitest";

import { PROVINCE, DISTRICT, SUBDISTRICT, VILLAGE } from "../src";

const isNotNull = (value: unknown) => value != null,
  isObject = (value: unknown): value is object => typeof value === "object" && isNotNull(value),
  isString = (value: unknown): value is string => typeof value === "string" && isNotNull(value);

const createCodeShouldHaveDot = (count: number) => (code: string) => (code.match(/\./g) || []).length === count,
  isNotEmptyString = (value: string) => value != "";

const isValidCodeNameObject = (object: Object, options: { dot?: number } = {}): boolean => {
  const { dot = 0 } = options,
    codeShouldHaveDot = createCodeShouldHaveDot(dot);
  return isObject(object)
    ? Object.entries(object).every(
        ([code, name]) => isString(code) && isString(name) && isNotEmptyString(code) && isNotEmptyString(name) && codeShouldHaveDot(code)
      )
    : false;
};

describe("PROVINCE", () => {
  it("Valid", async () => {
    expect(isValidCodeNameObject(PROVINCE, { dot: 0 })).toBeTruthy();
  });
});

describe("DISTRICT", () => {
  it("Valid", async () => {
    expect(isValidCodeNameObject(DISTRICT, { dot: 1 })).toBeTruthy();
  });
});

describe("SUBDISTRICT", () => {
  it("Valid", async () => {
    expect(isValidCodeNameObject(SUBDISTRICT, { dot: 2 })).toBeTruthy();
  });
});

describe("VILLAGE", () => {
  it("Valid", async () => {
    expect(isValidCodeNameObject(VILLAGE, { dot: 3 })).toBeTruthy();
  });
});
