import { describe, expect, it } from "vitest";
import { BRANCHES } from "../constants";
import {
  ADVANCE_RETREAT_PAIRS,
  advanceRetreatKey,
  advanceRetreatOf,
} from "./advanceRetreat";

describe("advanceRetreatOf", () => {
  it("marks exactly the 16 classical pairs", () => {
    expect(ADVANCE_RETREAT_PAIRS).toHaveLength(16);
    const hits: string[] = [];
    for (const from of BRANCHES) {
      for (const to of BRANCHES) {
        const mark = advanceRetreatOf(from, to);
        if (mark !== null) hits.push(`${advanceRetreatKey(from, to)}:${mark}`);
      }
    }
    expect(hits).toHaveLength(16);
    expect(new Set(hits).size).toBe(16);
    for (const pair of ADVANCE_RETREAT_PAIRS) {
      expect(
        advanceRetreatOf(pair.from, pair.to),
        `${pair.from}→${pair.to}`
      ).toBe(pair.mark);
    }
  });

  it("returns null for same branch, adjacent cross-element, and unknown input", () => {
    expect(advanceRetreatOf("子", "子")).toBeNull();
    expect(advanceRetreatOf("子", "丑")).toBeNull();
    expect(advanceRetreatOf("亥", "戌")).toBeNull();
    expect(advanceRetreatOf("寅", "辰")).toBeNull();
    expect(advanceRetreatOf("", "子")).toBeNull();
    expect(advanceRetreatOf("子", "甲")).toBeNull();
    expect(advanceRetreatOf("亥 ", "子")).toBeNull();
  });
});
