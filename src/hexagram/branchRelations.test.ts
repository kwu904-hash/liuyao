import { describe, expect, it } from "vitest";
import { BRANCH_CLASH_PAIRS, clashesWith } from "./branchRelations";

describe("clashesWith (六冲)", () => {
  it("matches each of the six pairs both ways", () => {
    for (const [a, b] of BRANCH_CLASH_PAIRS) {
      expect(clashesWith(a, b), `${a}–${b}`).toBe(true);
      expect(clashesWith(b, a), `${b}–${a}`).toBe(true);
    }
  });

  it("same branch does not clash", () => {
    expect(clashesWith("子", "子")).toBe(false);
    expect(clashesWith("午", "午")).toBe(false);
  });

  it("does not treat 六破 / 合 as 冲", () => {
    // 子酉 is a classical 破 pair, not 六冲
    expect(clashesWith("子", "酉")).toBe(false);
    expect(clashesWith("子", "丑")).toBe(false); // 合
    expect(clashesWith("寅", "亥")).toBe(false); // 合
  });

  it("empty / unknown → false", () => {
    expect(clashesWith("", "子")).toBe(false);
    expect(clashesWith("子", "")).toBe(false);
  });
});
