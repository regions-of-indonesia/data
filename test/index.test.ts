import { describe, expect, it } from "vitest";

import { isRegion } from "@regions-of-indonesia/utils";

import { PROVINCE } from "../src/province";
import { DISTRICT } from "../src/district";
import { SUBDISTRICT } from "../src/subdistrict";
import { VILLAGE } from "../src/village";

const expectValidRecord = (record: Record<string, string>) => {
  for (const code in record) expect(isRegion({ code, name: record[code] })).toBeTruthy();
};

describe("Records", () => {
  it("PROVINCE", () => {
    expectValidRecord(PROVINCE);
  });

  it("DISTRICT", () => {
    expectValidRecord(DISTRICT);
  });

  it("SUBDISTRICT", () => {
    expectValidRecord(SUBDISTRICT);
  });

  it("VILLAGE", () => {
    expectValidRecord(VILLAGE);
  });
});
