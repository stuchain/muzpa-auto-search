import fs from "node:fs/promises";
import Papa from "papaparse";
import type { CsvPreview, TrackRow } from "../../shared/types";

type CsvValue = string | number | boolean | null | undefined;

export async function parseCsv(csvPath: string): Promise<CsvPreview> {
  const raw = await fs.readFile(csvPath, "utf-8");
  const parsed = Papa.parse<CsvValue[]>(raw, {
    skipEmptyLines: true
  });

  return buildPreview(csvPath, parsed.data);
}

export function buildPreview(csvPath: string, data: CsvValue[][]): CsvPreview {
  const warnings: string[] = [];
  const rows: TrackRow[] = [];

  data.forEach((row, idx) => {
    const track = String(row[0] ?? "").trim();
    const artist = String(row[1] ?? "").trim();
    if (!track && !artist) return;
    if (!track || !artist) {
      warnings.push(`Row ${idx + 1} is missing track or artist.`);
      return;
    }
    rows.push({
      index: rows.length,
      track,
      artist,
      query: `${track} ${artist}`.trim(),
      status: "pending"
    });
  });

  if (rows.length === 0) {
    warnings.push("No valid tracks found in the selected CSV.");
  }

  return { csvPath, rows, warnings };
}
