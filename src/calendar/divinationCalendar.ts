// The ONLY lunar-javascript entry point in this library. Derives the day pillar,
// month command (月建, branch only), and the day's void pair (旬空) from the
// casting wall-clock time. Day boundary is fixed to sect 1 (23:00 rolls the
// civil day).

import { Solar } from "lunar-javascript";
import type { LiuYaoCalendar } from "../types";

function parseDate(date: string): [number, number, number] {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    throw new Error(
      `divinationDate must be YYYY-MM-DD (zero-padded Gregorian), e.g. "2024-06-01"; got ${JSON.stringify(date)}.`
    );
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error(
      `divinationDate is not a valid calendar date: ${JSON.stringify(date)}. Use YYYY-MM-DD, e.g. "2024-06-01".`
    );
  }
  return [year, month, day];
}

function parseTime(time: string): [number, number] {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) {
    throw new Error(
      `divinationTime must be 24-hour HH:mm (zero-padded), e.g. "10:00" or "23:30"; got ${JSON.stringify(time)}. The civil day rolls at 23:00.`
    );
  }
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) {
    throw new Error(
      `divinationTime out of range: ${JSON.stringify(time)}. Hour must be 00–23 and minute 00–59 (e.g. "23:30"; 23:00 starts the next civil day).`
    );
  }
  return [hour, minute];
}

export function computeDivinationCalendar(
  date: string,
  time: string
): LiuYaoCalendar {
  const [year, month, day] = parseDate(date);
  const [hour, minute] = parseTime(time);
  let solar: ReturnType<typeof Solar.fromYmdHms>;
  try {
    solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  } catch {
    throw new Error(
      `divinationDate / divinationTime is not a valid wall-clock moment: date=${JSON.stringify(date)} time=${JSON.stringify(time)}. Expected YYYY-MM-DD and HH:mm, e.g. "2024-06-01" and "10:00".`
    );
  }
  const ec = solar.getLunar().getEightChar();
  ec.setSect(1);

  const dayGanZhi = ec.getDay();
  const dayStem = dayGanZhi.charAt(0);
  const dayBranch = dayGanZhi.charAt(1);
  const monthGanZhi = ec.getMonth();
  const monthBranch = monthGanZhi.charAt(monthGanZhi.length - 1);

  const xunKong = ec.getDayXunKong();
  const voidBranches: [string, string] = [
    xunKong.charAt(0),
    xunKong.charAt(1),
  ];

  return { dayGanZhi, dayStem, dayBranch, monthBranch, voidBranches };
}
