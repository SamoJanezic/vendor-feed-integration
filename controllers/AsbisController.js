import DobaviteljController from "./DobaviteljController.js";

export default class AsbisController extends DobaviteljController {
	constructor(categoryMap, Attributes, ...args) {
		super(...args);
		this.categoryMap = categoryMap;
		this.Attributes = Attributes;
	}
	name = "asbis";
	file = [
		{ fileName: "asbis1.xml", node: "ProductCatalog.Product" },
		{ fileName: "asbis2.xml", node: "CONTENT.PRICES.PRICE" },
	];
	encoding = "utf8";
	keys = [
		"EAN",
		"ProductDescription",
		"niPodatka",
		"niPodatka",
		"niPodatka",
		"MY_PRICE",
		"RETAIL_PRICE",
		"niPodatka",
		"SMALL_IMAGE",
		"Image",
		"Images",
		"AttrList",
		"Vendor",
		"ProductType",
		"niPodatka",
		"AVAIL",
	];

	exceptions(product) {
		const ignoreCategory = [
            "Mobilna telefonija",
            "Medijski predvajalniki",
            "VC Headsets",
			"Various Accessories",
			"Wireless Charger",
			"Power Battery Charger",
			"Mounting Hardware",
			"Car Accessories",
			"Pc Mobile Accessories",
			"Avtomobilski video snemalnik",
			"Cables USB",
			"Cable",
			"Power Adapter",
			"Controller Card",
			"Bluetooth Adapter",
			"USB Hub",
			"Multiboard",
			"IDS Totem",
			"Networking - Cables",
			"Žari",
			"Nega las",
			"Čistilci na tlak in metle",
			"Priprava kave in čaja",
			"Pripomočki za osebno nego",
			"IPad Accessories",
			"HDD Cabinet",
			"HDD/SSD Enclosure",
			"Intercom Panel",
			"Antenna",
			"Networking - Accessories",
			"Networking - Cloud Keys & Gateways - Cloud Key Enterprise",
			"Network Management Module",
			"Network Interface Card",
			"Networking - Range Extender",
			"PC Barebone",
			"PC NetTop",
			"Server Desktop",
			"Main Board Server",
			"Acc - Dental care",
			"Ščetke za zobe",
			"Čistilci na tlak in metle",
			"Pripomočki za osebno nego",
			"Networked Storage Device",
			"VC Docks",
			"Smart Tracker",
		];
		if (ignoreCategory.includes(product.ProductType)) {
			return true;
		}
		if (
			!product.EAN ||
			product.EAN.length < 5 ||
			!product.AVAIL ||
			product.AVAIL === "" ||
			product.AVAIL === " "
		) {
			return true;
		}
		// return true;
	}

	sortCategories() {
		// Special handling for "Usmerjevalniki, stikala in AP" (add Vrsta attribute)
		const routerTypes = {
			"Networking - Router": "Usmerjevalnik",
			"Networking - Transceiver": "Usmerjevalnik",
			"Networking - Wireless Outdoor Access Point": "Dostopna točka",
			"Networking - Wireless Access Point": "Dostopna točka",
			"Network Switch": "Stikalo"
		};

		const flatCategoryMap = {};
		for (const [newCategory, oldCategories] of Object.entries(this.categoryMap)) {
			oldCategories.forEach(old => {
				flatCategoryMap[old] = newCategory;
			});
		}

		this.allData.forEach((el) => {
			const newCat = flatCategoryMap[el.kategorija];
			if (newCat) {
				// Special logic for Usmerjevalniki, stikala in AP
				if (newCat === "Usmerjevalniki, stikala in AP" && routerTypes[el.kategorija] && el.dodatne_lastnosti) {
					el.dodatne_lastnosti.push({ "@_Name": "Vrsta", "@_Value": routerTypes[el.kategorija] });
				}
				el.kategorija = newCat;
			}
		});
	}

	combineData() {
		const combinedData = [];
		const opisi = this.getData()[0];
		const cene = this.getData()[1];
		opisi.forEach((opis) => {
			cene.forEach((cena) => {
				if (opis.ProductCode === cena.WIC) {
					combinedData.push({ ...opis, ...cena });
				}
			});
		});
		return combinedData;
	}

	parseObject(obj) {
		if (obj.element?.length) {
			return obj.element;
		}
		return Object.values(obj);
	}

	formatZaloga(zaloga) {
		return zaloga > 0 ? "Na zalogi" : "Ni na zalogi";
	}

	splitDodatneLastnosti() {
		let lastnosti = [];

		this.allData.forEach((data) => {
					lastnosti.push({ean: data.ean, kategorija: data.kategorija, lastnostNaziv: 'Proizvajalec', lastnostVrednost: data.blagovna_znamka});
					const Attributes = new this.attribute(data.kategorija, data.dodatne_lastnosti);
					const attrs = Attributes.formatAttributes()
					if (attrs !== null && Object.keys(attrs).length !== 0) {
						for (const el in attrs) {
							lastnosti.push({ean: data.ean, kategorija: data.kategorija, lastnostNaziv: el, lastnostVrednost: attrs[el]});
						}
					}
					this.komponenta = lastnosti.map(el => { return {KATEGORIJA_kategorija: el.kategorija, komponenta: this.escapeXml(el.lastnostNaziv.replace(/:/g, ''))}});
					this.atribut = lastnosti.map(el => { return {izdelek_ean: el.ean, KOMPONENTA_komponenta:el.lastnostNaziv, atribut: el.lastnostVrednost}});
				});
	}

	splitSlike() {
		let slike = [];
		this.allData.forEach((data) => {
			slike.push({
				izdelek_ean: data.ean,
				slika_url: data.slika_mala,
				tip: "mala",
			});
			slike.push({
				izdelek_ean: data.ean,
				slika_url: data.slika_velika,
				tip: "velika",
			});
			if (data.dodatne_slike?.[0]) {
				if (typeof data.dodatne_slike[0] === "object") {
					data.dodatne_slike[0].forEach((el) => {
						slike.push({
							izdelek_ean: data.ean,
							slika_url: el,
							tip: "dodatna",
						});
					});
				} else {
					data.dodatne_slike.forEach((el) => {
						slike.push({
							izdelek_ean: data.ean,
							slika_url: el,
							tip: "dodatna",
						});
					});
				}
			}
		});
		this.slika = slike;
	}

	// executeAll() {
	// 	this.createDataObject();
	// 	this.sortCategories();
	// 	this.splitSlike();
	// 	this.splitDodatneLastnosti();
	// 	this.insertDataIntoDb();
	// }
}
