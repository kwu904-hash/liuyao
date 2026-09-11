// 进神 / 退神 — 《卜筮正宗·变出进退神论第十七》完整 8 进 8 退。
// 「化进 / 化退」即此表，不是五行生克。非地支或表外组合 → null。

import { BRANCHES } from "../constants";
import type { AdvanceRetreat } from "../types";

export type EarthlyBranch = (typeof BRANCHES)[number];

const BRANCH_SET = new Set<string>(BRANCHES);

export function isEarthlyBranch(value: string): value is EarthlyBranch {
  return BRANCH_SET.has(value);
}

/** Full classical table. Changing it requires changing tests. */
export const ADVANCE_RETREAT_PAIRS: readonly {
  from: EarthlyBranch;
  to: EarthlyBranch;
  mark: AdvanceRetreat;
}[] = [
  { from: "亥", to: "子", mark: "jin" },
  { from: "寅", to: "卯", mark: "jin" },
  { from: "巳", to: "午", mark: "jin" },
  { from: "申", to: "酉", mark: "jin" },
  { from: "丑", to: "辰", mark: "jin" },
  { from: "辰", to: "未", mark: "jin" },
  { from: "未", to: "戌", mark: "jin" },
  { from: "戌", to: "丑", mark: "jin" },
  { from: "子", to: "亥", mark: "tui" },
  { from: "卯", to: "寅", mark: "tui" },
  { from: "午", to: "巳", mark: "tui" },
  { from: "酉", to: "申", mark: "tui" },
  { from: "辰", to: "丑", mark: "tui" },
  { from: "未", to: "辰", mark: "tui" },
  { from: "戌", to: "未", mark: "tui" },
  { from: "丑", to: "戌", mark: "tui" },
];

const LOOKUP = new Map<string, AdvanceRetreat>(
  ADVANCE_RETREAT_PAIRS.map((pair) => [`${pair.from}→${pair.to}`, pair.mark])
);

/**
 * Pairs that actually occur under this engine's 纳甲 when a line moves.
 * Locked by `verify:liuyao` (4096 coin-value sweeps). The other eight
 * classical pairs stay in the table but are unreachable here.
 */
export const NA_JIA_REACHABLE_ADVANCE_RETREAT: ReadonlySet<string> = new Set([
  "寅→卯",
  "申→酉",
  "丑→辰",
  "未→戌",
  "卯→寅",
  "酉→申",
  "辰→丑",
  "戌→未",
]);

export function advanceRetreatKey(fromBranch: string, toBranch: string): string {
  return `${fromBranch}→${toBranch}`;
}

export function advanceRetreatOf(
  fromBranch: string,
  toBranch: string
): AdvanceRetreat | null {
  if (!isEarthlyBranch(fromBranch) || !isEarthlyBranch(toBranch)) return null;
  return LOOKUP.get(advanceRetreatKey(fromBranch, toBranch)) ?? null;
}
