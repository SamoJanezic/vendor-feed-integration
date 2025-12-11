class LiebherrAttributes {
	constructor(category, attribute) {
		this.attribute = attribute;
        this.category = category;
	}

	static defaultHandler(el) {
		return { [el['name']]: el['value'] };
	}

	static formatDimensions(value) {
		const parts = value.split("/").map(s => s.trim());
		return {
			height: parts[0] || null,
			width: parts[1] || null,
			depth: parts[2] || null,
		};
	}

	static excludeAttr(el) {
		const exclusions = ['Feature Teaser', 'Buttons', 'Asset Data']
		if (exclusions.includes(el['fmt'])) {
			return true;
		}
		if (!el['name']) return true;
		if (el['value'] === '-') return true;
	}


	formatAttributes() {


		if (this.category === "Hladilniki") {
			// console.log(this.attribute)
			// console.log('-------------------------------------------')
		}

		const attributes = {};
        const filterData = {};

		const attributeHandlers = {
			Hladilniki: {
				// Tip: el => ({}),
				"Vrsta vgradnje": el => ({ "Vrsta": el['value'] === "Možna vgradnja" ? "Vgradni" : "Samostoječi" }),
				"Razred energijske učinkovitosti": el => ({ "Energijski razred": el['value'] }),
				"Hladilna tehnologija": el => ({"No frost": el['value'] === 'NoFrost' ? 'Da' : 'Ne' }),
				"Zunanje mere: višina / širina / globina": el => ({ "Višina": LiebherrAttributes.formatDimensions(el['value'])['height'], "Širina": LiebherrAttributes.formatDimensions(el['value'])['width'] }),
				"Položaj zamrzovalnika": el => ({}),
				"Število vrat": el => ({}),
			},
			Zamrzovalniki: {
				// Tip: el => ({}),
				"Skupna prostornina": el => ({ "Prostornina": el['value'] }),
				"Razred energijske učinkovitosti": el => ({ "Energijski razred": el['value'] }),
				"Hladilna tehnologija": el => ({"No frost": el['value'] === 'NoFrost' ? 'Da' : 'Ne' }),
				"Zunanje mere: višina / širina / globina": el => ({ "Višina": LiebherrAttributes.formatDimensions(el['value'])['height'], "Širina": LiebherrAttributes.formatDimensions(el['value'])['width'] }),
			}
		}

		const handlers = attributeHandlers[this.category] || {};

		this.attribute.forEach(el => {
			if ( LiebherrAttributes.excludeAttr(el)) return;
            const id = el['name'];
            const handler = handlers[id];
            if (handler) {
				const result = handler(el);
				Object.assign(filterData, result);
			}
            Object.assign(attributes, LiebherrAttributes.defaultHandler(el));
        });

        return { attributes, filterData };
	}
}

export default LiebherrAttributes;