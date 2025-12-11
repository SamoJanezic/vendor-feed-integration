class GorenjeAttributes {
	constructor(category, attribute) {
		this.attribute = attribute;
        this.category = category;
	}

    static defaultHandler(el) {
        return { [el['title']]: el['value'] };
    }

    static parseDimensions(el) {
        // Match three numbers separated by × or x
        const match = el.value.match(/([\d.,]+)\s*[×x]\s*([\d.,]+)\s*[×x]\s*([\d.,]+)/);
        if (!match) return null;

        const width = match[1].replace(",", ".");
        const height = match[2].replace(",", ".");
        const depth = match[3].replace(",", ".");

        return {
            "Širina": `${width} cm`,
            "Višina": `${height} cm`,
            "Globina": `${depth} cm`
        };
    }

    static parseWidth(el) {
        const dims = GorenjeAttributes.parseDimensions(el);
        return dims ? { "Širina": dims["Širina"] } : null;
    }

    static parseHeight(el) {
        const dims = GorenjeAttributes.parseDimensions(el);
        return dims ? { "Višina": dims["Višina"] } : null;
    }

    static parseDepth(el) {
        const dims = GorenjeAttributes.parseDimensions(el);
        return dims ? { "Globina": dims["Globina"] } : null;
    }

    static convertInches(value) {
        if (!value) return null;
        // Match a number followed by optional space and 'in'
        const match = value.match(/([\d.,]+)\s*in/i);
        if (!match) return null;
        return `${match[1]}"`; // add double quote symbol
    }

    static extractResolution(value) {
        if (!value) return null;
        const match = value.match(/(\d{3,4}x\d{3,4})/); // matches patterns like 1920x1080
        return match ? match[1] : null;
    }

	formatAttributes() {
        if (!this.attribute || !this.attribute.length) return {};

        const attributes = {};
        const filterData = {};
		// if (this.category === "Televizije") {
		// 	console.log(this.attribute)
		// 	console.log('-------------------------------------------')
		// }

		const attributeHandlers = {
			Hladilniki: {
			    // položaj zamrzovalnika	število vrat
                "construction_type": el => ({"Vrsta": el["value"] === "Samostojni izdelek" ? "Samostoječi" : "Vgradni"}),
                "type": el => ({"Tip": el["value"].includes("Kombinirani") ? "Kombinirani": "Samo hladilnik"}),
                "energy_efficiency_class": el => ({"Energijski razred": el["value"]}),
                "nofrostplus": el => ({ "No frost": "Da" }),
                "dim-product": el => {
                    const dims = GorenjeAttributes.parseDimensions(el);
                    if (!dims) return null;

                    return {
                        "Širina": dims["Širina"],
                        "Višina": dims["Višina"]
                    };
                },
            },
			Zamrzovalniki: {
                "type": el => ({"Tip": el["value"]}),
                "volume_total_2017": el => ({"Prostornina": el["value"]}),
                "energy_efficiency_class": el => ({"Energijski razred": el["value"]}),
                "frostno": el => ({"No frost": "Da"}),
                                "dim-product": el => {
                    const dims = GorenjeAttributes.parseDimensions(el);
                    if (!dims) return null;

                    return {
                        "Širina": dims["Širina"],
                        "Višina": dims["Višina"]
                    };
                },
			},
            "Pralni stroji": {
                // Polnjenje
                "xxl-load": el => ({"Kapaciteta": el["value"]}),
                "energy_efficiency_class": el => ({"Energijski razred": el["value"]}),
                "spin_speed": el => ({"št. Obratov centrifuge": el["value"]}),
                "inverter-powerdrive-motor": el => ({"Inverter motor": "Da"}),
            },
            "Pralno sušilni stroji": {
                // Kapaciteta	Energisjki razred	centrifuga	toplotna črpalka
                "xxl-load": el => ({"Kapaciteta": el["value"]}),
                "energy_efficiency_class_wash_2017": el => ({"Energijski razred": el["value"]}),
                "spin_speed_2017": el => ({"Centrifuga": el["value"].split(/\s*\/\s*/)[0]}),
            },
            "Sušilni stroji": {
                //inverter motor	samočistilni kondenzator
                "load": el => ({"Kapaciteta": el["value"].match(/\d+\s*[a-zA-Z]+/)[0]}),
                "energy_efficiency_class": el => ({"Energijski razred": el["value"]}),
                'heat-pump': el => ({"Toplotna črpalka": "Da"}),
            },
            "Pomivalni stroji": {
                "type": el => ({"Tip": el["value"].includes("Prostostoječi") ? "Prostostoječi" : "Vgradni"}),
                "space": el => ({"Število pogrinjkov": el["value"].match(/\d+/)[0]}),
                "dim-product": el => {
                    const dims = GorenjeAttributes.parseDimensions(el);
                    if (!dims) return null;

                    return {
                        "Širina": dims["Širina"],
                        "Višina": dims["Višina"]
                    };
                },
                "overflow_protection": el => ({"Aqua Stop": "Da"}),
                "Motor": el => ({"Inverter motor": "Da"}),
                'energy_efficiency_class': el => ({"Energijski razred": el["value"]}),
            },
            "Mikrovalovne pečice": {
                'microwave-power_infra': el => ({"Žar": "Da"})
            },
            "Nape": {
                "type": el => ({"Tip": el["value"].includes("Samostojna") ? "Samostojna" : "Vgradna"}),
                'dim-product': GorenjeAttributes.parseWidth,
                'energy_class': el => ({"Energijski razred": el['value']})
            },
            "Sesalniki": {
                'Vrsta sesalnika': el => ({"Mokro sesanje": el["value"].includes("suho") ? "Ne": "Da"}),
                'nominal-load': el => ({"Vhodna moč": el["value"]}),
            },
            "Kuhinjski roboti": {
                'nominal-load': el => ({"Moč": el["value"]}),
            },
            "Kuhališča": {
                // Tip	vrsta okvirja	št. Kuhališč	širina
                "type": el => ({"Tip": el['value']}),
                "hob-frame": el => ({"Vrsta okvirja": el["value"]}),
                'cooking-cooking_areas2': el => ({"Število kuhališč": el["value"].match(/^\s*(\d+)/)[1]}),
                'dim-product': GorenjeAttributes.parseWidth,
            },
            "Pečice": {
                // Tip	čiščenje	Energijski razred	Prostornina	višina
                "type": el => ({"Tip": el['value'].includes("Vgradna") ? "Vgradna" : "Samostoječa"}),
                "pyrolityc": el => ({"Čiščenje": "Da"}),
                "energy_class": el => ({"Energijski razred": el['value']}),
                'usable-volume': el => ({"Prostornina": el['value']}),
                "dim-product": GorenjeAttributes.parseHeight,
            },
            "Štedilniki": {
                // Tip	Plošč	Prostornina	Širina
                "cooking-oven4-type": el => ({"Tip": el["value"]}),
                "dim-product": el => GorenjeAttributes.parseWidth
            },
            "Domači kino": {
                // Vrsta	Moč	Priključki
                "soundbar_output_power": el => ({"Moč": el['value']})
            },
            "Televizije": {
                // Diagonala	Ločljivost	Smart TV	Operacijski sistem	Vrsta zaslona
                "Screen_diagonal_size-inch": el => ({"Diagonala": GorenjeAttributes.convertInches(el["value"])}),
                "resolution-max": el => ({"Ločljivost": GorenjeAttributes.extractResolution(el['value'])}),
                'user_interface': el => (
                    {"Smart TV": el['value'].includes("Smart") ? "Da" : "Ne"},
                    {"Operacijski sistem": el['value']}
                ),
            }

		};

        const handlers = attributeHandlers[this.category] || {};

        this.attribute.forEach(el => {
            const id = el["code"];
            let handler = handlers[id];
            if(!handler) {
                const title = el.title?.toLowerCase();
                if (this.category === "Mikrovalovne pečice") {
                    if (title?.includes("volumen")) {
                        handler = e => ({ "Volumen": e.value.match(/\d+/)[0] }); // number only
                    }
                }
                if (this.category === "Nape") {
                    if (title ===  'Maximalni pretok zraka pri odzračevalnem načinu delovanja') {
                        handler = e => ({ "Volumen": e.value.match(/\d+/)[0] });
                    }
                }
                if (this.category === "Kuhinjski roboti") {
                    if (title === "Uporabna prostornina mešalne posode") {
                        handler = e => ({"Litraža": e.value});
                    }
                }
            }

            if (handler) {
				const result = handler(el);
				Object.assign(filterData, result);
			}
            Object.assign(attributes, GorenjeAttributes.defaultHandler(el));
        });

        return { attributes, filterData };
	}
}

export default GorenjeAttributes;