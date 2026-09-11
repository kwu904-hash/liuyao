# Astralium Liu Yao / Astralium 六爻计算核

京房纳甲六爻计算库：传入六次铜钱正反与起卦时刻，得到本卦、变卦、纳甲、六亲、六神、世应、伏神、旬空、日冲、月冲、进退神。

```bash
npm i @astralium/liuyao
```

[Astralium](https://getastralium.com) 是商标。本库是独立的 MIT 开源计算核，不是托管产品，也不包含网站源码。

不算命。不自动摇卦。不输出吉凶断语。

## 铜钱口径

传统字背（《卜筮正宗·以钱代蓍法》），**不是多数决**。

| 背面数量 | 传入例子 | 爻值 | 阴阳 |
| --- | --- | --- | --- |
| 一背 | `[1, 0, 0]`（三枚顺序无所谓） | **少阳 7** | 阳、静 |
| 二背 | `[1, 1, 0]` | **少阴 8** | 阴、静 |
| 三背 | `[1, 1, 1]` | 老阳 9 | 阳、动 |
| 三字（零背） | `[0, 0, 0]` | 老阴 6 | 阴、动 |

- **`1` = 背**（无字 / 花徽），**`0` = 字**（有字）。
- 一背是少阳，二背是少阴。按「哪面比较多」会把一背判阴、二背判阳，那是错的。
- 六个三元组的顺序是 **初爻 → 上爻**（自下而上；下标 0 为初爻）。
- `divinationDate` 为 `YYYY-MM-DD`，`divinationTime` 为 `HH:mm`，均为当地墙上时钟。**日界为 23:00**：当天 23:00 起改用次日日柱，与次日 00:30 相同。

日柱、月建（节令月支）与旬空由运行时依赖 [`lunar-javascript`](https://github.com/6tail/lunar-javascript)（MIT）计算。

## 例子

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
  divinationDate: "2024-06-01",
  divinationTime: "10:00",
});

console.log(chart.primary.identity.name);  // 水火既济
console.log(chart.changed?.identity.name); // 泽雷随
console.log(chart.meta.engine);            // astralium-liuyao-jingfang-v1
```

稳定 API 只有包入口 `@astralium/liuyao`。`LiuYaoChartData`、`FuShenEntry`、`LineTransform`、`LiuQin`、`AdvanceRetreat` 等类型也从该入口导出：

```ts
import type { FuShenEntry, LiuQin, LineTransform } from "@astralium/liuyao";
```

日期或时间格式无效时，错误信息会附带你传入的值，并给出合法示例。

## 本库不做的事

- 吉凶、应期、旺衰等断语
- 代为摇卦或生成随机铜钱（六次投掷必须由调用方传入）
- 选用神或排卦意主题
- 阅读文案、卡片或其他应用层输出

结构标记止于当前实现：不计算日破 / 暗动断语、完整出伏、变卦伏神。

## 开发

克隆本仓库后：

```bash
npm install
npm test
npm run verify
```

`verify` 会核对铜钱映射、六十四卦、日界与进退神等回归项。

## License

MIT.
