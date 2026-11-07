/** Light Arabic/Latin normalization: NFKC, strip tashkeel + tatweel, collapse spaces, lowercase Latin. */
export function normalizeText(input: string): string {
  return input
    .normalize("NFKC")
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/\u0640/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
