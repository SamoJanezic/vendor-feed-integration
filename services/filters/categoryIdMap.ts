import { Kategorija } from "../../Models/Kategorija.js";

type CategoryRow = {
	kategorija_id: string;
	kategorija: string;
};

async function buildCategoryLookup(): Promise<Record<string, string>> {
	const categories = await Kategorija.findAll({
		attributes: ["kategorija_id", "kategorija"],
		raw: true,
	}) as unknown as CategoryRow[];

	const lookup: Record<string, string> = {};

	for (const { kategorija_id, kategorija } of categories) {
		lookup[kategorija] = String(kategorija_id);
	}

	return lookup;
}
export const categoryLookup = await buildCategoryLookup();