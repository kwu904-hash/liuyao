// 伏神 — classical skeleton: missing 六亲 on primary → lookup on palace pure hex
// (八宫首卦), same line index, flying = cast surface / hidden = pure hex line.
// Product choice: list every pure-hex match when duplicated (not picking one).
// 六亲 from palace element × branch element. Primary only; emergence rules N/A.

import { relativeFor } from "../constants";
import type {
  FiveElement,
  FuShenEntry,
  FuShenSpirit,
  HexagramLine,
  LiuQin,
  TrigramKey,
} from "../types";
import { naJiaForHexagram } from "./naJia";

/** Entry before Sun/Moon relations are attached in build. */
export type FuShenEntryBase = Omit<FuShenEntry, "solarRelations">;

const ALL_LIU_QIN: LiuQin[] = [
  "parent",
  "sibling",
  "offspring",
  "wealth",
  "officer",
];

function toSpirit(
  stem: string,
  branch: string,
  branchElement: FiveElement,
  liuQin: LiuQin
): FuShenSpirit {
  return { stem, branch, branchElement, liuQin };
}

/** Pure palace hexagram lines with na-jia and 六亲 (bottom→top). */
function purePalaceLines(palace: TrigramKey, palaceElement: FiveElement) {
  const naJia = naJiaForHexagram(palace, palace);
  return naJia.map((line) => ({
    index: line.index,
    ...toSpirit(
      line.stem,
      line.branch,
      line.branchElement,
      relativeFor(palaceElement, line.branchElement)
    ),
  }));
}

/** All pure-hex lines carrying a given 六亲, bottom → top. */
function pureLinesForMissing(
  pureLines: ReturnType<typeof purePalaceLines>,
  missing: LiuQin
) {
  return pureLines
    .filter((line) => line.liuQin === missing)
    .sort((a, b) => a.index - b.index);
}

export function fuShenForPrimary(params: {
  palace: TrigramKey;
  palaceElement: FiveElement;
  lines: HexagramLine[];
}): FuShenEntryBase[] {
  const pureLines = purePalaceLines(params.palace, params.palaceElement);
  const present = new Set(params.lines.map((line) => line.liuQin));
  const missing = ALL_LIU_QIN.filter((qin) => !present.has(qin));

  const entries: FuShenEntryBase[] = [];
  for (const qin of missing) {
    for (const pureLine of pureLinesForMissing(pureLines, qin)) {
      const flyingLine = params.lines.find((line) => line.index === pureLine.index);
      if (!flyingLine) continue;
      entries.push({
        lineIndex: pureLine.index,
        flying: toSpirit(
          flyingLine.stem,
          flyingLine.branch,
          flyingLine.branchElement,
          flyingLine.liuQin
        ),
        hidden: toSpirit(
          pureLine.stem,
          pureLine.branch,
          pureLine.branchElement,
          qin
        ),
      });
    }
  }

  return entries.sort((a, b) => a.lineIndex - b.lineIndex);
}
