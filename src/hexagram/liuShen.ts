// 六神 (six gods) are assigned to lines 初→上 based on the day's heavenly stem:
//   甲乙→青龙起初爻, 丙丁→朱雀, 戊→勾陈, 己→螣蛇, 庚辛→白虎, 壬癸→玄武,
// then青龙→朱雀→勾陈→螣蛇→白虎→玄武 in order up the lines.

import { DAY_STEM_TO_FIRST_GOD, SIX_GODS_ORDER } from "../constants";
import type { LiuShen } from "../types";

/** Returns six gods indexed 0 = 初爻 … 5 = 上爻. */
export function liuShenForLines(dayStem: string): LiuShen[] {
  const first = DAY_STEM_TO_FIRST_GOD[dayStem];
  if (!first) {
    throw new Error(`Unknown day stem for six gods: ${dayStem}`);
  }
  const start = SIX_GODS_ORDER.indexOf(first);
  return Array.from({ length: 6 }, (_, i) => SIX_GODS_ORDER[(start + i) % 6]);
}
