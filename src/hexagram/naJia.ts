// 纳甲: assign heavenly stem + earthly branch to each of the six lines. Lines
// 1–3 take the lower (inner) trigram's stem/branches; lines 4–6 take the upper
// (outer) trigram's. This is fixed by the trigram, independent of the day.

import { BRANCH_ELEMENT, TRIGRAMS } from "../constants";
import type { FiveElement, TrigramKey } from "../types";

export type NaJiaLine = {
  index: number;
  stem: string;
  branch: string;
  branchElement: FiveElement;
};

export function naJiaForHexagram(
  lowerTrigram: TrigramKey,
  upperTrigram: TrigramKey
): NaJiaLine[] {
  const lower = TRIGRAMS[lowerTrigram];
  const upper = TRIGRAMS[upperTrigram];
  const lines: NaJiaLine[] = [];
  for (let i = 0; i < 3; i += 1) {
    const branch = lower.innerBranches[i];
    lines.push({
      index: i + 1,
      stem: lower.innerStem,
      branch,
      branchElement: BRANCH_ELEMENT[branch],
    });
  }
  for (let i = 0; i < 3; i += 1) {
    const branch = upper.outerBranches[i];
    lines.push({
      index: i + 4,
      stem: upper.outerStem,
      branch,
      branchElement: BRANCH_ELEMENT[branch],
    });
  }
  return lines;
}
