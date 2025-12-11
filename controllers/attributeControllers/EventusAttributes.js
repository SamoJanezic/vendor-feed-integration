class EventusAttributes {
    constructor(category, attribute) {
        this.attribute = attribute;
        this.category = category;
    }

    static extractCapacity(text) {
        const match = text.match(/(\d+)\s?(GB|TB)/i);
        return match ? `${match[1]} ${match[2]}` : text;
    }

    static extractScreenSize(text) {
        const match = text.match(/^\d+(\.\d+)?/);
        return match ? `${match[0]}"` : text;
    }

    static mbToGb(text) {
    const match = text.match(/([\d.,]+)\s*MB/i);
    if (!match) return text;
    const mb = parseFloat(match[1].replace(',', '.'));
    const gb = mb / 1024;
    return Number.isInteger(gb) ? `${gb} GB` : `${gb.toFixed(1)} GB`;
}

    static extractResolution(text) {
        const match = text.match(/\b\d{3,4}\s?x\s?\d{3,4}\b/i);
        return match ? match[0].replace(/\s?x\s?/i, ' x ') : '';
    }

    static extractConnectivity(text) {
        if (!text || typeof text !== "string") return null;

        return text.toLowerCase().includes("bluetooth")
            ? "Brezžična"
            : "Žična";
    }

    static extractPortCount(text) {
        if (!text || typeof text !== "string") return null;

        const match = text.match(/\b(\d+)\s*x\b/i);
        return match ? `${match[1]}x` : null;
    }

    static defaultHandler(el) {
        return { [el['@_naziv']]: el['#text'] };
    }

    formatAttributes() {
        if (!this.attribute || !this.attribute.length) return {};

        const attributes = {};
        const filterData = {};

        // if (this.category === 'Tablični računalniki') {
        //     console.log(this.attribute)
        // }

        const attributeHandlers = {
            'Grafične kartice': {
                Serija: el => ({'GPU': el['#text']}),
                // 'Grafični procesor': el => ({}),
                'Količina pomnilnika': el => ({'Pomnilnik': EventusAttributes.mbToGb(el['#text'])})
            },
            'HI-FI in Prenosni zvočniki': {
                'Tip izdelka': el => ({'Vrsta': el['#text']}), // Vrsta
                Priključki: el => ({'Priiključki': el['#text']})
            },
            'Hlajenje': {'Vrsta hlajenja': el => ({'Tip izdelka': el['#text']})},
            'Spletne kamere': {'Ločljivost kamere': el => ({'Ločljivost': el['text']})},
            'Mediji': {'Tip naprave': el => ({'Vrsta medija': el['#text']})},
            'Miške': {
                'Brezžična povezava': el => ({'Povezava': el['#text'] === 'Da' ? 'Brezžične' : 'Žične'}),
                'Tip senzorja': el => ({'Senzor': el['#text']}),
                'Ločljivost senzorja': el => ({'DPI': el['#text']}),
            },
            'Monitorji': {
                'Ločljivost': el => ({'Ločljivost': el['#text']}),
                'Frekvenca osveženja': el => ({'Osveževanje': el['#text']}),
                'Tip panela': el => ({'Matrika': el['#text']}),
                'Ukrivljenost zaslona': el => ({'Ukrivljenost': el['#text'] ? 'Da' : 'Ne'}),
                'Velikost zaslona': el => ({'Velikost zaslona': el['#text']}),
                'Video vhodi': el => ({'Video vhodi': el['#text']})
            },
            'Ohišja': {
                'Format ohišja': el => ({'Velikost': el['#text']}),
                'Napajalnik': 'Ne'
            },
            'Pomnilniki': {
                'Kapaciteta pomnilnika': el => ({'Kapaciteta pomnilnika': el['#text']}),
                'Vrsta pomnilnika': el => ({'Vrsta pomnilnika': el['#text']}),
            },
            'Slušalke': {
                'Mikrofon': el => ({'Mikrofon': el['#text'] === 'Da' ? 'Da' : 'Ne'}),
                'Brezžična povezava': el => ({'Povezava': el['#text'] === 'Da' ? 'Brezžične' : 'Žične'}),
            },
            'Spominske kartice in čitalci': {
                // Kapaciteta	TIP kartice	Čitalec	hitrost zapisovanja	hitrost branja

            },
            'Tablični računalniki': {
                'Ločljivost zaslona': el => ({'Ločljivost': el['#text']}),
                'Velikost zaslona': el => ({'Velikost zaslona': el['#text']}),
                'Kapaciteta': el=> ({'Kapaciteta pomnilnika': el['#text']}),
            },
            'Tipkovnice': {
                'Brezžična povezava': el => ({'Povezava': el['#text'] === 'Ne' ? 'Žična' : 'Brezžična'}),
                'Mehanska': el => ({'Mehanska': el['#text'] === 'Ne' ? 'Ne' : 'Da'}),
            },
            'Trdi diski': {
                'Vrsta diska': el => ({'Vrsta diska': el['#text']}),
                'Kapaciteta diska': el => ({'Kapaciteta diska': el['#text']}),
                'Velikost diska': el => ({'Velikost diska': el['#text']}),
                'Tip': el => ({'Tip diska': el['#text']}),
            },
            'Usmerjevalniki, stikala in AP': {
                'Tip naprave': el => ({'Vrsta': el['#text']}),
                'Wi-Fi 5 GHz Hitrost': el => ({'Hitrost': el['#text']}),
                'Vhodi': el => ({'št. LAN priklopov': EventusAttributes.extractPortCount(el['#text'])})
            },
            'Zvočniki': {
                'Priklop': el => ({'Povezava': EventusAttributes.extractConnectivity(el['#text'])}),
                'Tip zvočnika': el => ({'Sistem': el['#text']}, {'Vrsta': el['text'] ? 'Zvočnik' : null}),
            },
            'Športne ure': {}
        };

        const handlers = attributeHandlers[this.category] || {};

        this.attribute.forEach(el => {
            const id = el['@_naziv'];
            const handler = handlers[id];
            if (handler) {
				const result = handler(el);
				Object.assign(filterData, result);
			}
            Object.assign(attributes, EventusAttributes.defaultHandler(el));
        });

        return { attributes, filterData };
    }
}

export default EventusAttributes;