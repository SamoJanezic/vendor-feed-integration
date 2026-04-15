import crypto from "crypto";
import { filtri } from "../seeders/insertFilters.js"; // adjust path to your file

type CategoryCall = {
    CategoryId: string;
    naziv: string;
}

// Generate deterministic filter ID
function createDeterministicId(categoryId: number, naziv: string): string {
    return crypto
        .createHash("md5")
        .update(`${categoryId}:${naziv}`)
        .digest("hex")
        .slice(0, 12);
}

export const categoryLookup: Record<string, number> = {};
export const filterLookup: Record<number, Record<string, string>> = {};

for (const [categoryName, data] of Object.entries(filtri)) {
    const kategorija_id = Number(data.id);
    categoryLookup[categoryName] = kategorija_id;

    filterLookup[kategorija_id] = {};

    for (const naziv of data.filters) {
        filterLookup[kategorija_id][naziv] = createDeterministicId(kategorija_id, naziv);
    }
}

