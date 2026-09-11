// Earthly-branch 六冲 (six clashes). Structure layer only — no 破 / 合 / 刑 / 害.

/** Six clash pairs (unordered). */
export const BRANCH_CLASH_PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["子", "午"],
  ["丑", "未"],
  ["寅", "申"],
  ["卯", "酉"],
  ["辰", "戌"],
  ["巳", "亥"],
] as const;

const CLASH_OF = (() => {
  const map = new Map<string, string>();
  for (const [a, b] of BRANCH_CLASH_PAIRS) {
    map.set(a, b);
    map.set(b, a);
  }
  return map;
})();

/** True when `a` and `b` form one of the six clash pairs. Same branch → false. */
export function clashesWith(a: string, b: string): boolean {
  if (!a || !b || a === b) return false;
  return CLASH_OF.get(a) === b;
}
