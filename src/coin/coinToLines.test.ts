import { describe, expect, it } from "vitest";
import { coinThrowsToLines, coinTripletToLineValue } from "./coinToLines";
import type { CoinThrows } from "../types";

describe("coinThrowsToLines input errors", () => {
  it("requires six triplets 初→上", () => {
    expect(() =>
      coinThrowsToLines([[1, 0, 0]] as unknown as CoinThrows)
    ).toThrow(/6 coin triplets.*初爻 → 上爻/);
  });

  it("rejects faces other than 1/0", () => {
    expect(() =>
      coinThrowsToLines([
        [2, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
        [1, 0, 0],
      ] as unknown as CoinThrows)
    ).toThrow(/1 \(背\) or 0 \(字\).*2/);
  });
});

describe("coinTripletToLineValue 字背 map", () => {
  it("maps 一背→7 二背→8 (not majority vote)", () => {
    expect(coinTripletToLineValue([1, 0, 0])).toBe(7);
    expect(coinTripletToLineValue([1, 1, 0])).toBe(8);
    expect(coinTripletToLineValue([1, 1, 1])).toBe(9);
    expect(coinTripletToLineValue([0, 0, 0])).toBe(6);
  });
});
