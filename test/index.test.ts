import { describe, expect, it } from "vitest";

import { isRegion } from "@regions-of-indonesia/utils";

import { PROVINCE, DISTRICT, SUBDISTRICT, VILLAGE } from "../src";

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
