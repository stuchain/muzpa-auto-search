import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildPreview, parseCsv } from "./csvService";

describe("buildPreview", () => {
  it("maps first two columns into track and artist", () => {
    const preview = buildPreview("demo.csv", [
      ["Track 1", "Artist 1"],
      ["Track 2", "Artist 2"]
    ]);
    expect(preview.rows).toHaveLength(2);
    expect(preview.rows[0].query).toBe("Track 1 Artist 1");
  });

  it("warns on incomplete rows", () => {
    const preview = buildPreview("demo.csv", [["OnlyTrack"], ["", ""], ["Track", "Artist"]]);
    expect(preview.warnings.length).toBe(1);
    expect(preview.rows).toHaveLength(1);
  });

  it("skips rows where both track and artist are empty", () => {
    const preview = buildPreview("demo.csv", [["", ""], ["   ", "  "]] as unknown as never[]); // explicit to emphasize trimming behavior
    expect(preview.rows).toHaveLength(0);
    expect(preview.warnings.join(" ")).toContain("No valid tracks");
  });

  it("trims whitespace around track and artist", () => {
    const preview = buildPreview("demo.csv", [["  Track A  ", "  Artist B  "]]);
    expect(preview.rows).toHaveLength(1);
    expect(preview.rows[0].track).toBe("Track A");
    expect(preview.rows[0].artist).toBe("Artist B");
    expect(preview.rows[0].query).toBe("Track A Artist B");
  });

  it("adds warning and skips when track is missing", () => {
    const preview = buildPreview("demo.csv", [["", "Artist X"]]);
    expect(preview.rows).toHaveLength(0);
    expect(preview.warnings).toHaveLength(2);
    expect(preview.warnings.join(" ")).toContain("missing track or artist");
    expect(preview.warnings.join(" ")).toContain("No valid tracks");
  });

  it("adds warning and skips when artist is missing", () => {
    const preview = buildPreview("demo.csv", [["Track Y", ""]]);
    expect(preview.rows).toHaveLength(0);
    expect(preview.warnings).toHaveLength(2);
    expect(preview.warnings.join(" ")).toContain("missing track or artist");
    expect(preview.warnings.join(" ")).toContain("No valid tracks");
  });

  it("stringifies non-string cell values", () => {
    const preview = buildPreview("demo.csv", [[123, true]]);
    expect(preview.rows).toHaveLength(1);
    expect(preview.rows[0].track).toBe("123");
    expect(preview.rows[0].artist).toBe("true");
    expect(preview.rows[0].query).toBe("123 true");
  });
});

describe("parseCsv", () => {
  it("parses csv and builds track queries", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "muzpa-test-"));
    const filePath = path.join(dir, "playlist.csv");
    try {
      const csv = ["Track Name,Artist Name", "Song A,Artist A", "Song B,Artist B"].join("\n");
      await fs.writeFile(filePath, csv, "utf-8");

      const preview = await parseCsv(filePath);
      expect(preview.csvPath).toBe(filePath);
      expect(preview.rows).toHaveLength(3); // header row is treated as data in this parser
      expect(preview.rows[1].query).toBe("Song A Artist A");
      expect(preview.rows[2].query).toBe("Song B Artist B");
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });

  it("collects warnings and skips incomplete rows", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "muzpa-test-"));
    const filePath = path.join(dir, "playlist.csv");
    try {
      // No blank lines so warning row indexes are stable relative to the parsed data.
      const csv = ["Track A,Artist A", "Track B,", ",Artist C"].join("\n");
      await fs.writeFile(filePath, csv, "utf-8");

      const preview = await parseCsv(filePath);
      expect(preview.rows).toHaveLength(1);
      expect(preview.rows[0].query).toBe("Track A Artist A");
      expect(preview.warnings.length).toBe(2);
    } finally {
      await fs.rm(dir, { recursive: true, force: true });
    }
  });
});
