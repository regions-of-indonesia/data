import { describe, expect, it } from "vitest";

import { isRegion } from "@regions-of-indonesia/utils";

import PROVINCE from "./../dist/province";
import DISTRICT from "./../dist/district";
import SUBDISTRICT from "./../dist/subdistrict";
import VILLAGE from "./../dist/village";

import * as main from "./../main";

const expectValidRecord = (record: Record<string, string>) => {
  for (const code in record) expect(isRegion({ code, name: record[code] })).toBeTruthy();
};

describe("Records", () => {
  it("PROVINCE", () => {
    expectValidRecord(PROVINCE);
    expectValidRecord(main.PROVINCE);
  });

  it("DISTRICT", () => {
    expectValidRecord(DISTRICT);
    expectValidRecord(main.DISTRICT);
  });

  it("SUBDISTRICT", () => {
    expectValidRecord(SUBDISTRICT);
    expectValidRecord(main.SUBDISTRICT);
  });

  it("VILLAGE", () => {
    expectValidRecord(VILLAGE);
    expectValidRecord(main.VILLAGE);
  });
});
