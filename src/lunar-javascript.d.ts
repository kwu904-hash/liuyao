declare module "lunar-javascript" {
  export class Solar {
    static fromYmdHms(
      year: number,
      month: number,
      day: number,
      hour: number,
      minute: number,
      second: number
    ): Solar;
    getLunar(): Lunar;
  }

  export class Lunar {
    getEightChar(): EightChar;
  }

  export interface EightChar {
    setSect(sect: 1 | 2): void;
    getDay(): string;
    getMonth(): string;
    getDayXunKong(): string;
  }
}
