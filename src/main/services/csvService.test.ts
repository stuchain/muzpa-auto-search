import { describe, expect, it } from "vitest";
import { buildPreview } from "./csvService";

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
});
