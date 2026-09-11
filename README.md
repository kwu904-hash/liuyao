# Astralium Liu Yao / Astralium 六爻计算核

京房纳甲六爻 **计算核**：你提供六次铜钱正反与起卦时刻，本库算出本卦 / 变卦 / 纳甲 / 六亲 / 六神 / 世应 / 伏神 / 旬空 / 日冲月冲 / 进退神。

```bash
npm i @astralium/liuyao
```

用于 [getastralium.com](https://getastralium.com)。**Astralium** 是商标。本库是可独立安装的计算核，**不是**托管站、也不是网站源码。

MIT License。不算命。不自动摇卦。不输出吉凶断语。

引擎 id（`chart.meta.engine`）为 `astralium-liuyao-jingfang-v1`。

## 本库不算什么

本库只做结构计算。下列都不做、也没有对应 API：

- **断语**：不断吉凶、应期、用神旺衰
- **自动摇卦**：不生成随机铜钱；六次投掷必须由调用方传入
- **资料包**：不产出阅读文案、卡片或托管站用的 packet 格式
- **用神**：不选用神、不排卦意主题

也不做：日破/暗动断语、完整出伏、变卦伏神、学堂文章。

对外只保证 **包入口** `@astralium/liuyao` 的导出（`buildLiuyaoChart` 与同文件 re-export 的类型/辅助函数）。深层路径如 `src/hexagram/...` 不是稳定 API。

## 铜钱口径（必须按此传入）

传统字背（《卜筮正宗·以钱代蓍法》），**不是多数决**：

| 背面数量 | 传入例子 | 爻值 | 阴阳 |
| --- | --- | --- | --- |
| 一背 | `[1, 0, 0]`（顺序无所谓） | **少阳 7** | 阳、静 |
| 二背 | `[1, 1, 0]` | **少阴 8** | 阴、静 |
| 三背 | `[1, 1, 1]` | 老阳 9 | 阳、动 |
| 三字（零背） | `[0, 0, 0]` | 老阴 6 | 阴、动 |

- **`1` = 背**（无字/花徽），**`0` = 字**（有字）。
- 一背是少阳、二背是少阴。若按「多数面」会把一背判阴、二背判阳——那是错的。
- 六次数组顺序 **初爻 → 上爻**（下往上，index 0 是初爻）。
- 日期 `YYYY-MM-DD`、时间 `HH:mm`，均为墙上时钟。**日界 23:00**（`daySect = 1`）：当天 `23:00` 起改用次日日柱，与次日 `00:30` 相同。

农历/八字日柱与月建由运行时依赖 [`lunar-javascript`](https://github.com/6tail/lunar-javascript)（MIT）计算；本库 **只有** `src/calendar/divinationCalendar.ts` 这一处进口它。

## 最小可运行例子

```ts
import { buildLiuyaoChart } from "@astralium/liuyao";

const chart = buildLiuyaoChart({
  throws: [
    [1, 0, 0], // 一背 → 少阳 7
    [1, 1, 0], // 二背 → 少阴 8
    [1, 1, 1], // 三背 → 老阳 9（动）
    [0, 0, 0], // 三字 → 老阴 6（动）
    [1, 0, 0],
    [1, 1, 0],
  ],
  divinationDate: "2024-06-01", // YYYY-MM-DD
  divinationTime: "10:00",      // HH:mm；23:00 换日
});

console.log(chart.primary.identity.name);       // 水火既济
console.log(chart.changed?.identity.name);      // 泽雷随
console.log(chart.meta.engine);                 // astralium-liuyao-jingfang-v1
```

`LiuYaoChartData`、`FuShenEntry`、`LineTransform`、`LiuQin`、`AdvanceRetreat` 等类型均从包入口 re-export，可直接：

```ts
import type { FuShenEntry, LiuQin, LineTransform } from "@astralium/liuyao";
```

日期/时间格式不对时，错误信息会带上你传入的值，并给出 `YYYY-MM-DD` / `HH:mm` 示例。

## Verify

```bash
npm install
npm test
npm run verify
```

`npm run build` 生成 `dist/`（`.js` + `.d.ts`），供普通 TypeScript / Node 项目 `import`。不要把入口指到 `src/*.ts`。

`verify` 锁定：铜钱映射、64 卦（八宫生成 ↔ 文王卦序）、手算金样、旬空 / 23:00 日界、4096 扫进退神可达集。

## License

MIT. Calendar math uses [`lunar-javascript`](https://github.com/6tail/lunar-javascript) (MIT).
