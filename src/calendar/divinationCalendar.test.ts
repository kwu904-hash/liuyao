import { describe, expect, it } from "vitest";
import { computeDivinationCalendar } from "./divinationCalendar";

describe("computeDivinationCalendar input errors", () => {
  it("explains YYYY-MM-DD when the date shape is wrong", () => {
    expect(() => computeDivinationCalendar("2024/06/01", "10:00")).toThrow(
      /YYYY-MM-DD.*2024\/06\/01/
    );
  });

  it("rejects unpadded dates", () => {
    expect(() => computeDivinationCalendar("2024-6-1", "10:00")).toThrow(
      /YYYY-MM-DD.*2024-6-1/
    );
  });

  it("explains HH:mm when the time shape is wrong", () => {
    expect(() => computeDivinationCalendar("2024-06-01", "9:00")).toThrow(
      /HH:mm.*"9:00"/
    );
  });

  it("rejects hour 24", () => {
    expect(() => computeDivinationCalendar("2024-06-01", "24:00")).toThrow(
      /out of range.*"24:00"/
    );
  });
});
