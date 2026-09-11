import { describe, expect, it } from "vitest";
import {
  applyLineClashMarks,
  attachSolarRelations,
  matchFuShenSolarRelations,
} from "./solarRelations";
import type { FuShenEntryBase } from "./fuShen";
import type { HexagramLine } from "../types";

function stubLine(branch: string, index = 1): HexagramLine {
  return {
    index,
    yinYang: "yang",
    value: 7,
    isMoving: false,
    stem: "甲",
    branch,
    branchElement: "water",
    liuQin: "sibling",
    liuShen: "qinglong",
    isShi: false,
    isYing: false,
    isVoid: false,
    isDayClash: false,
    isMonthClash: false,
  };
}

describe("applyLineClashMarks", () => {
  it("marks 日冲 / 月冲 independently", () => {
    const lines = [stubLine("午"), stubLine("巳", 2), stubLine("亥", 3)];
    applyLineClashMarks(lines, { dayBranch: "子", monthBranch: "巳" });
    expect(lines[0].isDayClash).toBe(true); // 子午
    expect(lines[0].isMonthClash).toBe(false);
    expect(lines[1].isDayClash).toBe(false);
    expect(lines[1].isMonthClash).toBe(false); // same branch ≠ 冲
    expect(lines[2].isDayClash).toBe(false);
    expect(lines[2].isMonthClash).toBe(true); // 巳亥
  });
});

describe("matchFuShenSolarRelations (hand example: 日支=子 月建=巳)", () => {
  it("日支=子 月建=巳 · 飞午 伏丑 → only 日冲飞", () => {
    const matched = matchFuShenSolarRelations(
      {
        flying: {
          stem: "丙",
          branch: "午",
          branchElement: "fire",
          liuQin: "offspring",
        },
        hidden: {
          stem: "乙",
          branch: "丑",
          branchElement: "earth",
          liuQin: "wealth",
        },
      },
      { dayBranch: "子", monthBranch: "巳" }
    );
    expect(matched).toEqual(["flying_day_clash"]);
  });

  it("can stack 值日 and 冲飞", () => {
    const matched = matchFuShenSolarRelations(
      {
        flying: {
          stem: "丙",
          branch: "午",
          branchElement: "fire",
          liuQin: "offspring",
        },
        hidden: {
          stem: "甲",
          branch: "子",
          branchElement: "water",
          liuQin: "wealth",
        },
      },
      { dayBranch: "子", monthBranch: "未" }
    );
    expect(matched).toEqual(["hidden_day_match", "flying_day_clash"]);
  });
});

describe("attachSolarRelations + flying ↔ line clash invariant", () => {
  it("flying_day_clash ⇔ line.isDayClash", () => {
    const lines = [stubLine("午", 2)];
    applyLineClashMarks(lines, { dayBranch: "子", monthBranch: "寅" });

    const raw: FuShenEntryBase[] = [
      {
        lineIndex: 2,
        flying: {
          stem: "丙",
          branch: "午",
          branchElement: "fire",
          liuQin: "offspring",
        },
        hidden: {
          stem: "乙",
          branch: "丑",
          branchElement: "earth",
          liuQin: "wealth",
        },
      },
    ];
    const attached = attachSolarRelations(raw, {
      dayBranch: "子",
      monthBranch: "寅",
    });
    const hasFlyingDay = attached[0].solarRelations.matched.includes(
      "flying_day_clash"
    );
    expect(hasFlyingDay).toBe(lines[0].isDayClash);
    expect(hasFlyingDay).toBe(true);
  });
});
