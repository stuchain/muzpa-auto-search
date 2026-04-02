const MUZPA_SEARCH_BASE = "https://srv.muzpa.com/#/search?text=";

/**
 * Builds a Muzpa search URL from a free-form query.
 * Pure function so it can be shared by both embedded and external modes.
 */
export function buildMuzpaSearchUrl(query: string): string {
  return `${MUZPA_SEARCH_BASE}${encodeURIComponent(query.trim())}`;
}

