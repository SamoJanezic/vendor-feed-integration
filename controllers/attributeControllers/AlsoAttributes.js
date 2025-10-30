class AlsoAttributes {
    constructor(category, attribute) {
        this.category = category;
        this.attribute = attribute;
    }

    static extractCapacity(text) {
        const match = text.match(/\b\d+(\.\d+)?\s?(GB|MB|TB)\b/i);
        return match ? match[0].replace(/\s?/, " ") : text;
    }

    static extractScreenSize(text) {
        const match = text.match(/\b\d+(\.\d+)?"/);
        return match ? match[0].replace(',', '.') : text;
    }

    static extractResolution(text) {
        const match = text.match(/\b\d{3,4}\s?[×x]\s?\d{3,4}\b/i);
        return match ? match[0].replace('×', 'x').replaceAll(' ', '') : text;
    }

    static replaceVat(text) {
        return text.replace(/\b(vatov?|wattov?|watt|vat|w)\b/gi, 'W').replace(/\s+W/, ' W').trim();
    }

    static defaultHandler(el) {
        return { [el['@_name']]: el['#text'] };
    }

    formatAttributes() {
        if (!this.attribute || !this.attribute.length) return {};

        const attributes = {};

        const attributeHandlers = {
            Prenosniki: {
                Procesor: el => ({ Procesor: el['#text'] }),
                Grafika: el => ({ 'Grafična kartica': el['#text'] }),
                'Vrsta izdelka': el => ({ 'Namen uporabe': el['#text'] }),
                Prikaz: el => {
                    const res = {};
                    const size = AlsoAttributes.extractScreenSize(el['#text']);
                    if (size) res['Velikost zaslona'] = size;
                    const resol = AlsoAttributes.extractResolution(el['#text']);
                    if (resol) res['Ločljivost'] = resol;
                    return res;
                },
                'Delovni Spomin': el => {
                    const cap = AlsoAttributes.extractCapacity(el['#text']);
                    return { 'Kapaciteta pomnilnika': cap };
                },
                'Prostor trdega diska': el => {
                    const cap = AlsoAttributes.extractCapacity(el['#text']);
                    return { 'Kapaciteta diska': cap };
                },
                'Operacijski sistem': el => ({ 'Operacijski sistem': el['#text'] }),
            },
            Monitorji: {
                Ločljivost: el => {
                    const resol = AlsoAttributes.extractResolution(el['#text']);
                    return resol ? { 'Ločljivost': resol } : {};
                },
                'Vrsta naprave': el => {
                    const size = AlsoAttributes.extractScreenSize(el['#text']);
                    return size ? { 'Velikost zaslona': size } : {};
                },
                'Vrsta plošče': el => ({ Matrika: el['#text'] }),
                'Hitrost osveževanja': el => ({ Osveževanje: el['#text'].replace(' ','') }),
                Zvočniki: el => ({ Zvočniki: el['#text'] }),
                'Ukrivljen zaslon': el => ({ 'Ukrivljen zaslon': el['#text'] }),
                'Vhodni priključki': el => ({ Vhodi: el['#text'] }),
                'Razmerje širine in širine': el => ({ Format: el['#text'] }),
            },
            'Namizni računalniki': {
                'Vrsta procesorja': el => ({ Procesor: el['#text'] }),
                'Grafični krmilnik': el => ({ 'Grafična kartica': el['#text'] }),
                'Velikost pomnilnika': el => ({ 'Kapaciteta pomnilnika': el['#text'] }),
                'SSD pogon': el => ({ 'Kapaciteta diska': el['#text'] }),
                'Sistem za operacijski sistem': el => ({ 'Operacijski sistem': el['#text'] }),
            },
            'All in one': {
                Procesor: el => ({ Procesor: el['#text'] }),
                'Grafični krmilnik': el => ({ 'Grafična kartica': el['#text'] }),
                Monitor: el => {
                    const res = {};
                    if (el['#text'].includes('dotik')) res['Vrsta zaslona'] = 'Touch';
                    const size = AlsoAttributes.extractScreenSize(el['#text']);
                    if (size) res['Velikost zaslona'] = size;
                    const resol = el['#text'].match(/\b\d{3,4}\s?[x×]\s?\d{3,4}\b/i);
                    res['Ločljivost'] = resol ? resol[0].replace(/\s?×\s?/i, " x ").replace(/\s+/g, " ") : null;
                    return res;
                },
                OVEN: el => {
                    const match = el['#text'].match(/^\d+\sGB/);
                    return { 'Kapaciteta pomnilnika': match ? match[0] : el['#text'] };
                },
                'Trdi disk': el => {
                    const cap = AlsoAttributes.extractCapacity(el['#text']);
                    return { 'Kapaciteta diska': cap };
                },
                'Sistem za operacijski sistem': el => ({ 'Operacijski sistem': el['#text'] }),
            },
            'Tablični računalniki': {
                Procesor: el => ({ Procesor: el['#text'] }),
                Prikaz: el => {
                    const res = {};
                    if (el['#text'].includes('dotik')) res['Vrsta zaslona'] = 'Touch';
                    const size = AlsoAttributes.extractScreenSize(el['#text']);
                    if (size) res['Velikost zaslona'] = size;
                    const resol = el['#text'].match(/\b\d{3,4}\s?[x×]\s?\d{3,4}\b/i);
                    res['Ločljivost'] = resol ? resol[0].replace(/\s?×\s?/i, " x ").replace(/\s+/g, " ") : null;
                    return res;
                },
                'Delovni spomin': el => {
                    const match = el['#text'].match(/^\d+\sGB/);
                    return { 'Kapaciteta pomnilnika': match ? match[0] : el['#text'] };
                },
                'Prostor trdega diska': el => {
                    const cap = AlsoAttributes.extractCapacity(el['#text']);
                    return { ROM: cap };
                },
                'Operacijski sistem': el => ({ 'Operacijski sistem': el['#text'] }),
            },
            Pomnilniki: {
                Zmogljivost: el => ({ 'Kapaciteta pomnilnika': el['#text'] }),
                'Vrsta pomnilnika': el => ({ 'Vrsta pomnilnika': el['#text'] }),
            },
            'Trdi diski': {
                Zmogljivost: el => ({ 'Kapaciteta diska': el['#text'] }),
                Vrsta: el => ({ 'Vrsta diska': el['#text'] }),
                'Format diska': el => ({ 'Tip diska': el['#text'] }),
                'Vmesnik (priklop)': el => ({ Vmesnik: el['#text'] }),
            },
            Tiskalniki: {
                'Vrsta naprave': el => ({ 'Vrsta tiskalnika': el['#text'] }),
                'Tehnologija tiskanja': el => {
                    const res = { 'Tehnologija tiska': el['#text'] };
                    if (el['#text'].includes('barvni')) res['Barva tiska'] = 'Barvni';
                    return res;
                },
                'Največja ločljivost tiskanja': el => ({ 'Ločljivost tiska': el['#text'] }),
                'Možnosti povezave': el => ({ 'Povezava tiskalnika': 'Brezžična' }),
                'Velikost medija': el => ({ Format: el['#text'] }),
            },
            'Potrošni material': {
                'Vrsta kartuše': el => ({ Vrsta: 'Kartuša' }),
                Kompleti: el => ({ Vrsta: 'Kartuša' }),
                'Format papirja': el => ({ Vrsta: 'Papir' }),
                'Kapaciteta': el => ({ 'Kapaciteta strani': el['#text'] }),
            },
            Televizije: {
                Peron: el => ({ 'Smart TV': 'Da', 'Operacijski sistem': el['#text'] }),
                Resolucija: el => ({ 'Ločljivost': el['#text'] }),
                'Velikost diagonale': el => ({ Diagonala: el['#text'] }),
                'Vrsta izdelka': el => ({ 'Vrsta Zaslona': el['#text'] }),
            },
            'Domači kino': {
                'Neprekinjena moč': el => ({ Moč: el['#text'] }),
                Vmesniki: el => ({ Povezljivost: el['#text'] }),
            },
            Projektorji: {
                'Opis izdleka': el => ({
                    Name: el['#text'].includes('prenosni') ? 'Prenosni' : 'Stacionarni'
                }),
                Resolucija: el => ({ 'Ločljivost': el['#text'] }),
                'Svetlost (bela)': el => ({ Svetilnost: el['#text'] }),
                'Razmerje kontrasta': el => ({ Kontrast: el['#text'] }),
                'Vrsta naprave': el => ({ Tehnologija: el['#text'] }),
            },
            'Brezprekinitveni napajalniki': {
                'Vrsta naprave': el => ({ Postavitev: el['#text'] }),
                'Zmogljivost napajanja': el => ({ Moč: AlsoAttributes.replaceVat(el['#text']) }),
            },
            'Miške': {
                'Tehnologija povezljivosti': el => ({Povezava: el['#text']}),
                'Tehnologija zaznavanja gibanja': el => ({Senzor: el['#text']}),
                'Ločljivost premikanja': el => ({DPI: el['#text']}),
            }
        };

        const handlers = attributeHandlers[this.category] || {};

        this.attribute.forEach(el => {
            const name = el['@_name'];
            const handler = handlers[name];
            const result = handler ? handler(el) : AlsoAttributes.defaultHandler(el);
            Object.assign(attributes, result);
        });

        return attributes;
    }
}

export default AlsoAttributes;