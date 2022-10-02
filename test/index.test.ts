import { describe, expect, it } from "vitest";

import { Provinces, Districts, Subdistricts, Villages } from "../src";

function expectObjectIsValidCodeName(object: object) {
  Object.entries(object).forEach(([key, value]) => {
    expect(key).toBeTypeOf("string");
    expect(value).toBeTypeOf("string");
    expect(key).not.toEqual("");
    expect(value).not.toEqual("");
  });
}

describe("Provinces", () => {
  it("Perfect", async () => {
    expectObjectIsValidCodeName(Provinces);
  });
});

describe("Districts", () => {
  it("Perfect", async () => {
    expectObjectIsValidCodeName(Districts);
  });
});

describe("Subdistricts", () => {
  it("Perfect", async () => {
    expectObjectIsValidCodeName(Subdistricts);
  });
});

describe("Villages", () => {
  it("Perfect", async () => {
    expectObjectIsValidCodeName(Villages);
  });
});
