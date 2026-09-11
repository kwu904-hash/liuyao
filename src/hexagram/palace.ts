// Generates all 64 hexagrams from the eight palace-head trigrams via the
// classic 世爻 flip sequence, and identifies a cast hexagram (palace, world,
// response, name, King Wen number) from its six lines.

import {
  KING_WEN,
  PALACE_HEXAGRAM_NAMES,
  PALACE_ORDER,
  PALACE_RANKS,
  TRIGRAM_BY_BINARY,
  TRIGRAMS,
} from "../constants";
import type {
  FiveElement,
  HexagramIdentity,
  TrigramKey,
  YinYang,
} from "../types";

type PalaceEntry = {
  name: string;
  palace: TrigramKey;
  palaceElement: FiveElement;
  palaceRank: number;
  worldLine: number;
  responseLine: number;
};

/** 应 is always three lines from 世 (wrapping within 1–6). */
function responseFor(worldLine: number): number {
  return ((worldLine - 1 + 3) % 6) + 1;
}

/** binary "l1l2l3l4l5l6" (bottom→top, 1=yang) → palace metadata. */
export const PALACE_BY_BINARY: Map<string, PalaceEntry> = (() => {
  const map = new Map<string, PalaceEntry>();
  for (const palace of PALACE_ORDER) {
    const head = TRIGRAMS[palace].lines;
    const pure: (0 | 1)[] = [head[0], head[1], head[2], head[0], head[1], head[2]];
    const names = PALACE_HEXAGRAM_NAMES[palace];
    PALACE_RANKS.forEach((rank, rankIndex) => {
      const lines = pure.slice();
      for (const pos of rank.flips) {
        lines[pos - 1] = lines[pos - 1] === 1 ? 0 : 1;
      }
      map.set(lines.join(""), {
        name: names[rankIndex],
        palace,
        palaceElement: TRIGRAMS[palace].element,
        palaceRank: rankIndex,
        worldLine: rank.worldLine,
        responseLine: responseFor(rank.worldLine),
      });
    });
  }
  return map;
})();

/** binary → King Wen number (independent second source). */
export const KING_WEN_BY_BINARY: Map<string, number> = (() => {
  const map = new Map<string, number>();
  KING_WEN.forEach(([upper, lower], i) => {
    const key = [...TRIGRAMS[lower].lines, ...TRIGRAMS[upper].lines].join("");
    map.set(key, i + 1);
  });
  return map;
})();

export function linesToBinary(yinYangs: YinYang[]): string {
  return yinYangs.map((yy) => (yy === "yang" ? "1" : "0")).join("");
}

export function identifyHexagram(yinYangs: YinYang[]): HexagramIdentity {
  if (yinYangs.length !== 6) {
    throw new Error("A hexagram needs exactly 6 lines.");
  }
  const binary = linesToBinary(yinYangs);
  const palaceEntry = PALACE_BY_BINARY.get(binary);
  const kingWen = KING_WEN_BY_BINARY.get(binary);
  if (!palaceEntry || kingWen === undefined) {
    throw new Error(`Unknown hexagram binary: ${binary}`);
  }
  const lowerTrigram = TRIGRAM_BY_BINARY[binary.slice(0, 3)];
  const upperTrigram = TRIGRAM_BY_BINARY[binary.slice(3, 6)];
  return {
    name: palaceEntry.name,
    kingWen,
    upperTrigram,
    lowerTrigram,
    palace: palaceEntry.palace,
    palaceElement: palaceEntry.palaceElement,
    palaceRank: palaceEntry.palaceRank,
    worldLine: palaceEntry.worldLine,
    responseLine: palaceEntry.responseLine,
  };
}
