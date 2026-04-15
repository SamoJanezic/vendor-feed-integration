import dobaviteljController from "./DobaviteljController.ts";
import { excelParser } from "./parseController.js";

export default class LiebherrController extends dobaviteljController {
	constructor(categoryMap, Attributes, ...args) {
		super(...args);
		this.categoryMap = categoryMap;
		this.Attributes = Attributes;
	}
	name = "liebherr";
	nodes = "Export.LeaveNode.LeaveNode";
	file = "liebherr.xml";
	encoding = "utf8";

	exceptions(param) {
		const ignoreCategory = [];
	}

	async createDataObject() {
		const leaveNodes = this.getData()?.[1]?.LeaveNode ?? [];
		const prices = await excelParser("./xml/cenikliebherr2025.xlsx");
		const promoPrices = await excelParser(
			"./xml/cenikliebherr2025promocija.xlsx"
		);

		const flatData = leaveNodes
			.flatMap((node) => node.LeaveNode || [])
			.map((node) => node.Appliance)
			.filter(Boolean)
			.flat();

		flatData.forEach((product) => {
			this.keyRules(product, prices, promoPrices);
		});
	}

	keyRules(prod, prices, promoPrices) {
		const eprel = this.getEprel(prod);
		const images = this.getImages(prod.FMT);
		const ean = this.getEan(prod);
		const price = prices.filter(
			(p) => String(p["Matični podatki//EAN-št"]) === String(ean)
		)[0];
		const promoPrice = promoPrices.filter(
			(p) => String(p["EAN-št"]) === String(ean)
		)[0];
		const attributes = this.extractAttributes(prod);

		if (!price && !promoPrice) return;

		const defaults = {
			dealer_cena: null,
			davcna_stopnja: 22,
			blagovna_znamka: "Liebherr",
			zaloga: "preveriti",
		};

		this.allData.push({
			...defaults,
			ean: ean,
			izdelek_ime: prod["@_name"],
			kratki_opis:
				promoPrice?.["opis izdelka"] ?? price?.["Opis aparata"],
			opis: promoPrice?.["opis izdelka"] ?? price?.["Opis aparata"],
			cena_nabavna:
				(promoPrice?.[
					"Promocijska priporočena maloprodajna cena brez DDV"
				] ?? price?.["Priporočena maloprodajna cena brez DDV"]).toFixed(2),
			ppc:
				(promoPrice?.[
					"Promocijska priporočena maloprodajna cena z DDV"
				] ?? price?.["Priporočena maloprodajna cena z DDV"]).toFixed(2),
			slika_mala: images[0],
			slika_velika: images[1] || images[0],
			dodatne_slike: images,
			dodatne_lastnosti: attributes,
			kategorija: prod["@_type"],
			eprel_id: eprel.length ? eprel : null,
		});
	}

	getEan(parsedXml) {
		const fmtArray = Array.isArray(parsedXml.FMT)
			? parsedXml.FMT
			: [parsedXml.FMT];

		let gtin = null;

		for (const fmt of fmtArray) {
			const groups = Array.isArray(fmt.AttributeGroup)
				? fmt.AttributeGroup
				: [fmt.AttributeGroup];
			for (const group of groups) {
				if (!group || !group.Attribute) continue;
				const attributes = Array.isArray(group.Attribute)
					? group.Attribute
					: [group.Attribute];
				for (const attr of attributes) {
					if (attr["@_name"] === "GTIN") {
						gtin = attr.Value;
						break;
					}
				}
				if (gtin) break;
			}
			if (gtin) break;
		}
		return gtin;
	}

	getImages(fmtArray) {
		if (!Array.isArray(fmtArray)) {
			console.warn("Expected an array of FMT blocks");
			return [];
		}

		const assetDataBlock = fmtArray.find(
			(f) => f["@_name"] === "Asset Data"
		);
		if (!assetDataBlock || !assetDataBlock.AttributeGroup) {
			console.warn("Asset Data block not found or has no AttributeGroup");
			return [];
		}

		const groups = Array.isArray(assetDataBlock.AttributeGroup)
			? assetDataBlock.AttributeGroup.filter(Boolean)
			: [assetDataBlock.AttributeGroup];

		const galleryGroup = groups.find(
			(g) => g["@_name"] === "product_gallery"
		);
		if (!galleryGroup || !galleryGroup.Attribute) {
			console.warn("product_gallery not found in Asset Data");
			return [];
		}

		const attributes = Array.isArray(galleryGroup.Attribute)
			? galleryGroup.Attribute.filter(Boolean)
			: [galleryGroup.Attribute];

		return attributes.map((attr) => attr.FormattedValue).filter(Boolean);
	}

	getEprel(fmt) {
		if (!fmt?.FMT) return [];

		const assetDataGroup = fmt.FMT.find(
			(g) => g["@_id"] === "2" && g["@_name"] === "Asset Data"
		);
		if (!assetDataGroup || !Array.isArray(assetDataGroup.AttributeGroup))
			return [];

		const productDatasheets = assetDataGroup.AttributeGroup.find(
			(g) => g["@_name"] === "product_datasheets"
		);
		if (!productDatasheets || !productDatasheets.Attribute) return [];

		const attrs = Array.isArray(productDatasheets.Attribute)
			? productDatasheets.Attribute
			: [productDatasheets.Attribute];

		const ids = [];
		attrs.forEach((item) => {
			const attr = item.Attribute || item;
			if (attr["@_name"] === "eu_product_fiche") {
				ids.push(attr["@_id"]);
			}
		});
		return ids[0];
	}

	extractAttributes(xmlData) {
		const result = [];

		const fmtArray = Array.isArray(xmlData.FMT)
			? xmlData.FMT
			: [xmlData.FMT];

		for (const fmt of fmtArray) {
			if (!fmt) continue;

			const fmtName = fmt["@_name"] || "Unknown FMT";
			const groups = Array.isArray(fmt.AttributeGroup)
				? fmt.AttributeGroup
				: [fmt.AttributeGroup];

			for (const group of groups) {
				if (!group) continue;

				const groupName = group["@_name"] || "Unknown Group";
				if (!group.Attribute) continue;

				const attrs = Array.isArray(group.Attribute)
					? group.Attribute
					: [group.Attribute];

				for (const attr of attrs) {
					if (!attr || !attr["@_name"]) continue;

					const entry = {
						fmt: fmtName,
						group: groupName,
						name: attr["@_name"],
						value: null,
					};

					if (attr.Title && attr.Text) {
						entry.value = { title: attr.Title, text: attr.Text };
					} else if (attr.Value) {
						entry.value = attr.Value;
					} else if (attr.FormattedValue) {
						entry.value = attr.FormattedValue;
					}

					result.push(entry);
				}
			}
		}
		return result;
	}

	async executeAll() {
		await this.createDataObject();
		this.processAllData();
		this.insertDataIntoDb();
	}
}
