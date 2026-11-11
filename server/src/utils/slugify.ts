// slugify
// Turns a  name into a web-friendly id, e.g "Home & Living" -> "home-living"

// STEP 9: Make web-friendly names {slugs}

// REGEX:

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, "-") // anything that is not a letter or number becomes"-"
    .replace(/^-+|-+$/g, ""); // remove "-" at the start or end
};

// STEP 10: {write the demo data -> server/src/data/categpries.ts}