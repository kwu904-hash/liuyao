import { describe, expect, it } from "vitest";
import { buildLiuyaoChart, LIU_YAO_ENGINE_ID } from "./index";
import type { AdvanceRetreat, FuShenEntry, LineTransform, LiuQin } from "./index";

describe("public README example", () => {
  it("casts 水火既济 from six coin throws and prints names", () => {
    const chart = buildLiuyaoChart({
      throws: [
        [1, 0, 0],
        [1, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
        [1, 0, 0],
        [1, 1, 0],
      ],
      divinationDate: "2024-06-01",
      divinationTime: "10:00",
    });

    expect(chart.primary.identity.name).toBe("水火既济");
    expect(chart.changed?.identity.name).toBe("泽雷随");
    expect(chart.meta.engine).toBe(LIU_YAO_ENGINE_ID);
    expect(LIU_YAO_ENGINE_ID).toBe("astralium-liuyao-jingfang-v1");

    const fuShen: FuShenEntry[] = chart.primary.fuShen;
    const transforms: Array<LineTransform | undefined> = chart.primary.lines.map(
      (line) => line.transformedTo
    );
    const relatives: LiuQin[] = chart.primary.lines.map((line) => line.liuQin);
    const marks: Array<AdvanceRetreat | null | undefined> = transforms.map(
      (t) => t?.advanceRetreat
    );
    expect(fuShen.length).toBeGreaterThanOrEqual(0);
    expect(relatives).toHaveLength(6);
    expect(marks.length).toBe(6);
  });
});
