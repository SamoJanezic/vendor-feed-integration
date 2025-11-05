import { xmlParser } from "./parseController.js";
import DobaviteljController from "./DobaviteljController.js";

export default class BshController extends DobaviteljController {
	constructor(categoryMap, ...args) {
		super(...args);
		this.categoryMap = categoryMap
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
		return opisi.flatMap(
			opis => cene
			.filter(cena=> opis.PIData.EANArticleCode === cena.ean)
			.map(cena => ({ ...opis, ...cena}))
		);
		return combinedData;
	}

	keyRules(obj, product, key, idx, vrstica) {
		const field = vrstica[idx];
		const properties = product?.PIData?.PIProperties?.PIProperty || [];
		const otherData = product?.OtherData || {};

		// helper lookups
		const findPropertyByName = name =>
			properties.find(p => p?.["@_name"] === name)?.["#text"] ?? null;

		const findPropertyByDescription = desc =>
			properties.find(p => p?.["@_description"] === desc)?.["#text"] ?? null;

		// mapping of field names to their processors
		const handlers = {
			kratki_opis: () => findPropertyByName("SHORT_DESCRIPTION"),
			opis: () => findPropertyByName("LONG_DESCRIPTION"),
			slika_mala: () => otherData.LowResolutionPictureName ?? null,
			slika_velika: () => otherData.HighResolutionPictureName ?? null,
			dodatne_slike: () => {
				const assets = otherData?.Assets?.Asset ?? [];
				return assets
					.filter(a => a?.AssetProperty?.[0]?.["#text"] === "additional picture")
					.flatMap(a =>
						a.AssetProperty
							.filter(p => p?.["@_name"] === "identifier")
							.map(p => p["#text"])
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
			ppc: () => product?.ppc?.replace(",", ".") ?? null
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

		for (const [newCategory, oldCategories] of Object.entries(this.categoryMap)) {
			oldCategories.forEach(old => {
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
		this.splitSlike();
		this.insertDataIntoDb();
	}
}
