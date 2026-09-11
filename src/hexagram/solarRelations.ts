// 飞伏·日月结构关系 — mechanical branch match/clash vs day/month.
// Not “出伏条件”; matched ids are relation names only.

import { clashesWith } from "./branchRelations";
import type { FuShenEntryBase } from "./fuShen";
import type {
  FuShenEntry,
  FuShenSolarRelationId,
  HexagramLine,
  LiuYaoCalendar,
} from "../types";

/** Stable display / verify order for matched 飞伏·日月 relation ids. */
export const FU_SHEN_SOLAR_RELATION_IDS: readonly FuShenSolarRelationId[] = [
  "hidden_day_clash",
  "hidden_month_clash",
  "hidden_day_match",
  "hidden_month_match",
  "flying_day_clash",
  "flying_month_clash",
] as const;

export const FU_SHEN_SOLAR_RELATION_LABEL_ZH: Record<
  FuShenSolarRelationId,
  string
> = {
  hidden_day_clash: "日冲伏",
  hidden_month_clash: "月冲伏",
  hidden_day_match: "伏神值日",
  hidden_month_match: "伏神值月",
  flying_day_clash: "日冲飞",
  flying_month_clash: "月冲飞",
};

type CalBranches = Pick<LiuYaoCalendar, "dayBranch" | "monthBranch">;

export function applyLineClashMarks(
  lines: HexagramLine[],
  calendar: CalBranches
): void {
  for (const line of lines) {
    line.isDayClash = clashesWith(line.branch, calendar.dayBranch);
    line.isMonthClash = clashesWith(line.branch, calendar.monthBranch);
  }
}

export function matchFuShenSolarRelations(
  entry: Pick<FuShenEntry, "flying" | "hidden">,
  calendar: CalBranches
): FuShenSolarRelationId[] {
  const matched: FuShenSolarRelationId[] = [];
  const { dayBranch, monthBranch } = calendar;
  const hidden = entry.hidden.branch;
  const flying = entry.flying.branch;

  if (clashesWith(dayBranch, hidden)) matched.push("hidden_day_clash");
  if (clashesWith(monthBranch, hidden)) matched.push("hidden_month_clash");
  if (dayBranch === hidden) matched.push("hidden_day_match");
  if (monthBranch === hidden) matched.push("hidden_month_match");
  if (clashesWith(dayBranch, flying)) matched.push("flying_day_clash");
  if (clashesWith(monthBranch, flying)) matched.push("flying_month_clash");

  return matched;
}

/** Attach `solarRelations.matched` to each entry (immutable map). */
export function attachSolarRelations(
  entries: FuShenEntryBase[],
  calendar: CalBranches
): FuShenEntry[] {
  return entries.map((entry) => ({
    ...entry,
    solarRelations: {
      matched: matchFuShenSolarRelations(entry, calendar),
    },
  }));
}
