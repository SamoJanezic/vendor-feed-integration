import { db } from "../db/db.js";
import { xmlParser } from "./parseController.js";
import { insertIntoTable } from "../db/sql.js";
import { modelsMap } from "../models/index.js";
import "../models/associations.js";

export default class DobaviteljController {
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
	allData = [];
	komponenta = null;
	atribut = null;
	slika = null;

	escapeXml(str) {
		return str
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&apos;");
	}

	getData() {
		if (typeof this.file === "object") {
			return this.file.map((el) => {
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
        } catch (err) {
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

		getData.forEach((product) => {
			let newObj = {};

			if (this.exceptions(product)) {
				return;
			}

			this.keys.forEach((key, idx) =>
				this.keyRules(newObj, product, key, idx, vrstica)
			);
			this.allData.push(newObj);
		});
	}

	keyRules(obj, product, key, idx, vrstica) {
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
			obj[vrstica[idx]] = null;
		} else if (typeof product[key] === "object") {
			obj[vrstica[idx]] = this.parseObject(product[key]);
		} else {
			obj[vrstica[idx]] = product[key];
		}
		return obj;
	}

	flattenCategoryMap(categoryMap) {
		if (!categoryMap) return {};
		return Object.entries(categoryMap).reduce(
			(acc, [newCategory, oldCategories]) => {
				oldCategories.forEach((old) => (acc[old] = newCategory));
				return acc;
			},
			{}
		);
	}

	processCategory(data, flatCategoryMap) {
		let kategorija = data.kategorija;
		let dodatne_lastnosti = data.dodatne_lastnosti
			? JSON.parse(JSON.stringify(data.dodatne_lastnosti))
			: [];

		const newCat = flatCategoryMap[kategorija];
		if (newCat) {
			if (
				this.name === "asbis" &&
				newCat === "Usmerjevalniki, stikala in AP" &&
				this.routerTypes[kategorija] &&
				Array.isArray(dodatne_lastnosti)
			) {
				dodatne_lastnosti.push({
					"@_Name": "Vrsta",
					"@_Value": this.routerTypes[kategorija],
				});
			}
			kategorija = newCat;
		}

		return { ...data, kategorija, dodatne_lastnosti };
	}

	processLastnosti(data) {
		let lastnosti = [
			{
				ean: data.ean,
				kategorija: data.kategorija,
				lastnostNaziv: "Proizvajalec",
				lastnostVrednost: data.blagovna_znamka,
			},
		];

		const attrs = new this.Attributes(
			data.kategorija,
			Array.isArray(data.dodatne_lastnosti?.lastnost)
				? data.dodatne_lastnosti.lastnost
				: data.dodatne_lastnosti
		).formatAttributes();

		if (attrs && Object.keys(attrs).length) {
			lastnosti.push(
				...Object.entries(attrs).map(([naziv, vrednost]) => ({
					ean: data.ean,
					kategorija: data.kategorija,
					lastnostNaziv: naziv,
					lastnostVrednost: vrednost,
				}))
			);
		}
		return lastnosti;
	}

	mapKomponentaAndAtribut(lastnosti) {
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

	processImages(data) {
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
				...dodatneSlike.map((el) => ({
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

		const { slike, lastnosti } = this.allData.reduce(
			(acc, rawData) => {
				const updated = this.processCategory(rawData, flatCategoryMap);
				rawData.kategorija = updated.kategorija;
				if (typeof rawData.kratki_opis === "string")
					rawData.kratki_opis = rawData.opis
						? rawData.opis.substring(0, 100)
						: null;
				acc.slike.push(...this.processImages(updated || []));
				acc.lastnosti.push(...(this.processLastnosti(updated) || []));
				return acc;
			},
			{ slike: [], lastnosti: [] }
		);

		const { komponenta, atribut } = this.mapKomponentaAndAtribut(lastnosti);

		Object.assign(this, {
			slika: slike,
			komponenta,
			atribut,
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
		const kategorijaData = this.allData.map((el) => {
			return { kategorija: el.kategorija, marza: 0 };
		});

		return {
			izdelekData: izdelekData,
			izdelekDobaviteljData: izdelekDobaviteljData,
			kategorijaData: kategorijaData,
		};
	}

	async insertDataIntoDb() {
		const { izdelekData, izdelekDobaviteljData, kategorijaData } = this.prepareDbData();

        
		db.sync();
		await insertIntoTable(modelsMap.Dobavitelj, { dobavitelj: this.name });
		await insertIntoTable(modelsMap.Izdelek, izdelekData);
		await insertIntoTable(modelsMap.Kategorija, kategorijaData);
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
	}

	executeAll() {
		this.createDataObject();
		this.processAllData();
		this.insertDataIntoDb();
	}
}
