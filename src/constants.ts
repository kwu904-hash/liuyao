// Traditional reference tables for Liu Yao (京房纳甲) — the single source of
// truth for coin mapping, trigrams, na-jia (纳甲) stems/branches, the eight
// palaces, five-element relations, and the six gods.
//
// Design note on correctness: the 64 hexagrams are NOT hand-typed as a flat
// table. They are generated from the 8 palace-head trigrams via the classic
// 世爻 flip sequence (see hexagram/palace.ts). The King Wen table below is an
// INDEPENDENT second source; `npm run verify` cross-checks that both agree on the
// binary → hexagram mapping, so a typo in either surfaces immediately.

import type { FiveElement, LineValue, LiuQin, LiuShen, TrigramKey } from "./types";

/** 十天干. */
export const STEMS = [
  "甲",
  "乙",
  "丙",
  "丁",
  "戊",
  "己",
  "庚",
  "辛",
  "壬",
  "癸",
] as const;

/** 十二地支. */
export const BRANCHES = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
] as const;

/** 地支五行. */
export const BRANCH_ELEMENT: Record<string, FiveElement> = {
  子: "water",
  丑: "earth",
  寅: "wood",
  卯: "wood",
  辰: "earth",
  巳: "fire",
  午: "fire",
  未: "earth",
  申: "metal",
  酉: "metal",
  戌: "earth",
  亥: "water",
};

/**
 * Coin throw → line value under the traditional 字背 convention. Only the
 * count of back faces (1s) matters: 3→老阳(9), 2→少阴(8),
 * 1→少阳(7), 0（三字）→老阴(6).
 */
export const BACK_COUNT_TO_LINE_VALUE: Record<0 | 1 | 2 | 3, LineValue> = {
  3: 9,
  2: 8,
  1: 7,
  0: 6,
};

export type TrigramDef = {
  key: TrigramKey;
  /** 卦名 e.g. 乾. */
  name: string;
  /** 八卦所象 e.g. 天. */
  nature: string;
  /** Lines bottom→top, 1 = yang, 0 = yin. */
  lines: [0 | 1, 0 | 1, 0 | 1];
  element: FiveElement;
  /** 纳甲天干: stem when this trigram is the inner (lower) / outer (upper). */
  innerStem: string;
  outerStem: string;
  /** 纳支: branches for lines 1,2,3 when inner; lines 4,5,6 when outer. */
  innerBranches: [string, string, string];
  outerBranches: [string, string, string];
};

/**
 * Na-jia stems and branches follow the standard 京房纳甲:
 *   乾纳甲壬, 坤纳乙癸, 艮纳丙, 兑纳丁, 坎纳戊, 离纳己, 震纳庚, 巽纳辛.
 * Yang trigrams (乾坎艮震) step branches forward by 2; yin trigrams
 * (坤巽离兑) step backward by 2. Inner = lower trigram, outer = upper.
 */
export const TRIGRAMS: Record<TrigramKey, TrigramDef> = {
  qian: {
    key: "qian",
    name: "乾",
    nature: "天",
    lines: [1, 1, 1],
    element: "metal",
    innerStem: "甲",
    outerStem: "壬",
    innerBranches: ["子", "寅", "辰"],
    outerBranches: ["午", "申", "戌"],
  },
  dui: {
    key: "dui",
    name: "兑",
    nature: "泽",
    lines: [1, 1, 0],
    element: "metal",
    innerStem: "丁",
    outerStem: "丁",
    innerBranches: ["巳", "卯", "丑"],
    outerBranches: ["亥", "酉", "未"],
  },
  li: {
    key: "li",
    name: "离",
    nature: "火",
    lines: [1, 0, 1],
    element: "fire",
    innerStem: "己",
    outerStem: "己",
    innerBranches: ["卯", "丑", "亥"],
    outerBranches: ["酉", "未", "巳"],
  },
  zhen: {
    key: "zhen",
    name: "震",
    nature: "雷",
    lines: [1, 0, 0],
    element: "wood",
    innerStem: "庚",
    outerStem: "庚",
    innerBranches: ["子", "寅", "辰"],
    outerBranches: ["午", "申", "戌"],
  },
  xun: {
    key: "xun",
    name: "巽",
    nature: "风",
    lines: [0, 1, 1],
    element: "wood",
    innerStem: "辛",
    outerStem: "辛",
    innerBranches: ["丑", "亥", "酉"],
    outerBranches: ["未", "巳", "卯"],
  },
  kan: {
    key: "kan",
    name: "坎",
    nature: "水",
    lines: [0, 1, 0],
    element: "water",
    innerStem: "戊",
    outerStem: "戊",
    innerBranches: ["寅", "辰", "午"],
    outerBranches: ["申", "戌", "子"],
  },
  gen: {
    key: "gen",
    name: "艮",
    nature: "山",
    lines: [0, 0, 1],
    element: "earth",
    innerStem: "丙",
    outerStem: "丙",
    innerBranches: ["辰", "午", "申"],
    outerBranches: ["戌", "子", "寅"],
  },
  kun: {
    key: "kun",
    name: "坤",
    nature: "地",
    lines: [0, 0, 0],
    element: "earth",
    innerStem: "乙",
    outerStem: "癸",
    innerBranches: ["未", "巳", "卯"],
    outerBranches: ["丑", "亥", "酉"],
  },
};

/** Trigram lookup keyed by binary string "l1l2l3" (bottom→top). */
export const TRIGRAM_BY_BINARY: Record<string, TrigramKey> = Object.fromEntries(
  (Object.keys(TRIGRAMS) as TrigramKey[]).map((key) => [
    TRIGRAMS[key].lines.join(""),
    key,
  ])
);

/**
 * The eight palaces (八宫), each headed by a doubled trigram. Within a palace
 * the 8 hexagram NAMES are listed in the canonical rank order
 * [本宫, 一世, 二世, 三世, 四世, 五世, 游魂, 归魂]. The binary for each rank is
 * generated in hexagram/palace.ts; these names are matched to it by position.
 */
export const PALACE_ORDER: TrigramKey[] = [
  "qian",
  "dui",
  "li",
  "zhen",
  "xun",
  "kan",
  "gen",
  "kun",
];

export const PALACE_HEXAGRAM_NAMES: Record<TrigramKey, string[]> = {
  qian: ["乾为天", "天风姤", "天山遁", "天地否", "风地观", "山地剥", "火地晋", "火天大有"],
  dui: ["兑为泽", "泽水困", "泽地萃", "泽山咸", "水山蹇", "地山谦", "雷山小过", "雷泽归妹"],
  li: ["离为火", "火山旅", "火风鼎", "火水未济", "山水蒙", "风水涣", "天水讼", "天火同人"],
  zhen: ["震为雷", "雷地豫", "雷水解", "雷风恒", "地风升", "水风井", "泽风大过", "泽雷随"],
  xun: ["巽为风", "风天小畜", "风火家人", "风雷益", "天雷无妄", "火雷噬嗑", "山雷颐", "山风蛊"],
  kan: ["坎为水", "水泽节", "水雷屯", "水火既济", "泽火革", "雷火丰", "地火明夷", "地水师"],
  gen: ["艮为山", "山火贲", "山天大畜", "山泽损", "火泽睽", "天泽履", "风泽中孚", "风山渐"],
  kun: ["坤为地", "地雷复", "地泽临", "地天泰", "雷天大壮", "泽天夬", "水天需", "水地比"],
};

/**
 * 世爻 flip sequence, from the pure (doubled-trigram) hexagram. Each entry is
 * the set of 1-based line positions flipped relative to the pure hexagram, plus
 * the resulting 世 line. 应 is always 世 ± 3.
 */
export const PALACE_RANKS: { flips: number[]; worldLine: number }[] = [
  { flips: [], worldLine: 6 }, // 本宫
  { flips: [1], worldLine: 1 }, // 一世
  { flips: [1, 2], worldLine: 2 }, // 二世
  { flips: [1, 2, 3], worldLine: 3 }, // 三世
  { flips: [1, 2, 3, 4], worldLine: 4 }, // 四世
  { flips: [1, 2, 3, 4, 5], worldLine: 5 }, // 五世
  { flips: [1, 2, 3, 5], worldLine: 4 }, // 游魂 (五世再变四爻)
  { flips: [5], worldLine: 3 }, // 归魂 (游魂下卦复位)
];

/**
 * King Wen sequence 1–64 as [upperTrigram, lowerTrigram]. INDEPENDENT second
 * source used only for the King Wen number and cross-checking; hexagram names
 * come from the palace generation. `npm run verify` asserts both cover the same
 * 64 unique binaries.
 */
export const KING_WEN: [TrigramKey, TrigramKey][] = [
  ["qian", "qian"], // 1 乾
  ["kun", "kun"], // 2 坤
  ["kan", "zhen"], // 3 屯
  ["gen", "kan"], // 4 蒙
  ["kan", "qian"], // 5 需
  ["qian", "kan"], // 6 讼
  ["kun", "kan"], // 7 师
  ["kan", "kun"], // 8 比
  ["xun", "qian"], // 9 小畜
  ["qian", "dui"], // 10 履
  ["kun", "qian"], // 11 泰
  ["qian", "kun"], // 12 否
  ["qian", "li"], // 13 同人
  ["li", "qian"], // 14 大有
  ["kun", "gen"], // 15 谦
  ["zhen", "kun"], // 16 豫
  ["dui", "zhen"], // 17 随
  ["gen", "xun"], // 18 蛊
  ["kun", "dui"], // 19 临
  ["xun", "kun"], // 20 观
  ["li", "zhen"], // 21 噬嗑
  ["gen", "li"], // 22 贲
  ["gen", "kun"], // 23 剥
  ["kun", "zhen"], // 24 复
  ["qian", "zhen"], // 25 无妄
  ["gen", "qian"], // 26 大畜
  ["gen", "zhen"], // 27 颐
  ["dui", "xun"], // 28 大过
  ["kan", "kan"], // 29 坎
  ["li", "li"], // 30 离
  ["dui", "gen"], // 31 咸
  ["zhen", "xun"], // 32 恒
  ["qian", "gen"], // 33 遁
  ["zhen", "qian"], // 34 大壮
  ["li", "kun"], // 35 晋
  ["kun", "li"], // 36 明夷
  ["xun", "li"], // 37 家人
  ["li", "dui"], // 38 睽
  ["kan", "gen"], // 39 蹇
  ["zhen", "kan"], // 40 解
  ["gen", "dui"], // 41 损
  ["xun", "zhen"], // 42 益
  ["dui", "qian"], // 43 夬
  ["qian", "xun"], // 44 姤
  ["dui", "kun"], // 45 萃
  ["kun", "xun"], // 46 升
  ["dui", "kan"], // 47 困
  ["kan", "xun"], // 48 井
  ["dui", "li"], // 49 革
  ["li", "xun"], // 50 鼎
  ["zhen", "zhen"], // 51 震
  ["gen", "gen"], // 52 艮
  ["xun", "gen"], // 53 渐
  ["zhen", "dui"], // 54 归妹
  ["zhen", "li"], // 55 丰
  ["li", "gen"], // 56 旅
  ["xun", "xun"], // 57 巽
  ["dui", "dui"], // 58 兑
  ["xun", "kan"], // 59 涣
  ["kan", "dui"], // 60 节
  ["xun", "dui"], // 61 中孚
  ["zhen", "gen"], // 62 小过
  ["kan", "li"], // 63 既济
  ["li", "kan"], // 64 未济
];

/** 天干 → 六神起爻 index into SIX_GODS_ORDER (assigned to 初爻, then upward). */
export const DAY_STEM_TO_FIRST_GOD: Record<string, LiuShen> = {
  甲: "qinglong",
  乙: "qinglong",
  丙: "zhuque",
  丁: "zhuque",
  戊: "gouchen",
  己: "tengshe",
  庚: "baihu",
  辛: "baihu",
  壬: "xuanwu",
  癸: "xuanwu",
};

export const SIX_GODS_ORDER: LiuShen[] = [
  "qinglong",
  "zhuque",
  "gouchen",
  "tengshe",
  "baihu",
  "xuanwu",
];

/** 五行相生: element → the element it generates (我生). */
export const GENERATES: Record<FiveElement, FiveElement> = {
  wood: "fire",
  fire: "earth",
  earth: "metal",
  metal: "water",
  water: "wood",
};

/** 五行相克: element → the element it controls (我克). */
export const CONTROLS: Record<FiveElement, FiveElement> = {
  wood: "earth",
  earth: "water",
  water: "fire",
  fire: "metal",
  metal: "wood",
};

/**
 * 六亲 from the palace ("self") element and a line's branch element:
 *   同我 兄弟 · 我生 子孙 · 生我 父母 · 我克 妻财 · 克我 官鬼.
 */
export function relativeFor(self: FiveElement, branch: FiveElement): LiuQin {
  if (branch === self) return "sibling";
  if (GENERATES[self] === branch) return "offspring";
  if (GENERATES[branch] === self) return "parent";
  if (CONTROLS[self] === branch) return "wealth";
  return "officer"; // CONTROLS[branch] === self
}

export const LIU_YAO_ENGINE_ID = "astralium-liuyao-jingfang-v1";
export const LIU_YAO_METHOD = "京房纳甲 · 三钱法";
