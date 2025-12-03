import crypto from "crypto";
import { filtri } from "../../seeders/insertFilters.js"; // adjust path to your file

// Generate deterministic filter ID
function createDeterministicId(categoryId, naziv) {
    return crypto
        .createHash("md5")
        .update(`${categoryId}:${naziv}`)
        .digest("hex")
        .slice(0, 12);
}

// Build lookup tables
export const categoryLookup = {};
export const filterLookup = {};

for (const [categoryName, data] of Object.entries(filtri)) {
    const kategorija_id = Number(data.id);
    categoryLookup[categoryName] = kategorija_id;

    filterLookup[kategorija_id] = {};

    for (const naziv of data.filters) {
        filterLookup[kategorija_id][naziv] = createDeterministicId(kategorija_id, naziv);
    }
}

