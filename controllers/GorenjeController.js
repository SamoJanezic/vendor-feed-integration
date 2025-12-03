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
        const dataFeatures = xmlParser(this.file,'mabagor.features.feature' , this.encoding)
        // console.log(features)
        // data.forEach(el => console.log(el.product_content.basic_information.tech_specs))
		data.forEach(el => this.getSingleData(el, dataFeatures))
	}

	getSingleData(data, features) {
        let opis;
        if(data?.product_content?.features?.feature) {
            opis = this.createOpis(data.product_content.features.feature, features);
        }
		const images = data?.product_assets?.images?.image;
		const imageArray = Array.isArray(images) ? images : images ? [images] : null;
		const brandAndCategory = data?.product_category_hierarchy?.child_category;
		const bacArray = Array.isArray(brandAndCategory) ? brandAndCategory : brandAndCategory ? [brandAndCategory] : null;
		const category = bacArray.find(item => item['@_category_context'] === 'product_type')?.['#text'] || null;
		const brand = bacArray.find(item => item['@_category_context'] === 'product_brand')?.['#text'] || null;
        const specifications = this.extractSpecifications(data);

		if (this.exceptions(category)) return;

		const singleObject = {
			ean: data?.product_content?.basic_information?.product_eans?.ean,
			izdelek_ime: data?.product_content?.basic_information?.product_titles?.title,
			kratki_opis: data?.product_content?.basic_information?.product_descriptions?.short_description,
			opis: opis,
			cena_nabavna: null, //data?.product_content?.basic_information?.product_prices?.msrp,
			dealer_cena: null,
			ppc: data?.product_content?.basic_information?.product_prices?.msdp ?? null,
			davcna_stopnja: '22',
			slika_mala: imageArray?.[0]?.mobile_url || null,
			slika_velika: imageArray?.[0]?.url || null,
			dodatne_slike: imageArray?.map(img => img.url),
			dodatne_lastnosti: specifications,
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

    extractSpecifications(product) {
        const allSpecs = [];
        const techSpecsPaths = [
            product?.product_content?.basic_information?.tech_specs,
            product?.product_content?.tech_specs
        ];

        const safeText = textObj => {
            if (!textObj) return "";
            if (typeof textObj === "string") return textObj;
            return textObj["#text"] || "";
        };

        for (const techSpecs of techSpecsPaths) {
            if (!techSpecs?.specificationgroup) continue;

            const groups = Array.isArray(techSpecs.specificationgroup)
                ? techSpecs.specificationgroup
                : [techSpecs.specificationgroup];

            for (const group of groups) {
                const groupLabel = group['@_label'] || group['@_id'] || null;
                const specs = Array.isArray(group.specification)
                    ? group.specification
                    : [group.specification];

                for (const spec of specs) {
                    allSpecs.push({
                        id: spec['@_id'],
                        code: spec['@_code_id'] || spec['@_compoundcode_id'] || null,
                        title: safeText(spec.title),
                        value: safeText(spec.value),
                        unit: spec.unit || null,
                        group: groupLabel
                    });
                }
            }
        }

        return allSpecs;
    }

    createOpis(productFeatures, allFeatures) {
        // console.log(productFeatures)
        const featuresArray = Array.isArray(productFeatures)
            ? productFeatures
            : productFeatures
            ? [productFeatures]
            : [];
        const idSet = new Set(featuresArray.map(el => el['@_id']))
        const matchedFeatures = allFeatures.filter(feat => idSet.has(feat['@_id']));
        const productDescription = matchedFeatures.map(f => {
            const subtitle = f.subtitle?.trim() || '';
            const longdesc = f.longdesc?.trim() || '';
            return `<h3>${subtitle}</h3>\n<p>${longdesc}</p>`;
        }).join('\n');
        return productDescription;
    }

	executeAll() {
		this.createDataObject();
		this.processAllData();
		this.insertDataIntoDb();
	}
}