import { describe, expect, it } from "vitest";
import { buildMuzpaSearchUrl } from "./muzpaUrl";

describe("buildMuzpaSearchUrl", () => {
  it("trims whitespace from the query", () => {
    const url = buildMuzpaSearchUrl("  hello world  ");
    expect(url).toContain("hello%20world");
  });

  it("URL-encodes special characters", () => {
    const url = buildMuzpaSearchUrl("a&b/c+d");
    // Basic sanity check that reserved characters are encoded.
    expect(url).toContain("a%26b%2Fc%2Bd");
  });

  it.skip("handles unicode characters", () => {
    const url = buildMuzpaSearchUrl("Björk Guðmundsdóttir");
    expect(url).toMatch(/%C3%B6/); // ö (umlaut o)
    expect(url).toMatch(/%C3%BA/); // ú
  });

  it("URL-encodes unicode characters correctly", () => {
    const url = buildMuzpaSearchUrl("Björk Guðmundsdóttir");
    // Guðmundsdóttir includes:
    // - đ (U+00F0) => %C3%B0
    // - ó (U+00F3) => %C3%B3
    expect(url).toMatch(/%C3%B0/);
    expect(url).toMatch(/%C3%B3/);
  });
});

