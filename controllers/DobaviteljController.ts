import { db } from "../db/db.js";
import { xmlParser } from "./parseController.js";
import { insertIntoTable } from "../db/sql.js";
import { modelsMap } from "../Models/index.js";
import { categoryLookup, filterLookup } from "../services/filters/filterIdMap.ts";
import "../Models/associations.js";



export default abstract class DobaviteljController {
	file: any;
	nodes: any;
	encoding?: string;
	keys!: string[];

	vrstice = [
		"ean",
		"izdelek_ime",
		"kratki_opis",
		"opis",
		"cena_nabavna",
		"dealer_cena",
		"ppc",
		"davcna_stopnja",
		"slika_mala",
		"slika_velika",
		"dodatne_slike",
		"dodatne_lastnosti",
		"blagovna_znamka",
		"kategorija",
		"eprel_id",
		"zaloga",
	];
	allData: Record<string, any>[] = [];
	komponenta = null;
	atribut = null;
	slika = null;
	filtri = null;

	abstract name: string;

	abstract categoryMap: Record<string, string[]>;

	abstract Attributes: any;

	abstract combineData(): any;

	abstract exceptions(product: any): boolean;

	abstract getEprel(value: string): string;

	abstract formatZaloga(value: string): number;

	abstract parseObject(value: any): any;

	escapeXml(str: string) {
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&apos;");
	}

	getData() {
		if (typeof this.file === "object") {
			return this.file.map((el: { fileName: string; node: string }) => {
				if (!el?.fileName || !el?.node) {
					console.warn("Skipping invalid file entry:", el);
					return null;
				}
				return xmlParser(el.fileName, el.node);
			});
		}
		try {
			const data = xmlParser(this.file, this.nodes, this.encoding);
			return data;
		} catch (err: any) {
			console.error("Error parsing XML file:", err.message);
			return null;
		}
	}

	createDataObject() {
		let vrstica = this.vrstice;
		let getData = this.getData();

		if (typeof this.file === "object") {
			getData = this.combineData();
		}

		getData.forEach((product: any) => {
			let newObj: Record<string, any> = {};

			if (this.exceptions(product)) {
				return;
			}

			this.keys.forEach((key: string, idx: number) =>
				this.keyRules(newObj, product, key, idx, vrstica)
			);
			this.allData.push(newObj);
		});
	}

	keyRules(obj: any, product: any, key: string, idx: number, vrstica: string[]) {
		if (vrstica[idx] === "eprel_id") {
			if (typeof this.getEprel === "function") {
				obj[vrstica[idx]] = this.getEprel(product[key]);
			}
		} else if (vrstica[idx] === "zaloga") {
			obj[vrstica[idx]] = this.formatZaloga(product[key]);
		} else if (
			key === "niPodatka" ||
			product[key] === "" ||
			!product[key]
		) {
			obj[vrstica[idx]!] = null;
		} else if (typeof product[key] === "object") {
			obj[vrstica[idx]!] = this.parseObject(product[key]);
		} else {
			obj[vrstica[idx]!] = product[key];
		}
		return obj;
	}

	flattenCategoryMap(categoryMap: Record<string, string[]>): Record<string, string> {
		if (!categoryMap) return {};
		return Object.entries(categoryMap).reduce<Record<string,string>>(
			(acc, [newCategory, oldCategories]) => {
				oldCategories.forEach((old) => (acc[old] = newCategory));
				return acc;
			},
			{}
		);
	}

	processCategory(data: Record<string, any>, flatCategoryMap: Record<string, string>) {
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

	processLastnosti(data: any) {
		const catId = categoryLookup[data.kategorija];
		if (!catId) {
			console.warn("Missing category:", data.kategorija);
		}

		const lookup = filterLookup[catId!] || {};


		let filtri = [];
		let lastnosti = [];

		if (lookup["Proizvajalec"]) {
			filtri.push({
				izdelek_ean: data.ean,
				filter_id: lookup["Proizvajalec"]?.toUpperCase() ?? null,
				filter_vrednost: data.blagovna_znamka,
			});
		}

		const {attributes, filterData}  = new this.Attributes(
			data.kategorija,
			Array.isArray(data.dodatne_lastnosti?.lastnost)
				? data.dodatne_lastnosti.lastnost
				: data.dodatne_lastnosti
		).formatAttributes() || { filterData: {}, attributes: {} };

		if (filterData && Object.keys(filterData).length) {
			filtri.push(
				...Object.entries(filterData).map(([naziv, vrednost]) => ({
					izdelek_ean: data.ean,
					filter_id: lookup[naziv] ?? null,
					filter_vrednost: vrednost,
				}))
			);
		}

		if (attributes && Object.keys(attributes).length) {
			lastnosti.push(
				...Object.entries(attributes).map(([naziv, vrednost]) => ({
					ean: data.ean,
					kategorija: data.kategorija,
					lastnostNaziv: naziv,
					lastnostVrednost: vrednost,
				}))
			);
		}

        // console.log(filtri)
        // filtri.forEach(el => {
        //     if(!el.filter_id) {
        //         console.log(el, data.kategorija)
        //     }
        // })

        // console.log(lastnosti)
        // console.log("attrs from Attributes.formatAttributes:", { filterData, attributes });
        // process.exit();

		return {lastnosti, filtri};
	}

	mapKomponentaAndAtribut(lastnosti: any) {
		const komponenta = [];
		const atribut = [];
		for (const el of lastnosti) {
			const cleanedNaziv = this.escapeXml(
				el.lastnostNaziv.replace(/:/g, "")
			);
			komponenta.push({
				KATEGORIJA_kategorija: el.kategorija,
				komponenta: cleanedNaziv,
			});
			atribut.push({
				izdelek_ean: el.ean,
				KOMPONENTA_komponenta: cleanedNaziv,
				atribut: el.lastnostVrednost,
			});
		}
		return { komponenta, atribut };
	}

	processImages(data: any) {
		const slike = [
			data.slika_mala ?? {
				izdelek_ean: data.ean,
				slika_url: data.slika_mala,
				tip: "mala",
			},
			data.slika_velika ?? {
				izdelek_ean: data.ean,
				slika_url: data.slika_velika,
				tip: "velika",
			},
		];

		if (data.dodatne_slike?.[0]) {
			const dodatneSlike = Array.isArray(data.dodatne_slike[0])
				? data.dodatne_slike[0]
				: data.dodatne_slike;

			slike.push(
				...dodatneSlike.map((el: any) => ({
					izdelek_ean: data.ean,
					slika_url: el,
					tip: "dodatna",
				}))
			);
		}

		return slike;
	}

	processAllData() {
		const flatCategoryMap = this.flattenCategoryMap(this.categoryMap);

		const { slike, lastnosti, filtri } = this.allData.reduce(
			(acc, rawData) => {
				const updated = this.processCategory(rawData, flatCategoryMap);
				rawData.kategorija = updated.kategorija;

				if (typeof rawData.kratki_opis === "string") {
					rawData.kratki_opis = rawData.opis
						? rawData.opis.substring(0, 100)
						: null;
				}

				acc.slike.push(...this.processImages(updated || []));
				acc.lastnosti.push(...(this.processLastnosti(updated).lastnosti || []));
				acc.filtri.push(...(this.processLastnosti(updated).filtri || []));
				return acc;
			},
			{ slike: [], lastnosti: [], filtri: [] }
		);

		const { komponenta, atribut } = this.mapKomponentaAndAtribut(lastnosti);
		Object.assign(this, {
			slika: slike,
			komponenta,
			atribut,
			filtri,
		});
	}

	prepareDbData() {
		const izdelekData = this.allData.map((el) => {
			return {
				ean: el.ean,
				eprel: el.eprel_id,
				davcna_stopnja: 22,
				blagovna_znamka: el.blagovna_znamka
					? this.escapeXml(el.blagovna_znamka)
					: null,
			};
		});
		const izdelekDobaviteljData = this.allData.map((el) => {
			return {
				izdelek_ean: el.ean,
				izdelek_ime: el.izdelek_ime,
				KATEGORIJA_kategorija: el.kategorija,
				DOBAVITELJ_dobavitelj: this.name,
				izdelek_opis: el.opis,
				izdelek_kratki_opis: el.kratki_opis,
				nabavna_cena: el.cena_nabavna,
				dealer_cena: el.dealer_cena,
				ppc: el.ppc,
				zaloga: el.zaloga,
				aktiven: 1,
			};
		});

		return {
			izdelekData: izdelekData,
			izdelekDobaviteljData: izdelekDobaviteljData,
		};
	}

	async insertDataIntoDb() {
		const { izdelekData, izdelekDobaviteljData } = this.prepareDbData();
        // console.log(this.atribut)
        // process.exit()
		db.sync();
		await insertIntoTable(modelsMap.Dobavitelj, { dobavitelj: this.name });
		await insertIntoTable(modelsMap.Izdelek, izdelekData);
		await insertIntoTable(
			modelsMap.IzdelekDobavitelj,
			izdelekDobaviteljData
		);
		if (this.slika) {
			await insertIntoTable(modelsMap.Slika, this.slika);
		}
		if (
			this.komponenta &&
			Object.keys(this.komponenta).length > 0 &&
			this.atribut &&
			Object.keys(this.atribut).length > 0
		) {
			await insertIntoTable(modelsMap.Komponenta, this.komponenta);
			await insertIntoTable(modelsMap.Atribut, this.atribut);
		}
		if (this.filtri && Object.keys(this.filtri).length) {
			await insertIntoTable(modelsMap.IzdelekFilter, this.filtri);
		}
	}

	executeAll() {
		this.createDataObject();
		this.processAllData();
		this.insertDataIntoDb();
	}
}
