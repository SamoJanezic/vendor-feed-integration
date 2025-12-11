class AsbisAttributes {
    constructor(category, attribute) {
        this.category = category;
        this.attribute = attribute;
    }

    static extractScreenSize(text) {
        const match = text.match(/\d+(\.\d+)?"/);
        return match ? match[0] : text;
    }

    static defaultHandler(el) {
        return { [el['@_Name']]: el['@_Value'] };
    }

    formatAttributes() {
        if (!this.attribute || !this.attribute.length) return {};

        const attributes = {};
        const filterData = {};

        if (this.category === "Prenosniki") {
            console.log(this.attribute);
        }

        const attributeHandlers = {
            'Dodatki za prenosnike': {
                'Vrsta torbe': el => ({ 'Vrsta dodatka': 'Torba za prenosnike' }),
            },
            Monitorji: {
                'Najvišja ločljivost': el => ({ 'Ločljivost': el['@_Value'] }),
                'Dolžina diagonale': el => ({ 'Velikost zaslona': el['@_Value'] }),
                'Vrsta matrike': el => ({ 'Matrika': el['@_Value'] }),
                'Najvišja frekvenca osveževanja pri najvišji ločljivosti': el => ({ 'Osveževanje': el['@_Value'].replace(' ','') }),
                'Vrsta oblike zvočnika': el => ({ 'Zvočniki': 'Da' }),
                'Značilnosti zaslona': el => el['@_Value'].includes('Ukrivljena') ? { 'Ukrivljen zaslon': 'Da' } : {},
            },
            Procesorji: {
                'Procesor': el => ({ 'Procesor': el['@_Value'] }),
                'Ležišče': el => ({ 'Podnožje': el['@_Value'] }),
            },
            Pomnilniki: {
                'Zmogljivost pomnilnika': el => ({ 'Kapaciteta pomnilnika': el['@_Value'] }),
                'Tehnologija pomnilnika': el => ({ 'Vrsta pomnilnika': el['@_Value'] }),
            },
            'Trdi diski': {
                'Zmogljivost pomnilnika': el => ({ 'Kapaciteta diska': el['@_Value'] }),
                'Lokacija naprave': el => ({ 'Vrsta diska': el['@_Value'] }),
                'Format diska': el => ({ 'Tip diska': el['@_Value'] }),
                'Podprti podatkovni kanal': el => ({ 'Vmesnik': el['@_Value'] }),
                'Tip': el => {
                    const match = el['@_Value'].match(/\d+(\.\d+)?"/);
                    return match ? { 'Velikost diska': match[0] } : {};
                },
            },
            'Grafične kartice': {
                'Nabor grafičnih čipov': el => ({ 'Grafični procesor': el['@_Value'] }),
                'Zmogljivost vgrajenega video pomnilnika': el => ({ 'Pomnilnik': el['@_Value'] }),
                // 'Vrsta pomnilnika': el => ({ 'Vrsta pomnilnika': el['@_Value'] }),
            },
            'Osnovne plošče': {
                'Podprti procesorji': el => ({ 'Vrsta procesorja': el['@_Value'].replaceAll(' <br/>', ', ') }),
                'Nabor čipov': el => ({ 'Vezni nabor': el['@_Value'] }),
                'Tip': el => ({ 'Format': el['@_Value'] }),
                'Standardi ležišča procesorja': el => ({ 'Podnožje': el['@_Value'] }),
                'Število pomnilniških rež': el => ({ 'Pomnilniške reže': el['@_Value'] }),
            },
            'HI-FI in prenosni zvočniki': {
                'Vrsta sistema': el => {
                    if (el['@_Value'] === 'Portable Speaker') return { 'Vrsta zvočnika': 'Prenosni zvočnik' };
                    if (el['@_Value'] === 'PC Speaker') return { 'Vrsta zvočnika': 'Računalniški zvočnik' };
                    return {};
                },
                'Izhodna moč': el => ({ 'Moč': el['@_Value'] }),
                'Vrsta napajalnih konektorjev': el => ({ 'Priključki': el['@_Value'] }),
            },
            'NAS sistemi': {
                'Tip': el => ({ 'Postavitev': el['@_Value'] }),
                'Podprto Število naprav': el => ({ 'Kapaciteta pomnilnika': el['@_Value'] }),
                'Vmesniki': el => {
                    const match = el['@_Value'].match(/LAN:\s*(\d+x)/i);
                    return match ? { 'št. LAN priklopov': match[1] } : {};
                },
                'Število razširitvenih mest za 3,5-palčni pogons podporo zamenjave med delovanjem': el => ({ 'Število diskov': el['@_Value'] }),
            },
            Slušalke: {
                'Brezžična tehnologija': el => ({ 'Povezava': 'Brezžične' }),
                'Tip mikrofona': el => ({ 'Mikrofon': 'Da' }),
                // Default: if no 'Povezava' set, set to 'Žične'
            },
            'Spletne kamere': {
                'Največja ločljivost videa': el => ({ 'Ločljivost': el['@_Value'] }),
            },
            'Usmerjevalniki, stikala in AP': {
                'Vrsta': el => ({ 'Vrsta': el['@_Value'] }),
                'Wi-Fi Band Frequency': el => ({ 'Hitrost': el['@_Value'] }),
                'Hitrost prenosa podatkov': el => ({ 'Hitrost': el['@_Value'] }),
                'LAN': el => ({ 'št. LAN priklopov': el['@_Value'] }),
            },
            Televizije: {
                'Dolžina diagonale': el => ({ 'Diagonala': el['@_Value'] }),
                'Najvišja ločljivost': el => ({
                    'Ločljivost': el['@_Value'],
                    'Smart TV': 'Da',
                    'Operacijski sistem': 'Android'
                }),
                'Vrsta zaslona': el => ({ 'Vrsta zaslona': el['@_Value'] }),
            },
            'Optične enote': {
                'Vrsta diskovnega pogona': el => ({ 'Vrsta optične enote': el['@_Value'] }),
                'Lokacija naprave': el => ({ 'Tip optične enote': el['@_Value'] }),
            },
            Ohišja: {
                'Tip matične plošče': el => ({ 'Velikost': el['@_Value'] }),
                'Vrsta napajalnika': el => ({ 'Napajalnik': el['@_Value'] }),
            },
            Tipkovnice: {
                'Tehnologija povezovanja': el => ({ 'Povezava': el['@_Value'] }),
                'Vrsta tipk': el => el['@_Value'] === 'Mechanical' ? { 'Mehanska': 'Da' } : {},
            },
        };

        const handlers = attributeHandlers[this.category] || {};

        this.attribute.forEach(el => {
            const name = el['@_Name'];
            const handler = handlers[name];
            // let result = handler ? handler(el) : AsbisAttributes.defaultHandler(el);

            // Special case for Slušalke: set 'Povezava' to 'Žične' if not set
            if (this.category === 'Slušalke' && !attributes['Povezava'] && name !== 'Brezžična tehnologija') {
                attributes['Povezava'] = 'Žične';
            }

            if (handler) {
                const result = handler(el);
                Object.assign(filterData, result);
            }
            Object.assign(attributes, AsbisAttributes.defaultHandler(el));
            // Object.assign(attributes, result);
        });

        return { attributes, filterData };
    }
}

export default AsbisAttributes;