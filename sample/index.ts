import type { CoinTriplet, LiuQin, LiuYaoCastInput, TrigramKey } from "../src/types";

const OLD_YANG: CoinTriplet = [1, 1, 1];
const YOUNG_YANG: CoinTriplet = [1, 0, 0];
const YOUNG_YIN: CoinTriplet = [1, 1, 0];
const OLD_YIN: CoinTriplet = [0, 0, 0];

type LineExpect = { stem: string; branch: string; liuQin: LiuQin };

export type LiuYaoGoldenCase = {
  id: string;
  reason: string;
  input: LiuYaoCastInput;
  expect: {
    primaryName: string;
    primaryKingWen: number;
    palace: TrigramKey;
    worldLine: number;
    responseLine: number;
    movingLineIndices: number[];
    changedName?: string;
    changedKingWen?: number;
    lines: LineExpect[];
    transforms?: { index: number; stem: string; branch: string; liuQin: LiuQin }[];
    fuShen?: {
      lineIndex: number;
      flyingLiuQin: LiuQin;
      hiddenLiuQin: LiuQin;
      hiddenStem: string;
      hiddenBranch: string;
    }[];
  };
};

const DATE = "2024-06-01";
const TIME = "10:00";

function input(throws: LiuYaoCastInput["throws"]): LiuYaoCastInput {
  return { divinationDate: DATE, divinationTime: TIME, throws };
}

export const LIU_YAO_GOLDEN_CASES: LiuYaoGoldenCase[] = [
  {
    id: "qian-pure-static",
    reason: "纯静卦：乾为天，世在上爻/应在三爻与乾宫纳甲六亲。",
    input: input([
      YOUNG_YANG, YOUNG_YANG, YOUNG_YANG, YOUNG_YANG, YOUNG_YANG, YOUNG_YANG,
    ]),
    expect: {
      primaryName: "乾为天",
      primaryKingWen: 1,
      palace: "qian",
      worldLine: 6,
      responseLine: 3,
      movingLineIndices: [],
      lines: [
        { stem: "甲", branch: "子", liuQin: "offspring" },
        { stem: "甲", branch: "寅", liuQin: "wealth" },
        { stem: "甲", branch: "辰", liuQin: "parent" },
        { stem: "壬", branch: "午", liuQin: "officer" },
        { stem: "壬", branch: "申", liuQin: "sibling" },
        { stem: "壬", branch: "戌", liuQin: "parent" },
      ],
    },
  },
  {
    id: "qian-line1-moving",
    reason: "单动爻：乾为天初爻老阳动，变 天风姤。",
    input: input([
      OLD_YANG, YOUNG_YANG, YOUNG_YANG, YOUNG_YANG, YOUNG_YANG, YOUNG_YANG,
    ]),
    expect: {
      primaryName: "乾为天",
      primaryKingWen: 1,
      palace: "qian",
      worldLine: 6,
      responseLine: 3,
      movingLineIndices: [1],
      changedName: "天风姤",
      changedKingWen: 44,
      lines: [
        { stem: "甲", branch: "子", liuQin: "offspring" },
        { stem: "甲", branch: "寅", liuQin: "wealth" },
        { stem: "甲", branch: "辰", liuQin: "parent" },
        { stem: "壬", branch: "午", liuQin: "officer" },
        { stem: "壬", branch: "申", liuQin: "sibling" },
        { stem: "壬", branch: "戌", liuQin: "parent" },
      ],
      transforms: [{ index: 1, stem: "辛", branch: "丑", liuQin: "parent" }],
    },
  },
  {
    id: "kun-lines-2-4-moving",
    reason: "多动爻：坤为地二、四爻老阴动，变 雷水解。",
    input: input([YOUNG_YIN, OLD_YIN, YOUNG_YIN, OLD_YIN, YOUNG_YIN, YOUNG_YIN]),
    expect: {
      primaryName: "坤为地",
      primaryKingWen: 2,
      palace: "kun",
      worldLine: 6,
      responseLine: 3,
      movingLineIndices: [2, 4],
      changedName: "雷水解",
      changedKingWen: 40,
      lines: [
        { stem: "乙", branch: "未", liuQin: "sibling" },
        { stem: "乙", branch: "巳", liuQin: "parent" },
        { stem: "乙", branch: "卯", liuQin: "officer" },
        { stem: "癸", branch: "丑", liuQin: "sibling" },
        { stem: "癸", branch: "亥", liuQin: "wealth" },
        { stem: "癸", branch: "酉", liuQin: "offspring" },
      ],
    },
  },
  {
    id: "qian-tianshan-dun-static",
    reason: "伏神：天山遁缺子孙、妻财；本宫纯卦寻伏于初、二爻。",
    input: input([
      YOUNG_YIN, YOUNG_YIN, YOUNG_YANG, YOUNG_YANG, YOUNG_YANG, YOUNG_YANG,
    ]),
    expect: {
      primaryName: "天山遁",
      primaryKingWen: 33,
      palace: "qian",
      worldLine: 2,
      responseLine: 5,
      movingLineIndices: [],
      lines: [
        { stem: "丙", branch: "辰", liuQin: "parent" },
        { stem: "丙", branch: "午", liuQin: "officer" },
        { stem: "丙", branch: "申", liuQin: "sibling" },
        { stem: "壬", branch: "午", liuQin: "officer" },
        { stem: "壬", branch: "申", liuQin: "sibling" },
        { stem: "壬", branch: "戌", liuQin: "parent" },
      ],
      fuShen: [
        {
          lineIndex: 1,
          flyingLiuQin: "parent",
          hiddenLiuQin: "offspring",
          hiddenStem: "甲",
          hiddenBranch: "子",
        },
        {
          lineIndex: 2,
          flyingLiuQin: "officer",
          hiddenLiuQin: "wealth",
          hiddenStem: "甲",
          hiddenBranch: "寅",
        },
      ],
    },
  },
  {
    id: "dahyou-guihun-static",
    reason: "归魂卦：火天大有，世在三爻/应在上爻。",
    input: input([
      YOUNG_YANG, YOUNG_YANG, YOUNG_YANG, YOUNG_YANG, YOUNG_YIN, YOUNG_YANG,
    ]),
    expect: {
      primaryName: "火天大有",
      primaryKingWen: 14,
      palace: "qian",
      worldLine: 3,
      responseLine: 6,
      movingLineIndices: [],
      lines: [
        { stem: "甲", branch: "子", liuQin: "offspring" },
        { stem: "甲", branch: "寅", liuQin: "wealth" },
        { stem: "甲", branch: "辰", liuQin: "parent" },
        { stem: "己", branch: "酉", liuQin: "sibling" },
        { stem: "己", branch: "未", liuQin: "parent" },
        { stem: "己", branch: "巳", liuQin: "officer" },
      ],
    },
  },
];

export const LIU_YAO_BOUNDARY_INPUT: Pick<LiuYaoCastInput, "throws"> = {
  throws: [YOUNG_YANG, YOUNG_YANG, YOUNG_YANG, YOUNG_YANG, YOUNG_YANG, YOUNG_YANG],
};
