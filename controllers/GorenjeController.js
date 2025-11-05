import { xmlParser } from "./parseController.js";
import DobaviteljController from "./DobaviteljController.js";

export default class GorenjeController extends DobaviteljController {
	constructor(categoryMap, Attributes, ...args) {
		super(...args);
		this.categoryMap = categoryMap;
		this.Attributes = Attributes;
	}
	name = "gorenje";
	nodes = "mabagor.products.product";
	file = "gorenje.xml";
	encoding = "utf8";
	keys = [
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

	ignoreCategorySet = new Set([
		"Strgalo",
		"Pečniška rešetka",
		"Pekač",
		"Vodila",
		"Nastavki za izdelovanje kratkih testenin (5 različnih oblik)",
		"Komplet nastavkov in krtač",
		"Grelni predal",
		"Dekorativna vezna letev",
		"Lahko čistilni vložki",
		"Nosilec pekača",
		"Čistilnik zraka",
		"_product/type/kitchen-hood-recirculate",
		"Aparat za točenje piva",
	]);

	exceptions(param) {
		if (this.ignoreCategorySet.has(param)) {
			return true;
		}
	}

	createDataObject() {
		const data = xmlParser(this.file, this.nodes, this.encoding);

		data.forEach(el => this.getSingleData(el))
	}

	getSingleData(data) {
		const images = data?.product_assets?.images?.image;
		const imageArray = Array.isArray(images) ? images : images ? [images] : null;
		const brandAndCategory = data?.product_category_hierarchy?.child_category;
		const bacArray = Array.isArray(brandAndCategory) ? brandAndCategory : brandAndCategory ? [brandAndCategory] : null;
		const category = bacArray.find(item => item['@_category_context'] === 'product_type')?.['#text'] || null;
		const brand = bacArray.find(item => item['@_category_context'] === 'product_brand')?.['#text'] || null;

		if (this.exceptions(category)) return;

		const singleObject = {
			ean: data?.product_content?.basic_information?.product_eans?.ean,
			izdelek_ime: data?.product_content?.basic_information?.product_titles?.title,
			kratki_opis: data?.product_content?.basic_information?.product_descriptions?.short_description,
			opis: data?.product_content?.basic_information?.product_descriptions?.long_description,
			cena_nabavna: data?.product_content?.basic_information?.product_prices?.msrp,
			dealer_cena: null,
			ppc: data?.product_content?.basic_information?.product_prices?.msdp ?? null,
			davcna_stopnja: '22',
			slika_mala: imageArray?.[0]?.mobile_url || null,
			slika_velika: imageArray?.[0]?.url || null,
			dodatne_slike: imageArray?.map(img => img.url),
			dodatne_lastnosti: null,
			blagovna_znamka: brand,
			kategorija: category,
			eprel_id: null,
			zaloga: 'preveriti',
		};
		if (!singleObject.ean || !singleObject.blagovna_znamka) {
			return
		}
		this.allData.push(singleObject);
	}

	executeAll() {
		this.createDataObject();
		this.processAllData();
		this.insertDataIntoDb();
	}
}