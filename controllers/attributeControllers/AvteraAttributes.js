class AvteraAttributes {
    constructor(category, attribute) {
        this.category = category;
        this.attribute = attribute;
    }

    static extractResolution(text) {
        const match = text.match(/\b\d{3,4}\s?[×x]\s?\d{3,4}\b/i);
        return match ? match[0].replace('×', 'x').replaceAll(' ', '') : text;
    }

    static extractScreenSize(text) {
        const match = text.match(/\((\d+(?:,\d+)?)["”']?('')?\)/);
        return match ? `${match[1].replace(',', '.').replace('.0', '')}"` : text;
    }

    static extractCapacity(text) {
        return text.replace(',', '.').replace(/(\d+(\.\d+)?)([A-Z]+)/, '$1 $3');
    }

    static extractDimensions(text) {
        const dimenzije = text.match(/\d+/g);
        return dimenzije ? { 'Širina': dimenzije[0], 'Višina': dimenzije[1] } : {};
    }

    static defaultHandler(el) {
        return { [el['@_naziv']]: el['#text'] };
    }

    formatAttributes() {

        if (!this.attribute?.length) return null;
        const attributes = {};
        const filterData = {};

        const attributeHandlers = {
            Prenosniki: {
                'Vrsta procesorja': el => ({ Procesor: el['#text'] }),
                'Grafična kartica dodatno': el => ({ 'Grafična kartica': el['#text'] }),
                'Tip prenosnika': el => ({ 'Namen uporabe': el['#text'] }),
                'Diagonala zaslona': el => ({ 'Velikost zaslona': AvteraAttributes.extractScreenSize(el['#text']) }),
                'Diagonala zaslona dodatno': el => {
                    const res = AvteraAttributes.extractResolution(el['#text']);
                    return res ? { 'Ločljivost': res } : {};
                },
                'Velikost pomnilnika': el => ({ 'Kapaciteta pomnilnika': el['#text'] }),
                'SSD pogon': el => ({ 'Kapaciteta diska': el['#text'] }),
                'Operacijski sistem': el => ({ 'Operacijski sistem': el['#text'] }),
            },
            Monitorji: {
                'Ločljivost': el => {
                    const res = AvteraAttributes.extractResolution(el['#text']);
                    return res ? { 'Ločljivost': res } : {};
                },
                'Diagonala zaslona': el => ({ 'Velikost zaslona': AvteraAttributes.extractScreenSize(el['#text']) }),
                'Tip matrike': el => ({ 'Matrika': el['#text'] }),
                'Hitrost osveževanja': el => ({ 'Osveževanje': el['#text'].replace(' ','') }),
                'Zvočniki': el => ({ 'Zvočniki': el['#text'] }),
                'Ukrivljen zaslon': el => ({ 'Ukrivljen zaslon': el['#text'] }),
                'Priključki': el => ({ 'Vhodi': el['#text'] }),
            },
            'All in one': {
                'Vrsta procesorja': el => ({ Procesor: el['#text'] }),
                'Grafična kartica dodatno': el => ({ 'Grafična kartica': el['#text'] }),
                'Zaslon na dotik': el => el['#text'] === 'Da' ? { 'Vrsta zaslona': 'Da' } : {},
                'Diagonala zaslona': el => ({ 'Velikost zaslona': AvteraAttributes.extractScreenSize(el['#text']) }),
                'Diagonala zaslona dodatno': el => {
                    const res = AvteraAttributes.extractResolution(el['#text']);
                    return res ? { 'Ločljivost': res } : {};
                },
                'Velikost pomnilnika': el => ({ 'Kapaciteta pomnilnika': el['#text'] }),
                'SSD pogon': el => ({ 'Kapaciteta diska': el['#text'] }),
                'Operacijski sistem': el => ({ 'Operacijski sistem': el['#text'] }),
            },
            'Namizni računalniki': {
                'Vrsta procesorja': el => ({ Procesor: el['#text'] }),
                'Grafična kartica dodatno': el => ({ 'Grafična kartica': el['#text'] }),
                'Velikost pomnilnika': el => ({ 'Kapaciteta pomnilnika': el['#text'] }),
                'SSD pogon': el => ({ 'Kapaciteta diska': el['#text'] }),
                'Operacijski sistem': el => ({ 'Operacijski sistem': el['#text'] }),
            },
            'Tablični računalniki': {
                'Vrsta procesorja': el => ({ Procesor: el['#text'] }),
                'Diagonala zaslona': el => ({ 'Velikost zaslona': AvteraAttributes.extractScreenSize(el['#text']) }),
                'Diagonala zaslona dodatno': el => {
                    const res = AvteraAttributes.extractResolution(el['#text']);
                    return res ? { 'Ločljivost': res } : {};
                },
                'Pomnilnik RAM': el => ({ 'Kapaciteta pomnilnika': el['#text'] }),
                'Pomnilnik FLASH': el => ({ 'ROM': el['#text'] }),
                'Operacijski sistem': el => ({ 'Operacijski sistem': el['#text'] }),
            },
            Pomnilniki: {
                'Velikost pomnilnika': el => ({ 'Kapaciteta pomnilnika': el['#text'].replace(' ','') }),
                'Vrsta pomnilnika': el => ({ 'Vrsta pomnilnika': el['#text'] }),
            },
            'Trdi diski': {
                'Kapaciteta dodatno': el => ({ 'Kapaciteta diska': AvteraAttributes.extractCapacity(el['#text']) }),
                'Vrsta diska': el => ({ 'Vrsta diska': el['#text'] }),
                'Format diska': el => ({ 'Tip diska': el['#text'] }),
                'Vmesnik (priklop)': el => ({ 'Vmesnik': el['#text'] }),
            },
            Tiskalniki: {
                'Ločljivost tiskanja': el => ({ 'Ločljivost tiska': el['#text'] }),
                'Tehnologija tiskanja': el => ({ 'Tehnologija tiska': el['#text'] }),
                // 'Hitrost tiskanja': el => ({ 'Hitrost tiskanja': el['#text'] }),
            },
            'Potrošni material': {
                'Vrsta kartuše': el => ({ 'Vrsta': 'Kartuša' }),
                'Kompleti': el => ({ 'Vrsta': 'Kartuša' }),
                'Format papirja': el => ({ 'Vrsta': 'Papir' }),
            },
            Televizije: {
                'Smart TV': el => ({ 'Smart TV': 'Da', 'Operacijski sistem': el['#text'] }),
                'Ločljivost zaslona': el => {
                    const res = AvteraAttributes.extractResolution(el['#text']);
                    return res ? { 'Ločljivost': res } : {};
                },
                'Diagonala zaslona': el => ({ 'Diagonala': AvteraAttributes.extractScreenSize(el['#text']) }),
                'Tip  zaslona': el => ({ 'Vrsta zaslona': el['#text'] }),
            },
            'Domači kino': {
                'Izhodna moč zvočnika': el => ({ 'Moč': el['#text'] }),
                'Povezave': el => ({ 'Povezljivost': el['#text'] }),
                // 'Tip  zaslona': el => ({ 'Vrsta Zaslona': el['#text'] }),
                // 'Zvočni sistem': el => ({ 'Zvočni sistem': el['#text'] }),
                // 'Globokotonski zvočnik': el => ({ 'Globokotonski zvočnik': el['#text'] }),
            },
            Projektorji: {
                'Ločljivost': el => ({ 'Ločljivost': el['#text'] }),
                'Svetilnost': el => ({ 'Svetilnost': el['#text'] }),
                'Kontrast': el => ({ 'Kontrast': el['#text'] }),
                'Tip projektorja': el => ({ 'Namen': el['#text'] }),
                'Tehnologija': el => ({ 'Tehnologija': el['#text'] }),
            },
            'Pralni stroji': {
                'Zmogljivost pranja': el => ({ 'Kapaciteta': el['#text'] }),
                'Razred energijske učinkovitosti pranja': el => ({ 'Energijski razred': el['#text'] }),
                'Največja hitrost ožemanja': el => ({ 'št. Obratov centrifuge': el['#text'] }),
                'Inverter motor': el => ({ 'Inverter motor': el['#text'] }),
            },
            'Sušilni stroji': {
                'Zmogljivost sušenja': el => ({ 'Kapaciteta': el['#text'] }),
                'Razred energijske učinkovitosti sušenja': el => ({ 'Energijski razred': el['#text'] }),
                'Toplotna črpalka': el => ({ 'Toplotna črpalka': el['#text'] }),
                'Inverter motor': el => ({ 'Inverter motor': el['#text'] }),
            },
            'Pralno Sušilni Stroji': {
                'Zmogljivost pranja': el => ({ 'Kapaciteta pranja': el['#text'] }),
                'Zmogljivost sušenja': el => ({ 'Kapaciteta sušenja': el['#text'] }),
                'Razred energijske učinkovitosti pranja in sušenja': el => ({ 'Energijski razred pranja': el['#text'] }),
                'Inverter motor': el => ({ 'Inverter motor': el['#text'] }),
                'Največja hitrost ožemanja': el => ({ 'Centrifuga': el['#text'] }),
            },
            'Pomivalni stroji': {
                'Mere (Š x V x G)': el => AvteraAttributes.extractDimensions(el['#text']),
                'Namestitev': el => ({ 'Tip': el['#text'] }),
                'Število pogrinjkov': el => ({ 'Število pogrinjkov': el['#text'] }),
                'Zaščita pred izlivom vode': el => ({ 'Aqua Stop': 'Da' }),
                'Zlaganje pribora': el => el['#text'] === 'Predal' ? { 'Tretja košara': 'Da' } : {},
                'Energetski razred': el => ({ 'Energijski razred': el['#text'] }),
            },
            Hladilniki: {
                'Vrsta hladilnika': el => ({ 'Vrsta': el['#text'] }),
                'Energetski razred': el => ({ 'Energijski razred': el['#text'] }),
                'Položaj zamrzovalnika': el => ({ 'Položaj zamrzovalnika': el['#text'] }),
                'Samodejno odtajevanje': el => ({ 'No frost': el['#text'] }),
                'Višina dodatno': el => ({ 'Višina': el['#text'] }),
            },
            Zamrzovalniki: {
                'Vrsta zmrzovalne skrinje': el => ({ 'Tip': el['#text'] }),
                'Energetski razred': el => ({ 'Energijski razred': el['#text'] }),
                'Samodejno odtajevanje': el => ({ 'No frost': el['#text'] }),
                'Višina dodatno': el => ({ 'Višina': el['#text'] }),
                'Prostornina zmrzovalnika dodatno': el => ({ 'Prostornina': el['#text'] }),
                'Mere (Š x V x G)': el => AvteraAttributes.extractDimensions(el['#text']),
            },
            Pečice: {
                'Namestitev': el => ({ 'Tip': el['#text'] }),
                'Energetski razred': el => ({ 'Energijski razred': el['#text'] }),
                'Prostornina pečice dodatno': el => ({ 'Prostornina': el['#text'] }),
                'Mere (Š x V x G)': el => {
                    const dimenzije = el['#text'].match(/\d+/g);
                    return dimenzije ? { 'Višina': dimenzije[1] } : {};
                },
                'Način čiščenja': el => ({ 'Čiščenje': el['#text'] }),
            },
            Kuhališča: {
                'Namestitev kuhalne plošče': el => ({ 'Tip': el['#text'] }),
                'Število kuhališč': el => ({ 'Število kuhališč': el['#text'] }),
                'Vrsta kuhalne plošče': el => ({ 'Vrsta okvirja': el['#text'] }),
                'Širina dodatno': el => ({ 'Širina': el['#text'] }),
            },
            Nape: {
                'Energetski razred': el => ({ 'Energijski razred': el['#text'] }),
                'Vrsta nape': el => ({ 'Tip': el['#text'] }),
                'Mere (Š x V x G)': el => {
                    const dimenzije = el['#text'].match(/\d+/g);
                    return dimenzije ? { 'Širina': dimenzije[0] } : {};
                },
            },
        };

        const handlers = attributeHandlers[this.category] || {};

        this.attribute.forEach(el => {
            const name = el['@_naziv'];
            const handler = handlers[name];
            // const result = handler ? handler(el) : AvteraAttributes.defaultHandler(el);
            // Object.assign(attributes, result);
            if (handler) {
				const result = handler(el);
				Object.assign(filterData, result);
			} else {
                Object.assign(attributes, AvteraAttributes.defaultHandler(el));
			}
        });

        return {attributes, filterData};
    }
}

export default AvteraAttributes;