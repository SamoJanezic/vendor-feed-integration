import { Kategorija } from "../../Models/Kategorija.js";

async function buildCategoryLookup() {
    const categories = await Kategorija.findAll({
        attributes: ["kategorija_id", "kategorija"],
        raw: true,
    });

    const lookup = {};
    for (const { kategorija_id, kategorija } of categories) {
        lookup[kategorija] = kategorija_id;
    }
    return lookup;
}

export const categoryLookup = await buildCategoryLookup();