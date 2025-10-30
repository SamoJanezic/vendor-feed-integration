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

		const attributeHandlers = {
			Hladilniki: {
				Tip: el => ({}),
				"Vrsta vgradnje": el => ({ "Vrsta": el['value'] === "Možna vgradnja" ? "Vgradni" : "Samostoječi" }),
				Vrsta: el => ({}),
				"Razred energijske učinkovitosti": el => ({ "Energijski razred": el['value'] }),
				"Hladilna tehnologija": el => ({"No frost": el['value'] === 'NoFrost' ? 'Da' : 'Ne' }),
				"Zunanje mere: višina / širina / globina": el => ({ "Višina": LiebherrAttributes.formatDimensions(el['value'])['height'], "Širina": LiebherrAttributes.formatDimensions(el['value'])['width'] }),
				"Položaj zamrzovalnika": el => ({}),
				"Število vrat": el => ({}),
			},
			Zamrzovalniki: {
				Tip: el => ({}),
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
            const result = handler ? handler(el) : LiebherrAttributes.defaultHandler(el);
            Object.assign(attributes, result);
        });
		// console.log(attributes)
        return attributes;
	}
}

export default LiebherrAttributes;