class BshAttributes {
	constructor(category, attribute) {
		this.attribute = attribute;
        this.category = category;
	}

    static defaultHandler(el) {
		return { [el["@_description"]]: el["#text"] };
	}

	formatAttributes() {
        if (!this.attribute || !this.attribute.length) return null;
		const attributes = {};
        const filterData = {};
        // if (this.category === "Štedilniki") {
        //     console.log(this.attribute);
        //     console.log('---------------------------------------------')
        // }

		const attributeHandlers = {
			Hladilniki: {
				// Tip	Vrsta	Energijski razred	No frost	višina	širina	položaj zamrzovalnika	število vrat
                'CONSTR_TYPE': el => ({'Tip': el['#text']}),
                'PRODUCT_GROUP': el => ({'Vrsta': el['#text']}),
                "ENERGY_CLASS_2017": el => ({"Energijski razred": el['#text']}),
                'FRESHFOODSTOR_FROSTFREE_2017': el => ({"No frost": "Da"}),
                'HEIGHT': el => ({"Višina": el["#text"]}),
                'WIDTH': el => ({"Širina": el["#text"]}),

			},
			Zamrzovalniki: {
				// Tip	Prostornina	Energijski razred	No frost	višina	širina
                'CONSTR_TYPE': el => ({'Tip': el['#text']}),
                'CAP_TOTAL_LITER_2017': el => ({'Prostornina': el['#text']}),
                "ENERGY_CLASS_2017": el => ({"Energijski razred": el['#text']}),
                '4STAR_FROSTFREE_2017': el => ({"No frost": "Da"}),
                'HEIGHT': el => ({"Višina": el["#text"]}),
                'WIDTH': el => ({"Širina": el["#text"]}),
			},
            "Pralni stroji": {
                //inverter motor
                'RATED_CAPACITY_ECO_2017': el => ({'Kapaciteta': el['#text']}),
                'ENERGY_CLASS_2017': el => ({'Energijski razred': el['#text']}),
                'SHORT_DESCRIPTION': el => ({'Polnjenje': el['#text'].includes('polnjenjem spredaj') ? 'Spredaj' : null}),
                'SPIN_SPEED_RATED_CAP_2017': el => ({"št. Obratov centrifuge": el['#text']}),

            },
            "Pralno sušilni stroji": {
                // Kapaciteta	Energisjki razred	centrifuga	toplotna črpalka

            },
            "Sušilni stroji": {
                // Kapaciteta	Energisjki razred	toplotna črpalka	inverter motor	samočistilni kondenzator
                'CAP_COTTON_2010': el => ({"Kapaciteta": el['#text']}),
                'ENERGY_CLASS_2010': el => ({"Energijski razred": el ['#text']}),
                'SHORT_DESCRIPTION': el => ({'Toplotna črpalka': el['#text'].includes('toplotno') ? "Da" : "Ne"}),
                'DRYER_TYPE': el => ({'Samočistilni kondenzator': el['#text'] === 'Kondenzacijski' ? 'Da' : 'Ne'}),
            },
            "Pomivalni stroji": {
                'SHORT_DESCRIPTION': el => ({'Tip': el['#text'].includes('vgradni') ? 'Vgradni' : 'Samostoječ'}),
                'SETTINGS_2017': el => ({'Število pogrinjkov': el['#text']}),
                'HEIGHT': el => ({'Višina': el['#text']}),
                'LONG_DESCRIPTION': el => ({
                    'Tretja košara': el['#text'].includes('VarioPredal') ? "Da" : "Ne",
                    'Inverter motor': el['#text'].includes('inverter') ? "Da" : "Ne",
                }),
                'WIDTH_NICHE_SIZE_MIN': el => ({'Širina': el['#text']}),
                'ENERGY_CLASS_2017': el => ({"Energijski razred": el ['#text']}),

            },
            "Mikrovalovne pečice": {
                // volumen	žar
                'CAP_CAVITY': el => ({'Volumen': el['#text']}),
                'GRILL_COOKING': el => ({'Žar': el['#text']})
            },
            "Nape": {
                // tip	širina	pretok	energisjki razred
                'ENERGY_CLASS_2010': el => ({'Energijski razred': el['#text']}),
                'WIDTH': el => ({'Širina': el['#text']}),
                'CONSTR_TYPE': el => ({'Tip': el['#text'] === 'Vgrajeni' ? "Vgradna" : "Samostoječa"}),
                'AIR_FLOW_MAX': el => ({'Pretok': el['#text']}),
            },
            "Sesalniki": {
                // vrsta	vhodna moč	mokro sesanje
                'CONSTR_TYPE_RECHARGEABLE': el => ({'Vrsta': "Baterijski"}),
            },
            "Kuhinjski roboti": {
                // moč	litraža

            },
            "Kuhališča": {
                // Tip	vrsta okvirja	št. Kuhališč	širina
                'SURFACE_BASIC_MAT': el => ({'Tip': el['#text']}),
                'FRAME_TYPE': el => ({'Vrsta okvirja': el['#text']}),
                'POSITIONS': el => ({'št. Kuhališč': el['#text']}),
                'WIDTH': el => ({'Širina': el ['#text']})
            },
            "Pečice": {
                // Tip	čiščenje	Energijski razred	Prostornina	višina
                'CONSTR_TYPE': el => ({'Tip': el['#text'] === "Vgrajeni" ? "Vgradna" : "Samostoječa"}),
                'ENERGY_CLASS_2010': el => ({"Energijski razred": el['#text']}),
                'USE_VOL_CAVITY_2010': el => ({"Prostornina": el['#text']}),
                'HEIGHT': el => ({"Višina": el['#text']}),
                'LONG_DESCRIPTION': el => (
                    {"Čiščenje": el['#text'].includes("Piroliza") ? "Piroliza" : null},
                    {"Čiščenje": el['#text'].includes("Hidroliza") ? "Hidroliza" : null}
                ),
            },
            "Štedilniki": {
                // Tip	Plošč	Prostornina	Širina
                'USE_VOL_CAVITY_2010': el => ({'Volumen': el['#text']}),
                'GAS_BURNERS_NUMBER': () => ({}),
                'ELECTRIC_ZONES_NUMBER': () => ({}),
                'WIDTH': el => ({'Širina': el['#text']}),
            }
		};

        const handlers = attributeHandlers[this.category] || {};

		this.attribute.forEach((el) => {
			const id = el["@_name"];
			const handler = handlers[id];


			if (handler) {
				const result = handler(el);
				Object.assign(filterData, result);
			}
            Object.assign(attributes, BshAttributes.defaultHandler(el));

		});

        if (this.category === "Štedilniki") {
            const gas = Number(this.attribute.find(el => el['@_name'] === 'GAS_BURNERS_NUMBER')?.['#text'] || 0);
            const electric = Number(this.attribute.find(el => el['@_name'] === 'ELECTRIC_ZONES_NUMBER')?.['#text'] || 0);
            filterData['št. Kuhališč'] = gas + electric;
        }
        // console.log(filterData);
		return { attributes, filterData };
	}
}

export default BshAttributes;