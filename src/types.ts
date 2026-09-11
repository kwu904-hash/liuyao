// Language-free Liu Yao calculation types.

export type YinYang = "yang" | "yin";

/**
 * A single coin face under the traditional 字背 convention:
 * 1 = 背面（无字/花徽）, 0 = 字面（有字）.
 */
export type CoinFace = 0 | 1;

/** One throw = three coins. Only the count of back faces matters. */
export type CoinTriplet = [CoinFace, CoinFace, CoinFace];

/** Six throws, ordered 初爻 (index 0) → 上爻 (index 5). */
export type CoinThrows = [
  CoinTriplet,
  CoinTriplet,
  CoinTriplet,
  CoinTriplet,
  CoinTriplet,
  CoinTriplet,
];

/** Traditional line value: 6 老阴, 7 少阳, 8 少阴, 9 老阳. 6/9 are moving. */
export type LineValue = 6 | 7 | 8 | 9;

export type TrigramKey =
  | "qian"
  | "dui"
  | "li"
  | "zhen"
  | "xun"
  | "kan"
  | "gen"
  | "kun";

export type FiveElement = "wood" | "fire" | "earth" | "metal" | "water";

/** 六亲: 父母 / 兄弟 / 子孙 / 妻财 / 官鬼. */
export type LiuQin = "parent" | "sibling" | "offspring" | "wealth" | "officer";

/** 六神: 青龙 / 朱雀 / 勾陈 / 螣蛇 / 白虎 / 玄武. */
export type LiuShen =
  | "qinglong"
  | "zhuque"
  | "gouchen"
  | "tengshe"
  | "baihu"
  | "xuanwu";

/** 进神 / 退神 — classical branch pair only, not generation/overcoming. */
export type AdvanceRetreat = "jin" | "tui";

/** Where a moving line transforms to in the changed hexagram. */
export type LineTransform = {
  yinYang: YinYang;
  stem: string;
  branch: string;
  branchElement: FiveElement;
  /** 六亲 of the changed line — measured against the ORIGINAL palace element. */
  liuQin: LiuQin;
  isVoid: boolean;
  isDayClash: boolean;
  isMonthClash: boolean;
  advanceRetreat: AdvanceRetreat | null;
};

/** 伏神 / 飞神 on one line position (hidden under the flying line). */
export type FuShenSpirit = {
  stem: string;
  branch: string;
  branchElement: FiveElement;
  liuQin: LiuQin;
};

/** Mechanical 飞伏·日月结构关系 ids (not “出伏条件”). */
export type FuShenSolarRelationId =
  | "hidden_day_clash"
  | "hidden_month_clash"
  | "hidden_day_match"
  | "hidden_month_match"
  | "flying_day_clash"
  | "flying_month_clash";

export type FuShenEntry = {
  /** 1-based line index where the hidden spirit伏于 the flying line. */
  lineIndex: number;
  flying: FuShenSpirit;
  hidden: FuShenSpirit;
  /** Matched Sun/Moon structure relations for this flying/hidden pair. */
  solarRelations: {
    matched: FuShenSolarRelationId[];
  };
};

export type HexagramLine = {
  /** 1 = 初爻 (bottom) … 6 = 上爻 (top). */
  index: number;
  yinYang: YinYang;
  value: LineValue;
  isMoving: boolean;
  stem: string;
  branch: string;
  branchElement: FiveElement;
  liuQin: LiuQin;
  liuShen: LiuShen;
  isShi: boolean;
  isYing: boolean;
  /** 旬空: branch falls in the day's void pair. */
  isVoid: boolean;
  /** 日冲: line branch clashes with day branch. */
  isDayClash: boolean;
  /** 月冲: line branch clashes with month command branch. */
  isMonthClash: boolean;
  transformedTo?: LineTransform;
};

export type HexagramIdentity = {
  name: string;
  kingWen: number;
  upperTrigram: TrigramKey;
  lowerTrigram: TrigramKey;
  palace: TrigramKey;
  palaceElement: FiveElement;
  /** 0 本宫, 1–5 一至五世, 6 游魂, 7 归魂. */
  palaceRank: number;
  worldLine: number;
  responseLine: number;
};

export type LiuYaoCalendar = {
  /** 起卦当日日柱干支, e.g. 甲子. */
  dayGanZhi: string;
  dayStem: string;
  dayBranch: string;
  /** 月建 — 节令月支 only (地支), e.g. 寅. */
  monthBranch: string;
  /** 旬空 (day void) pair, e.g. ["戌", "亥"]. */
  voidBranches: [string, string];
};

/** Calculation input: coin faces + wall-clock cast moment. */
export type LiuYaoCastInput = {
  throws: CoinThrows;
  divinationDate: string; // YYYY-MM-DD
  divinationTime: string; // HH:mm
};

export type LiuYaoChartData = {
  meta: {
    engine: string;
    method: string;
    divinationLocalDate: string;
    divinationLocalTime: string;
    daySect: 1;
    capabilities: {
      fuShen: true;
      lineClashMarks: true;
      fuShenSolarRelations: true;
      huaLineMarks: true;
      advanceRetreat: true;
    };
  };
  primary: {
    identity: HexagramIdentity;
    lines: HexagramLine[];
    fuShen: FuShenEntry[];
  };
  changed: {
    identity: HexagramIdentity;
    lines: HexagramLine[];
  } | null;
  movingLineIndices: number[];
  calendar: LiuYaoCalendar;
};
