import DobaviteljController from "./DobaviteljController.js";

export default class ColbyController extends DobaviteljController {
	constructor(categoryMap, Attributes, ...args) {
		super(...args);
		this.categoryMap = categoryMap;
		this.Attributes = Attributes;
	}
	name = "colby";
	nodes = "podjetje.izdelek";
	file = "colby.xml";
	encoding = "utf8";
	keys = [
		"izdelekEAN",
		"izdelekIme",
		"niPodatka",
		"kratkiopis",
		"cena",
		"niPodatka",
		"PPCcena",
		"davcnaStopnja",
		"slikaMala",
		"slikaVelika",
		"dodatneSlike",
		"dodatneLastnosti",
		"blagovnaZnamka",
		"kategorija",
		"niPodatka",
		"zaloga",
	];

	ignoreCategorySet = new Set([
		"Zbirateljski izdelki",
		"Torbice,Vrsta izdelka",
		"Denarnice",
		"Svetila",
		"Obeski",
		"Pokrivala",
		"Kozarci",
		"Maske",
		"Skodelice",
		"Pliš",
		"Oblačila",
		"Replike orožij",
		"Dekoracija",
		"Družabne igre",
		"Nerf",
		"Nalepke",
		"Lifestyle",
		"Priponke",
		"Darilni set",
		"Predpražniki",
		"Zaščitne maske",
		"Potovalne skodelice",
		"Bidoni",
		"Plakati",
		"Barski pripomočki",
		"Karte",
		"Kelihi",
		"Vrči",
		"Prisrčnice",
		"Igrače",
		"glasbila",
		"Ogledala",
		"Zbirateljske figure",
		"Figure,Vrsta izdelka",
		"Figure",
		"Torbice",
		"LEGO",
		"Stabilizatorji",
		"Powerbanki",
		"Drugo",
		"Podstavki",
		"Kuhinjski pripomočki",
		"Kabli",
		"Adapterji",
		"Gramofoni",
		"Ventilatorji",
		"Polnilci",
		"Napajalniki",
		"Droni in dodatki",
		"Kamere",
		"Kolesa in skuterji",
		"Športne ure",
		"Igralne mize",
		"Podaljški",
		"Spletne kamere",
		"Gramofoni",
		"Konzole",
	]);

	exceptions(param) {
		if (this.ignoreCategorySet.has(param["kategorija"]["#text"])) {
			return true;
		}
	}

	flattenCategoryMap(categoryMap) {
		if (!categoryMap) return {};
		return Object.entries(categoryMap).reduce((acc, [newCategory, oldCategories]) => {
			oldCategories.forEach(old => acc[old] = newCategory);
			return acc;
		}, {});
	}

	processCategory(data, flatCategoryMap) {
		let kategorija = data.kategorija;
		let dodatne_lastnosti = data.dodatne_lastnosti
			? JSON.parse(JSON.stringify(data.dodatne_lastnosti))
			: [];

		const newCat = flatCategoryMap[kategorija];
		if (newCat) {
			kategorija = newCat;
		}

		return { ...data, kategorija, dodatne_lastnosti };
	}


	formatZaloga(zaloga) {
		return zaloga > 0 ? "Na zalogi" : "Ni na zalogi";
	}

	processImages(data) {
		const slike = [
			{ izdelek_ean: data.ean, slika_url: data.slika_mala, tip: "mala" },
			{ izdelek_ean: data.ean, slika_url: data.slika_velika, tip: "velika" }
		];

		if (data.dodatne_slike?.[0]) {
			const dodatneSlike = Array.isArray(data.dodatne_slike[0])
				? data.dodatne_slike[0]
				: data.dodatne_slike;

			slike.push(...dodatneSlike.map(el => ({
				izdelek_ean: data.ean,
				slika_url: el,
				tip: "dodatna"
			})));
		}

		return slike;
	}

	parseObject(obj) {
		if (obj.dodatna_slika) {
			return obj
		} else {
			return obj ['#text'];
		}
	}

	getEprel() {
		return null;
	}

	// processAllData() {
	// 	const flatCategoryMap = this.flattenCategoryMap(this.categoryMap);

	// 	const { slike, lastnosti } = this.allData.reduce(
	// 		(acc, rawData) => {
	// 			const updated = this.processCategory(rawData, flatCategoryMap);
	// 			rawData.kategorija = updated.kategorija
	// 			acc.slike.push(...this.processImages(updated));
	// 			acc.lastnosti.push(...this.processLastnosti(updated));
	// 			return acc;
	// 		},
	// 		{ slike: [], lastnosti: [] }
	// 	);

	// 	const { komponenta, atribut } = this.mapKomponentaAndAtribut(lastnosti);

	// 	Object.assign(this, {
    //         slika: slike,
    //         komponenta,
    //         atribut,
    //     });
	// }

	executeAll() {
		this.createDataObject();
		this.processAllData();
		this.insertDataIntoDb();
	}
}
