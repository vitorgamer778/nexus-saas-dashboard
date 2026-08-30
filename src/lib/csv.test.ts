import { describe, expect, it } from "vitest";
import { createCsv, safeCsvCell } from "@/lib/csv";

describe("secure CSV generation", () => {
  it("neutralizes spreadsheet formulas", () => {
    expect(safeCsvCell("=IMPORTXML('evil')")).toBe("\"'=IMPORTXML('evil')\"");
    expect(safeCsvCell("+123")).toBe('"\'+123"');
  });

  it("escapes quotes and adds an Excel-compatible BOM", () => {
    expect(createCsv([["Customer", 'Acme "Labs"']])).toBe(
      '\uFEFF"Customer","Acme ""Labs"""',
    );
  });
});
