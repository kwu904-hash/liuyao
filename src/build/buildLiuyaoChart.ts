// Coin faces → fully resolved 京房纳甲 chart. Pure computation — no
// interpretation, no auto-cast.

import { computeDivinationCalendar } from "../calendar/divinationCalendar";
import { coinThrowsToLines, flipYinYang } from "../coin/coinToLines";
import { LIU_YAO_ENGINE_ID, LIU_YAO_METHOD, relativeFor } from "../constants";
import { advanceRetreatOf } from "../hexagram/advanceRetreat";
import { fuShenForPrimary } from "../hexagram/fuShen";
import { naJiaForHexagram } from "../hexagram/naJia";
import { identifyHexagram } from "../hexagram/palace";
import { liuShenForLines } from "../hexagram/liuShen";
import {
  applyLineClashMarks,
  attachSolarRelations,
} from "../hexagram/solarRelations";
import type {
  FiveElement,
  HexagramIdentity,
  HexagramLine,
  LineValue,
  LiuShen,
  LiuYaoCastInput,
  LiuYaoChartData,
  YinYang,
} from "../types";

function assembleLines(params: {
  yinYangs: YinYang[];
  values: LineValue[];
  movingFlags: boolean[];
  identity: HexagramIdentity;
  relativeSelf: FiveElement;
  liuShen: LiuShen[];
  voidBranches: [string, string];
}): HexagramLine[] {
  const { yinYangs, values, movingFlags, identity, relativeSelf, liuShen, voidBranches } =
    params;
  const naJia = naJiaForHexagram(identity.lowerTrigram, identity.upperTrigram);
  return naJia.map((line, i) => {
    const index = i + 1;
    return {
      index,
      yinYang: yinYangs[i],
      value: values[i],
      isMoving: movingFlags[i],
      stem: line.stem,
      branch: line.branch,
      branchElement: line.branchElement,
      liuQin: relativeFor(relativeSelf, line.branchElement),
      liuShen: liuShen[i],
      isShi: index === identity.worldLine,
      isYing: index === identity.responseLine,
      isVoid: voidBranches.includes(line.branch),
      isDayClash: false,
      isMonthClash: false,
    };
  });
}

export function buildLiuyaoChart(input: LiuYaoCastInput): LiuYaoChartData {
  const derived = coinThrowsToLines(input.throws);
  const primaryYinYangs = derived.map((l) => l.yinYang);
  const primaryValues = derived.map((l) => l.value);
  const movingFlags = derived.map((l) => l.isMoving);

  const calendar = computeDivinationCalendar(
    input.divinationDate,
    input.divinationTime
  );
  const liuShen = liuShenForLines(calendar.dayStem);

  const primaryIdentity = identifyHexagram(primaryYinYangs);
  const relativeSelf = primaryIdentity.palaceElement;

  const primaryLines = assembleLines({
    yinYangs: primaryYinYangs,
    values: primaryValues,
    movingFlags,
    identity: primaryIdentity,
    relativeSelf,
    liuShen,
    voidBranches: calendar.voidBranches,
  });
  applyLineClashMarks(primaryLines, calendar);

  const fuShen = attachSolarRelations(
    fuShenForPrimary({
      palace: primaryIdentity.palace,
      palaceElement: relativeSelf,
      lines: primaryLines,
    }),
    calendar
  );

  const movingLineIndices = derived
    .filter((l) => l.isMoving)
    .map((l) => l.index);

  let changed: LiuYaoChartData["changed"] = null;
  if (movingLineIndices.length > 0) {
    const changedYinYangs = derived.map((l) =>
      l.isMoving ? flipYinYang(l.yinYang) : l.yinYang
    );
    const changedValues: LineValue[] = changedYinYangs.map((yy) =>
      yy === "yang" ? 7 : 8
    );
    const changedIdentity = identifyHexagram(changedYinYangs);
    const changedLines = assembleLines({
      yinYangs: changedYinYangs,
      values: changedValues,
      movingFlags: changedYinYangs.map(() => false),
      identity: changedIdentity,
      relativeSelf,
      liuShen,
      voidBranches: calendar.voidBranches,
    });
    applyLineClashMarks(changedLines, calendar);
    changed = { identity: changedIdentity, lines: changedLines };

    for (const line of primaryLines) {
      if (!line.isMoving) continue;
      const target = changedLines[line.index - 1];
      line.transformedTo = {
        yinYang: target.yinYang,
        stem: target.stem,
        branch: target.branch,
        branchElement: target.branchElement,
        liuQin: target.liuQin,
        isVoid: target.isVoid,
        isDayClash: target.isDayClash,
        isMonthClash: target.isMonthClash,
        advanceRetreat: advanceRetreatOf(line.branch, target.branch),
      };
    }
  }

  return {
    meta: {
      engine: LIU_YAO_ENGINE_ID,
      method: LIU_YAO_METHOD,
      divinationLocalDate: input.divinationDate,
      divinationLocalTime: input.divinationTime,
      daySect: 1,
      capabilities: {
        fuShen: true,
        lineClashMarks: true,
        fuShenSolarRelations: true,
        huaLineMarks: true,
        advanceRetreat: true,
      },
    },
    primary: { identity: primaryIdentity, lines: primaryLines, fuShen },
    changed,
    movingLineIndices,
    calendar,
  };
}
