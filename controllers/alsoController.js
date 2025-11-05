import DobaviteljController from "./DobaviteljController.js";

export default class AlsoController extends DobaviteljController {
	constructor(categoryMap, Attributes, ...args) {
		super(...args);
		this.categoryMap = categoryMap;
		this.Attributes = Attributes;
	}
	name = "also";
	nodes = "xmlData.product";
	file = "also.xml";
	encoding = "utf8";
	keys = [
		"idents.ident[2]['@_value']",
		"base.name",
		"base.longname",
		"attributes.marketingtext['#text']",
		"prices.price[0]['@_value']",
		"prices.price[1]['@_value']",
		"prices.price[2]['@_value']",
		"prices.tax['@_rate']",
		"niPodatka",
		"niPodatka",
		"pictures.picture",
		"attributes.specification",
		"base.vendor['#text']",
		"base.categoryName['#text']",
		"eprel",
		"stock.quantity['#text']",
	];

	ignoreCategorySet = new Set([
		" /  / ",
		"Garancije & storitve / Garancije & podpora / Garancija za UPS",
		"Garancije & storitve / Garancije & podpora / Garancije za prenosnike",
		"Garancije & storitve / Garancije & podpora / Garancije za PC",
		"Garancije & storitve / Garancije & podpora / Garancije za monitorje",
		"Garancije & storitve / Garancije & podpora / Printer & MFP garancije",
		"Avdio, video, monitorji & TV / Dodatki / Avdio, video adapterji & kabli",
		"Garancije & storitve / Garancije & podpora / Garancije za mrežno opremo",
		"Garancije & storitve / Garancije & podpora / Garancije za sistem konferenc",
		"Garancije & storitve / Garancije & podpora / Garancije tiskalnika velikega formata",
		"Garancije & storitve / Garancije & podpora / Garancije za skenerje",
		"Garancije & storitve / Garancije & podpora / Strežniške garancije",
		"Garancije & storitve / Garancije & podpora / Garancije za digitalno podpisovanje",
		"Garancije & storitve / Garancije & podpora / Garancije projektorjev",
		"Omrežje & Smart Home / Omrežna dodatna oprema / Omrežni & DAC kabli",
		"Izdelki za električno energijo / Akumulator / Akumulator",
		"Izdelki za električno energijo / Paneli / Paneli",
		"Periferija & dodatki / Kabli & adapterji / Adapterji",
		"Periferija & dodatki / Kabli & adapterji / Kabli - Drugi",
		"Periferija & dodatki / Kabli & adapterji / Kabli - Ključavnice",
		"Periferija & dodatki / Kabli & adapterji / Kabli - Napajanje",
		"Periferija & dodatki / Kabli & adapterji / Kabli - USB & Thunderbolt",
		"Periferija & dodatki / Kabli & adapterji / USB razdelilci",
		"Komponente / Krmilniki / Adapterji (HBA)",
		"Avdio, video, monitorji & TV / Dodatki / Filtri zasebnosti",
		"Avdio, video, monitorji & TV / Dodatki / Avdio & video dodatki",
		"Avdio, video, monitorji & TV / Dodatki / Kamere, Droni, Spletne kamere - Baterije",
		"Komponente / Dodatki za komponente / Dodatki za shranjevanje",
		"Tiskanje, optično branje & potrošni mat. / Tiskalniki velikega formata (LFP) / Dodatna oprema za velike formate",
		"Tiskanje, optično branje & potrošni mat. / Tiskalniki, optični bralnik, dodatna opr / Stojala",
		"Tiskanje, optično branje & potrošni mat. / Tiskalniki, optični bralnik, dodatna opr / Dodatki za matrične tiskalnike",
		"Tiskanje, optično branje & potrošni mat. / Kopiranje & faks / Oprema za kopiranje in telefaks",
		"Tiskanje, optično branje & potrošni mat. / Tiskalniki, optični bralnik, dodatna opr / Napajalniki",
		"Prenosniki, PC & Tablični računalniki / Dodatki / Napajalniki za prenosne računalnike",
		"Avdio, video, monitorji & TV / Televizorji / Dodatki za televizorje",
		"Garancije & storitve / Garancije & podpora / Garancije za tablične računalnike",
		"Komponente / Ventilatorji & hladilni sistemi / Fanless ventilatorji & hladilniki",
		"Izobraževanje / Predstavitev EDU / Dodatna oprema za predstavitv EDU",
		"Strežniki, diskovna polja & UPS / Dodatki / PDU dodatke",
		"Komponente / Krmilniki / Drugi krmilniki",
		"Omrežje & Smart Home / Mrežna oprema / Stikala - ohišja",
		"Telefonija & Pametne naprave / Stacionarni telefoni / Fiksni telefon, IP & PBX",
		"Garancije & storitve / Garancije & podpora / ZZ - Druga garancija & podpora",
	]);

	getNestedValue(obj, path) {
		try {
			const parts = path
				.replace(/\[(\d+)\]/g, ".$1")
				.replace(/\['([^']+)'\]/g, ".$1")
				.split(".")
				.filter(Boolean);

			return parts.reduce((acc, key) => {
				if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
					return acc[key];
				}
				return undefined;
			}, obj);
		} catch {
			return undefined;
		}
	}

	keyRules(obj, product, key, idx, vrstica) {
		const value =
			key === "niPodatka" ? null : this.getNestedValue(product, key);

		if (vrstica[idx] === "zaloga") {
			obj[vrstica[idx]] = this.formatZaloga(value);
		} else if (key === "niPodatka" || value === "" || value === undefined) {
			obj[vrstica[idx]] = null;
		} else {
			obj[vrstica[idx]] = value;
		}
		return obj;
	}

	exceptions(param) {
		if (!param?.idents?.ident[2]["@_value"]) {
			return true;
		}
		if (
			(param.prices.price[0]["@_value"] ||
				param.prices.price[1]["@_value"] ||
				param.prices.price[2]["@_value"]) === "0"
		) {
			return true;
		}
		if (
			this.ignoreCategorySet.has(param["base"]["categoryName"]["#text"])
		) {
			return true;
		}
		if (param["@_id"] === "23370") {
			return true;
		}
	}

	formatZaloga(zaloga) {
		return zaloga !== "0 kos" ? "Na zalogi" : "Ni na zalogi";
	}

	processImages(data) {
		const slike = [];

		if (data.dodatne_slike?.[0]) {
			const dodatneSlike = Array.isArray(data.dodatne_slike[0])
				? data.dodatne_slike[0]
				: data.dodatne_slike;

			slike.push(	...dodatneSlike.map((el, idx) => ({
					izdelek_ean: data.ean,
					slika_url: el["@_link"],
					tip: idx === 0 ? "mala" : "dodatna",
				}))
			);
		}

		return slike;
	}
}
