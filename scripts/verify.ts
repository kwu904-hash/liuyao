// Engine regression: coin map, 64-hex cross-check, goldens, calendar, 4096 sweep.

import { buildLiuyaoChart } from "../src/build/buildLiuyaoChart";
import { coinTripletToLineValue } from "../src/coin/coinToLines";
import { clashesWith } from "../src/hexagram/branchRelations";
import {
  ADVANCE_RETREAT_PAIRS,
  advanceRetreatKey,
  advanceRetreatOf,
  NA_JIA_REACHABLE_ADVANCE_RETREAT,
} from "../src/hexagram/advanceRetreat";
import { fuShenForPrimary } from "../src/hexagram/fuShen";
import { BRANCHES, STEMS } from "../src/constants";
import {
  KING_WEN_BY_BINARY,
  PALACE_BY_BINARY,
  identifyHexagram,
} from "../src/hexagram/palace";
import type { CoinThrows, CoinTriplet, YinYang } from "../src/types";
import { LIU_YAO_BOUNDARY_INPUT, LIU_YAO_GOLDEN_CASES } from "../sample/index";

let failures = 0;

function check(label: string, condition: boolean): void {
  if (!condition) {
    console.error(`FAIL: ${label}`);
    failures += 1;
  }
}

function assertEqual<T>(label: string, actual: T, expected: T): void {
  check(
    `${label} (expected ${String(expected)}, got ${String(actual)})`,
    actual === expected
  );
}

const DAN: CoinTriplet = [1, 0, 0];
const CHAI: CoinTriplet = [1, 1, 0];
const ZHONG: CoinTriplet = [1, 1, 1];
const JIAO: CoinTriplet = [0, 0, 0];

for (const coinCase of [
  { label: "一背为单（少阳）", triplet: DAN, value: 7 },
  { label: "二背为拆（少阴）", triplet: CHAI, value: 8 },
  { label: "三背为重（老阳）", triplet: ZHONG, value: 9 },
  { label: "三字为交（老阴）", triplet: JIAO, value: 6 },
] as const) {
  assertEqual(
    `engine coin map: ${coinCase.label}`,
    coinTripletToLineValue([...coinCase.triplet] as CoinTriplet),
    coinCase.value
  );
}

for (const permutation of [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
] as CoinTriplet[]) {
  assertEqual(
    `一背 order-independent [${permutation.join("")}]`,
    coinTripletToLineValue(permutation),
    7
  );
}

const CLASSICAL_CASTS = [
  {
    label: "卜筮正宗 · 单单单曰干",
    throws: [DAN, DAN, DAN, DAN, DAN, DAN],
    primaryName: "乾为天",
    primaryKingWen: 1,
    movingLineIndices: [] as number[],
    changedName: null as string | null,
  },
  {
    label: "卜筮正宗 · 拆拆拆曰坤",
    throws: [CHAI, CHAI, CHAI, CHAI, CHAI, CHAI],
    primaryName: "坤为地",
    primaryKingWen: 2,
    movingLineIndices: [],
    changedName: null,
  },
  {
    label: "卜筮正宗 · 单拆单曰离",
    throws: [DAN, CHAI, DAN, DAN, CHAI, DAN],
    primaryName: "离为火",
    primaryKingWen: 30,
    movingLineIndices: [],
    changedName: null,
  },
  {
    label: "卜筮正宗 · 拆单拆曰坎",
    throws: [CHAI, DAN, CHAI, CHAI, DAN, CHAI],
    primaryName: "坎为水",
    primaryKingWen: 29,
    movingLineIndices: [],
    changedName: null,
  },
  {
    label: "增删卜易 例一 · 水火既济",
    throws: [DAN, CHAI, ZHONG, JIAO, ZHONG, CHAI],
    primaryName: "水火既济",
    primaryKingWen: 63,
    movingLineIndices: [3, 4, 5],
    changedName: "震为雷",
  },
  {
    label: "增删卜易 例二 · 火水未济",
    throws: [CHAI, ZHONG, CHAI, DAN, JIAO, DAN],
    primaryName: "火水未济",
    primaryKingWen: 64,
    movingLineIndices: [2, 5],
    changedName: "天地否",
  },
];

for (const cast of CLASSICAL_CASTS) {
  const chart = buildLiuyaoChart({
    divinationDate: "2024-06-01",
    divinationTime: "10:00",
    throws: cast.throws as CoinThrows,
  });
  assertEqual(`${cast.label}: name`, chart.primary.identity.name, cast.primaryName);
  assertEqual(`${cast.label}: kingWen`, chart.primary.identity.kingWen, cast.primaryKingWen);
  assertEqual(
    `${cast.label}: moving`,
    chart.movingLineIndices.join(","),
    cast.movingLineIndices.join(",")
  );
  assertEqual(
    `${cast.label}: changed`,
    chart.changed?.identity.name ?? null,
    cast.changedName
  );
}

let palaceCount = 0;
let kingWenCount = 0;
const palaceNames = new Set<string>();
const kingWenNumbers = new Set<number>();

for (let n = 0; n < 64; n += 1) {
  const yinYangs: YinYang[] = Array.from({ length: 6 }, (_, i) =>
    (n >> i) & 1 ? "yang" : "yin"
  );
  const binary = yinYangs.map((yy) => (yy === "yang" ? "1" : "0")).join("");
  const palace = PALACE_BY_BINARY.get(binary);
  const kingWen = KING_WEN_BY_BINARY.get(binary);
  check(`palace has ${binary}`, palace !== undefined);
  check(`King Wen has ${binary}`, kingWen !== undefined);
  if (palace) {
    palaceCount += 1;
    palaceNames.add(palace.name);
  }
  if (kingWen !== undefined) {
    kingWenCount += 1;
    kingWenNumbers.add(kingWen);
  }
  if (palace && kingWen !== undefined) {
    const id = identifyHexagram(yinYangs);
    assertEqual(`name for ${binary}`, id.name, palace.name);
    assertEqual(`kingWen for ${binary}`, id.kingWen, kingWen);
  }
}

assertEqual("palace covers 64", palaceCount, 64);
assertEqual("King Wen covers 64", kingWenCount, 64);
assertEqual("64 unique names", palaceNames.size, 64);
assertEqual("64 unique King Wen numbers", kingWenNumbers.size, 64);

for (const gc of LIU_YAO_GOLDEN_CASES) {
  const chart = buildLiuyaoChart(gc.input);
  const p = chart.primary.identity;
  assertEqual(`${gc.id}: name`, p.name, gc.expect.primaryName);
  assertEqual(`${gc.id}: kingWen`, p.kingWen, gc.expect.primaryKingWen);
  assertEqual(`${gc.id}: palace`, p.palace, gc.expect.palace);
  assertEqual(`${gc.id}: world`, p.worldLine, gc.expect.worldLine);
  assertEqual(`${gc.id}: response`, p.responseLine, gc.expect.responseLine);
  assertEqual(
    `${gc.id}: moving`,
    chart.movingLineIndices.join(","),
    gc.expect.movingLineIndices.join(",")
  );
  gc.expect.lines.forEach((line, i) => {
    const actual = chart.primary.lines[i];
    assertEqual(`${gc.id}: L${i + 1} stem`, actual.stem, line.stem);
    assertEqual(`${gc.id}: L${i + 1} branch`, actual.branch, line.branch);
    assertEqual(`${gc.id}: L${i + 1} liuQin`, actual.liuQin, line.liuQin);
  });
  if (gc.expect.changedName) {
    assertEqual(`${gc.id}: changed`, chart.changed?.identity.name, gc.expect.changedName);
  } else {
    assertEqual(`${gc.id}: no changed`, chart.changed, null);
  }
  for (const t of gc.expect.transforms ?? []) {
    const line = chart.primary.lines[t.index - 1];
    assertEqual(`${gc.id}: L${t.index} → stem`, line.transformedTo?.stem, t.stem);
    assertEqual(`${gc.id}: L${t.index} → branch`, line.transformedTo?.branch, t.branch);
    assertEqual(`${gc.id}: L${t.index} → liuQin`, line.transformedTo?.liuQin, t.liuQin);
  }
  if (gc.expect.fuShen) {
    assertEqual(`${gc.id}: fuShen count`, chart.primary.fuShen.length, gc.expect.fuShen.length);
    for (const exp of gc.expect.fuShen) {
      const actual = chart.primary.fuShen.find((f) => f.lineIndex === exp.lineIndex);
      assertEqual(`${gc.id}: fuShen L${exp.lineIndex} hidden`, actual?.hidden.liuQin, exp.hiddenLiuQin);
    }
  } else {
    assertEqual(`${gc.id}: no fuShen`, chart.primary.fuShen.length, 0);
  }
}

function recomputeVoid(dayStem: string, dayBranch: string): [string, string] {
  const s = STEMS.indexOf(dayStem as (typeof STEMS)[number]);
  const b = BRANCHES.indexOf(dayBranch as (typeof BRANCHES)[number]);
  const xunShou = (((b - s) % 12) + 12) % 12;
  return [BRANCHES[(xunShou + 10) % 12], BRANCHES[(xunShou + 11) % 12]];
}

for (const gc of LIU_YAO_GOLDEN_CASES) {
  const chart = buildLiuyaoChart(gc.input);
  const expectedVoid = recomputeVoid(chart.calendar.dayStem, chart.calendar.dayBranch);
  assertEqual(
    `${gc.id}: void`,
    chart.calendar.voidBranches.join(""),
    expectedVoid.join("")
  );
  for (const line of chart.primary.lines) {
    assertEqual(
      `${gc.id}: L${line.index} void flag`,
      line.isVoid,
      chart.calendar.voidBranches.includes(line.branch)
    );
    assertEqual(
      `${gc.id}: L${line.index} day clash`,
      line.isDayClash,
      clashesWith(line.branch, chart.calendar.dayBranch)
    );
  }
}

const late = buildLiuyaoChart({
  ...LIU_YAO_BOUNDARY_INPUT,
  divinationDate: "2024-06-01",
  divinationTime: "23:30",
});
const nextEarly = buildLiuyaoChart({
  ...LIU_YAO_BOUNDARY_INPUT,
  divinationDate: "2024-06-02",
  divinationTime: "00:30",
});
const beforeEleven = buildLiuyaoChart({
  ...LIU_YAO_BOUNDARY_INPUT,
  divinationDate: "2024-06-01",
  divinationTime: "22:30",
});
assertEqual("sect1: 23:30 == next 00:30", late.calendar.dayGanZhi, nextEarly.calendar.dayGanZhi);
check("sect1: 22:30 != 23:30", beforeEleven.calendar.dayGanZhi !== late.calendar.dayGanZhi);

{
  const tun = buildLiuyaoChart(
    LIU_YAO_GOLDEN_CASES.find((gc) => gc.id === "qian-tianshan-dun-static")!.input
  );
  const synthetic = tun.primary.lines.map((line) => ({
    ...line,
    liuQin: line.liuQin === "parent" ? ("officer" as const) : line.liuQin,
  }));
  const parentFuShen = fuShenForPrimary({
    palace: "qian",
    palaceElement: "metal",
    lines: synthetic,
  }).filter((entry) => entry.hidden.liuQin === "parent");
  assertEqual("乾宫双父母伏神", parentFuShen.length, 2);
}

{
  const FACE_VALUES: CoinTriplet[] = [JIAO, DAN, CHAI, ZHONG];
  const seen = new Set<string>();
  for (let n = 0; n < 4096; n += 1) {
    let x = n;
    const throws: CoinTriplet[] = [];
    for (let i = 0; i < 6; i += 1) {
      throws.push(FACE_VALUES[x % 4]!);
      x = Math.floor(x / 4);
    }
    const chart = buildLiuyaoChart({
      divinationDate: "2024-06-01",
      divinationTime: "10:00",
      throws: throws as CoinThrows,
    });
    if (!chart.changed) continue;
    for (const line of chart.primary.lines) {
      if (!line.isMoving || !line.transformedTo) continue;
      const expected = advanceRetreatOf(line.branch, line.transformedTo.branch);
      assertEqual(
        `n=${n} L${line.index} advanceRetreat`,
        line.transformedTo.advanceRetreat,
        expected
      );
      if (expected) seen.add(advanceRetreatKey(line.branch, line.transformedTo.branch));
    }
  }
  assertEqual(
    "纳甲 reachable 进退 set",
    [...seen].sort().join(","),
    [...NA_JIA_REACHABLE_ADVANCE_RETREAT].sort().join(",")
  );
}

if (failures > 0) {
  console.error(`\nverify: ${failures} check(s) failed.`);
  process.exit(1);
}
console.log("verify: all checks passed.");
