import { xmlParser } from "./parseController.js";
import DobaviteljController from "./DobaviteljController.js";
import {
	categoryLookup,
	filterLookup,
} from "../services/filters/filterIdMap.js";

export default class BshController extends DobaviteljController {
	constructor(categoryMap, Attributes, ...args) {
		super(...args);
		this.categoryMap = categoryMap;
		this.Attributes = Attributes;
	}
	name = "bosch";
	file = [
		{
			fileName: "BSH_opisi.xml",
			node: "TradeplaceMessage.BusinessMessage.CatalogDownloadReply.CatalogDownloadReplyItems.Product",
		},
		{ fileName: "BSH_cene.xml", node: "izdelki.izdelek" },
	];
	encoding = "utf8";
	keys = [
		"ean",
		"sifra",
		"kratki_opis",
		"opis",
		"cena",
		"niPodatka",
		"ppc",
		"davek",
		"OtherData.LowResolutionPictureName",
		"OtherData.HighResolutionPictureName",
		"niPodatka",
		"niPodatka",
		"brand",
		"niPodatka",
		"eprel",
		"zaloga",
	];

	combineData() {
		const [opisi, cene] = this.getData();
		return opisi.flatMap((opis) =>
			cene
				.filter((cena) => opis.PIData.EANArticleCode === cena.ean)
				.map((cena) => ({ ...opis, ...cena }))
		);
		return combinedData;
	}

	keyRules(obj, product, key, idx, vrstica) {
		const field = vrstica[idx];
		const properties = product?.PIData?.PIProperties?.PIProperty || [];
		const otherData = product?.OtherData || {};

		// helper lookups
		const findPropertyByName = (name) =>
			properties.find((p) => p?.["@_name"] === name)?.["#text"] ?? null;

		const findPropertyByDescription = (desc) =>
			properties.find((p) => p?.["@_description"] === desc)?.["#text"] ??
			null;

		// mapping of field names to their processors
		const handlers = {
			kratki_opis: () => findPropertyByName("SHORT_DESCRIPTION"),
			opis: () => findPropertyByName("LONG_DESCRIPTION"),
			slika_mala: () => otherData.LowResolutionPictureName ?? null,
			slika_velika: () => otherData.HighResolutionPictureName ?? null,
			dodatne_slike: () => {
				const assets = otherData?.Assets?.Asset ?? [];
				return assets
					.filter(
						(a) =>
							a?.AssetProperty?.[0]?.["#text"] ===
							"additional picture"
					)
					.flatMap((a) =>
						a.AssetProperty.filter(
							(p) => p?.["@_name"] === "identifier"
						).map((p) => p["#text"])
					);
			},
			dodatne_lastnosti: () => properties,
			blagovna_znamka: () => product?.PIData?.Brand ?? null,
			kategorija: () => findPropertyByDescription("Skupina izdelkov"),
			eprel_id: () => {
				const qr = findPropertyByName("QR_CODE_2017");
				const match = qr?.match(/(\d+)/);
				return match ? match[1] : null;
			},
			zaloga: () => this.formatZaloga(product?.zaloga),
			cena_nabavna: () => product?.cena?.replace(",", ".") ?? null,
			ppc: () => product?.ppc?.replace(",", ".") ?? null,
		};

		obj[field] = handlers[field]?.() ?? product[key] ?? null;

		return obj;
	}

	exceptions(param) {
		const ignoreCategory = [
			"Da - vse s sprednje strani",
			"noData",
			"Vzporedno",
			"Grelnik krožnikov",
			"Pribor",
		];

		return param.PIData?.PIProperties?.PIProperty?.some((property) => {
			return (
				property["@_description"] === "Skupina izdelkov" &&
				ignoreCategory.includes(property["#text"])
			);
		});
	}

	sortCategories() {
		const flatCategoryMap = {};

		for (const [newCategory, oldCategories] of Object.entries(
			this.categoryMap
		)) {
			oldCategories.forEach((old) => {
				flatCategoryMap[old] = newCategory;
			});
		}

		this.allData.forEach((el) => {
			if (flatCategoryMap[el.kategorija]) {
				el.kategorija = flatCategoryMap[el.kategorija];
			}
		});
	}

	splitDodatneLastnosti() {
		let lastnosti = [];

		this.allData.forEach((data) => {
			if (data.dodatne_lastnosti.length) {
				data.dodatne_lastnosti.forEach((el) => {
					if (el["#text"] !== "noData") {
						lastnosti.push({
							ean: data.ean,
							kategorija: data.kategorija,
							lastnostNaziv: el["@_description"],
							lastnostVrednost: el["#text"],
						});
					}
				});
			}

			this.komponenta = lastnosti.map((el) => {
				return {
					KATEGORIJA_kategorija: el.kategorija,
					komponenta: el.lastnostNaziv,
				};
			});
			this.atribut = lastnosti.map((el) => {
				return {
					izdelek_ean: el.ean,
					KOMPONENTA_komponenta: el.lastnostNaziv,
					atribut: el.lastnostVrednost,
				};
			});
		});
	}

	processLastnosti() {
		this.filtri = this.filtri || [];
		this.atribut = this.atribut || [];

		this.allData.forEach((data) => {
			if (!data.dodatne_lastnosti || data.dodatne_lastnosti.length === 0)
				return;

			// ensure lastnosti is always an array
			const lastnosti = Array.isArray(data.dodatne_lastnosti)
				? data.dodatne_lastnosti
				: Array.isArray(data.dodatne_lastnosti?.lastnost)
				? data.dodatne_lastnosti.lastnost
				: [];

			// remove "noData" entries
			const filteredLastnosti = lastnosti.filter(
				(el) => el["#text"] !== "noData"
			);

			if (!filteredLastnosti.length) return;

			// Parse attributes and filters
			const attrResult =
				new this.Attributes(
					data.kategorija,
					filteredLastnosti
				).formatAttributes() || {};
			const attributes = attrResult.attributes || {};
			const filterData = attrResult.filterData || {};

			Object.entries(attributes).forEach(([naziv, vrednost]) => {
				this.atribut.push({
					izdelek_ean: data.ean,
					KOMPONENTA_komponenta: naziv,
					atribut: vrednost,
				});
			});

			// Map filters
			Object.entries(filterData).forEach(([naziv, vrednost]) => {
				const kategorija_id = categoryLookup[data.kategorija]; // get category id
				const filter_id = filterLookup[kategorija_id]?.[naziv] || null; // get filter id

				if (!filter_id) {
					console.warn(
						`Filter ID not found for category "${data.kategorija}" and filter "${naziv}"`
					);
				}

				this.filtri.push({
					izdelek_ean: data.ean,
					filter_id,
					filter_vrednost: vrednost,
				});
			});
		});
	}

	splitSlike() {
		this.slika = [];
		this.allData.forEach((data) => {
			if (data.slika_mala) {
				this.slika.push({
					izdelek_ean: data.ean,
					slika_url: data.slika_mala,
					tip: "mala",
				});
			}
			if (data.slika_velika) {
				this.slika.push({
					izdelek_ean: data.ean,
					slika_url: data.slika_velika,
					tip: "velika",
				});
			}
			if (data.dodatne_slike.length) {
				data.dodatne_slike.forEach((el) => {
					this.slika.push({
						izdelek_ean: data.ean,
						slika_url: el,
						tip: "dodatna",
					});
				});
			}
		});
	}

	formatZaloga(zaloga) {
		return zaloga > 0 ? "Na zalogi" : "Ni na zalogi";
	}

	executeAll() {
		this.createDataObject();
		this.sortCategories();
		this.splitDodatneLastnosti();
		this.processLastnosti();
		this.splitSlike();
		this.insertDataIntoDb();
	}
}
