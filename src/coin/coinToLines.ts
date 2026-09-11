// Coin faces → line values → yin/yang + moving flag. The only randomness comes
// from the user's physical coins; this module just applies the fixed 三钱法 map.

import { BACK_COUNT_TO_LINE_VALUE } from "../constants";
import type {
  CoinFace,
  CoinThrows,
  CoinTriplet,
  LineValue,
  YinYang,
} from "../types";

export type DerivedLine = {
  /** 1 = 初爻 (bottom) … 6 = 上爻 (top). */
  index: number;
  value: LineValue;
  yinYang: YinYang;
  isMoving: boolean;
};

function assertCoinFace(face: unknown, lineIndex: number, coinIndex: number): CoinFace {
  if (face !== 0 && face !== 1) {
    throw new Error(
      `throws[${lineIndex}][${coinIndex}] must be 1 (背) or 0 (字); got ${JSON.stringify(face)}. Six throws run 初爻 → 上爻.`
    );
  }
  return face;
}

function assertTriplet(triplet: unknown, lineIndex: number): CoinTriplet {
  if (!Array.isArray(triplet) || triplet.length !== 3) {
    throw new Error(
      `throws[${lineIndex}] must be 3 coin faces (1=背, 0=字), e.g. [1, 0, 0] for 少阳 7; got ${JSON.stringify(triplet)}.`
    );
  }
  return [
    assertCoinFace(triplet[0], lineIndex, 0),
    assertCoinFace(triplet[1], lineIndex, 1),
    assertCoinFace(triplet[2], lineIndex, 2),
  ];
}

/** Three coins → 6/7/8/9. Order of the three faces is irrelevant. */
export function coinTripletToLineValue(triplet: CoinTriplet): LineValue {
  const valid = assertTriplet(triplet, 0);
  const backs = valid.reduce<number>(
    (sum, face) => sum + (face === 1 ? 1 : 0),
    0
  );
  return BACK_COUNT_TO_LINE_VALUE[backs as 0 | 1 | 2 | 3];
}

/** 老阳(9)/少阳(7) → yang; 老阴(6)/少阴(8) → yin. 6 & 9 are moving. */
export function lineValueToYinYang(value: LineValue): YinYang {
  return value === 9 || value === 7 ? "yang" : "yin";
}

export function isMovingValue(value: LineValue): boolean {
  return value === 6 || value === 9;
}

/** Six throws (初→上) → derived lines with index, value, polarity, moving. */
export function coinThrowsToLines(throws: CoinThrows): DerivedLine[] {
  if (!Array.isArray(throws) || throws.length !== 6) {
    throw new Error(
      `throws must be 6 coin triplets ordered 初爻 → 上爻; each face is 1 (背) or 0 (字). Got ${Array.isArray(throws) ? `length ${throws.length}` : JSON.stringify(throws)}.`
    );
  }
  return throws.map((triplet, i) => {
    const value = coinTripletToLineValue(
      assertTriplet(triplet, i)
    );
    return {
      index: i + 1,
      value,
      yinYang: lineValueToYinYang(value),
      isMoving: isMovingValue(value),
    };
  });
}

/** Flip a moving line's polarity for the changed hexagram. */
export function flipYinYang(yinYang: YinYang): YinYang {
  return yinYang === "yang" ? "yin" : "yang";
}
