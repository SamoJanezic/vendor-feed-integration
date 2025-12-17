Attribute controller pretvori XML atribute v interne filtre in dodatne lastnosti.
Spodaj je prikazan primer strukture atributov, kot jih parser vrne po obdelavi XML-ja:
[
  {
    '#text': 'ACER',
    '@_naziv': 'Proizvajalec',
    '@_id': 'manufacturer'
  },
  {
    '#text': 'NX.VPREX.00Y',
    '@_naziv': 'Proizvajalčeva koda',
    '@_id': 'manufacturer_code'
  },
  { '#text': 4710886782254, '@_naziv': 'EAN koda', '@_id': 'ean_code' },
  {
    '#text': '15.6" FHD (1920x1080) TN 250nits neodsevni',
    '@_naziv': 'Velikost in ločljivost zaslona:',
    '@_id': 'zaslon'
  },
  {
    '#text': 'Intel Core i7-1165-G7 (2C / 4T, 2.8 / 4.7GHz 12MB)',
    '@_naziv': 'Procesor:',
    '@_id': 'procesor'
  },
  {
    '#text': '16 GB DDR4 3200Mhz',
    '@_naziv': 'Pomnilnik:',
    '@_id': 'pomnilnik'
  },
  {
    '#text': '256GB SSD M.2 PCIe NVMe',
    '@_naziv': 'Kapaciteta diska:',
    '@_id': 'trdi_disk'
  },
  {
    '#text': 'Intel Iris Xe',
    '@_naziv': 'Grafična kartica:',
    '@_id': 'graficna_kartica'
  },
  {
    '#text': 'Gigabit Ethernet',
    '@_naziv': 'Mrežna kartica',
    '@_id': 'mrezna_kartica'
  },
  {
    '#text': '11ac, 2x2 + BT5.0',
    '@_naziv': 'Brezžična mrežna oprema',
    '@_id': 'brezzicna_mrezna_oprema'
  },
  {
    '#text': '4-in-1 card reader',
    '@_naziv': 'Čitalec kartic',
    '@_id': 'citalec_kartic'
  },
  {
    '#text': '<p>1x HDMI</p> <p>VGA</p> <p>3x USB 3.2 gen 1 (Tip-A)</p> <p>1x USB 3-2 gen 2 (Tip-C)</p> <p>Display port</p> <p>RJ-45</p> ',
    '@_naziv': 'Priključki:',
    '@_id': 'prikljucki'
  },
  { '#text': '2x Stereo', '@_naziv': 'Zvočniki', '@_id': 'zvocniki' },
  { '#text': '45Wh', '@_naziv': 'Baterija', '@_id': 'baterija' },
  { '#text': 'črna', '@_naziv': 'Barva:', '@_id': 'barva' },
  {
    '#text': '363 x 255 x 19,9 mm',
    '@_naziv': 'Dimenzije: (SxVxG)',
    '@_id': 'dimenzije'
  },
  { '#text': '1,8 kg', '@_naziv': 'Masa (neto):', '@_id': 'masa' },
  {
    '#text': 'Windows 10 Pro',
    '@_naziv': 'Operacijski sistem:',
    '@_id': 'operacijski_sistem'
  },
  {
    '#text': '24 mesecev',
    '@_naziv': 'Garancija',
    '@_id': 'garancija'
  },
  { '#text': 'TravelMate', '@_naziv': 'Serija:', '@_id': 'not_serija' },
  { '#text': 'No', '@_naziv': 'Ima polnilec:', '@_id': 'ima_polnilec' },
  {
    '#text': 'No',
    '@_naziv': 'Podpira USB Power Delivery:',
    '@_id': 'podpira_usb_pd'
  },
  {
    '#text': "39,6 cm (15,6'')",
    '@_naziv': 'Velikost zaslona:',
    '@_id': 'velikost_zaslona_filter'
  },
  {
    '#text': 'Intel Core i7',
    '@_naziv': 'Tip procesorja:',
    '@_id': 'tip_procesorja'
  },
  {
    '#text': '16GB',
    '@_naziv': 'Pomnilnik:',
    '@_id': 'pomnilnik_filter'
  },
  { '#text': '256GB', '@_naziv': 'SSD:', '@_id': 'ssd_filter' },
  {
    '#text': 'Intel Iris Xe',
    '@_naziv': 'Grafična kartica:',
    '@_id': 'graficna_kartica_filter'
  },
  {
    '#text': 'Windows 10 Pro',
    '@_naziv': 'Operacijski sistem:',
    '@_id': 'operacijski_sistem_filter'
  }
]


Naš atributController omogoča, da se te inofrmacije spremenijo in se shranijo v filtre. Originalne vrednosti se vedno shranijo v dodatne lastnosti.

v atribut kontrolerju se uporabljajo classi, ki imajho lahko svoje funkcije in tudi že vnaprej vnešene vrednosti ki pridejo preki construktorja:

class AcordAttributes {
	constructor(category, attribute) {
		this.attribute = attribute;
		this.category = category;
	}

    static extractCapacity(text) {
        const match = text.match(/(\d+)\s?(GB|TB)/i);
        return match ? `${match[1]} ${match[2]}` : text;
    }
po konstruktorju se lahko navedejo statične funkcije(to so funkcije, ki delujejo samo znotraj tega klasa in se tudi kličejo z npr. AcordAttributes.extractResolution)

    static defaultHandler(el) {
		return { [el["@_naziv"]]: el["#text"] };
	}
defaultHandler funkcija je potrebna v vsakem od atribut kontrolerjev v njem se navede kateri par vzamemo. Poglednimo zgornji prvi primer:
{
    '#text': 'ACER',
    '@_naziv': 'Proizvajalec',
    '@_id': 'manufacturer'
},
tu vidimo da imamo tri vrednosti default handler shrani v dodatne_lastnosti zato je logično da ima tudi primerno ime. V tem primeru @_naziv = #text kot je tudi v default handlerju.

Nato pa pride glavna funkcija formatAttributes

    formatAttributes() {
		if (!this.attribute || !this.attribute.length) return null;
		const attributes = {};
        const filterData = {};
        if (this.category === "Prenosniki") {  //------> tale blok je samo za pomoč da si logiraš vrednosti in se tudi lahko z njimi pomagaš da vidiš katere so dejanske vrednosti znotraj določene kategorije
            console.log(this.attribute);
            process.exit()
        }  //------> zaključek console bloka

v atribut handlerju se potem vedno prvo označi kategorija, ki jo uporabljamo mi, kot je tu "All in One" nato pa v bloku pridejo te -> tip_procesorja: (el) => ({ Procesor: el["#text"] }),
tip_procesorja -> katero vrednost mora gledat v xml-ju
Procesor -> kako ti poimenuješ filter
el['#text'] -> sama dejanska vrednost(intel, amd, ali kakšne koli vrednosti so znotraj xmlja);
V primeru, da se rabi nekakšna večja logika jo bolje preselimo ven v statično funckijo in potem tako definiramo kot je tu večina vrednosti in se rešimo, da bi blok postal prevelik in nasičen z logiko.
		const attributeHandlers = {
        "All in One": {
				tip_procesorja: (el) => ({ Procesor: el["#text"] }),
				pomnilnik_filter: (el) => ({
					"Kapaciteta pomnilnika": AcordAttributes.extractCapacity(
						el["#text"]
					),
				}),
				zaslon: (el) => ({
					"Velikost zaslona": AcordAttributes.extractScreenSize(
						el["#text"]
					),
					Ločljivost: AcordAttributes.extractResolution(el["#text"]),
				}),
				ssd_filter: (el) => ({
					"Kapaciteta diska": AcordAttributes.extractCapacity(
						el["#text"]
					),
				}),
				graficna_kartica: (el) => ({ "Grafična kartica": el["#text"] }),
				operacijski_sistem_filter: (el) => ({
					"Operacijski sistem": el["#text"],
				}),
			},

        const handlers = attributeHandlers[this.category] || {};

in še končen forEach block, ki se giblje čez vse te vrednosti in jih procesira:

            this.attribute.forEach((el) => {
                const id = el["@_id"];  //---------------> on gleda drugače kot defaultHandler in gleda pod '@_id'. če pogledamo zgornji primer vidimo da je @_id lepše definiran kot @_naziv npr.:  '@_naziv': 'Grafična kartica:', '@_id': 'graficna_kartica'. nima šumnikov in samo male črke brez presledkov. Manj možnosti, da pride do napake.


                const handler = handlers[id];


                if (handler) {
                    const result = handler(el);
                    Object.assign(filterData, result);
                } else {
                    Object.assign(attributes, AcordAttributes.defaultHandler(el));
                }
            });
            return { attributes, filterData };
        }
    }

    export default AcordAttributes;

In še zaključek klasa.