class AcordAttributes {
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

	static extractResolution(text) {
		const match = text.match(/\b\d{3,4}\s?x\s?\d{3,4}\b/i);
		return match ? match[0].replace(/\s?x\s?/i, " x ") : text;
	}

    static replaceVat(text) {
        return text
            .replace(/\b(vatov?|wattov?|watt|vat|w)\b/gi, "W")
            .replace(/(\d+)\s*W/gi, "$1 W")
            .trim();
    }

	static defaultHandler(el) {
		return { [el["@_naziv"]]: el["#text"] };
	}

	formatAttributes() {
		if (!this.attribute || !this.attribute.length) return null;
		const attributes = {};
        const filterData = {};
        // if (this.category === "Konferenčna oprema") {
        //     console.log(this.attribute);
        // }
		const attributeHandlers = {
			Prenosniki: {
				procesor: (el) => ({ Procesor: el["#text"] }),
				pomnilnik_filter: (el) => ({
					"Kapaciteta pomnilnika": el["#text"],
				}),
                velikost_zaslona_filter: (el) => ({"Velikost zaslona": el["#text"]}),
				zaslon: (el) => ({
					// "Velikost zaslona": AcordAttributes.extractScreenSize(
					// 	el["#text"]
					// ),
					Ločljivost: AcordAttributes.extractResolution(el["#text"]),
				}),
				ssd_filter: (el) => ({
					"Kapaciteta diska": AcordAttributes.extractCapacity(
						el["#text"]
					),
				}),
				graficna_kartica_filter: (el) => ({
                    "Grafična kartica": el["#text"],
                    "Namen uporabe": "Prenosnik"
                    }),
				operacijski_sistem_filter: (el) => ({
					"Operacijski sistem": el["#text"],
				}),
				// operacijski_sistem: el => ({ "Operacijski sistem": el['#text'] }),
			},
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
			"Namizni računalniki": {
				tip_procesorja: (el) => ({ Procesor: el["#text"] }),
				pomnilnik_filter: (el) => ({
                    "Kapaciteta pomnilnika": el["#text"]
					// const match = el["#text"].match(/(\d+)\s?(GB|TB)/i);
					// return {
					// 	"Kapaciteta pomnilnika": match
					// 		? `${match[1]} ${match[2]}`
					// 		: el["#text"],
					// };
				}),
				ssd_filter: (el) => ({
                    "Kapaciteta diska": el["#text"]
					// const match = el["#text"].match(/(\d+)\s?(GB|TB)/i);
					// return {
					// 	"Kapaciteta diska": match
					// 		? `${match[1]} ${match[2]}`
					// 		: el["#text"],
					// };
				}),
				graficna_kartica_filter: (el) => ({ "Grafična kartica": el["#text"] }),
				operacijski_sistem_filter: (el) => ({
					"Operacijski sistem": el["#text"],
				}),
			},
			Mini: {
				procesor: (el) => ({ Procesor: el["#text"] }),
				pomnilnik: (el) => {
					const match = el["#text"].match(/(\d+)\s?(GB|TB)/i);
					return {
						"Kapaciteta pomnilnika": match
							? `${match[1]} ${match[2]}`
							: el["#text"],
					};
				},
				trdi_disk: (el) => {
					if (el["#text"].includes("možnost"))
						return { "Kapaciteta diska": "brez" };
					const match = el["#text"].match(/(\d+)\s?(GB|TB)/i);
					return {
						"Kapaciteta diska": match
							? `${match[1]} ${match[2]}`
							: el["#text"],
					};
				},
				graficna_kartica: (el) => ({ "Grafična kartica": el["#text"] }),
				operacijski_sistem_filter: (el) => ({
					"Operacijski sistem": el["#text"],
				}),
			},
			"Tablični računalniki": {
				procesor: (el) => ({ Procesor: el["#text"] }),
				pomnilnik: (el) => ({
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
				trdi_disk: (el) => ({
					"Kapaciteta diska": AcordAttributes.extractCapacity(
						el["#text"]
					),
				}),
				// graficna_kartica: (el) => ({ "Grafična kartica": el["#text"] }),
				operacijski_sistem: (el) => ({
					"Operacijski sistem": el["#text"],
				}),
			},
			"NAS sistemi": {
				// sto_procesor: (el) => ({ Procesor: el["#text"] }),
				tip_sto: (el) => ({ Postavitev: el["#text"] }),
				sto_pomnilnik: (el) => ({
					"Kapaciteta pomnilnika": AcordAttributes.extractCapacity(
						el["#text"]
					),
				}),
				sto_prikljucki: (el) => {
					const match = el["#text"].match(/\b\d+x\sRJ-?45\b/i);
					return match
						? { "št. LAN priklopov": match[0].replace("-", "") }
						: {};
				},
				sto_reze_za_diske: (el) => ({ "Število diskov": el["#text"] }),
			},
			Monitorji: {
				priklop: (el) => ({ Vhodi: el["#text"] }),
				mon_frekvenca_tekst: (el) => ({ Osveževanje: el["#text"] }),
				tip_matrike: (el) => ({ Matrika: el["#text"] }),
				diagonala_zaslona: (el) => ({
					"Velikost zaslona": el["#text"],
				}),
				optimalna_locljivost: (el) => ({ Ločljivost: el["#text"] }),
				dodatno: (el) =>
					el["#text"].includes("ukrivljenost")
						? { "Ukrivljen zaslon": "Da" }
						: {},
				vgrajeni_zvocniki: (el) => ({ Zvočniki: el["#text"] }),
			},
			"Osnovne plošče": {
				podnozje: (el) => ({ Podnožje: el["#text"] }),
				vezni_nabor: (el) => ({ "Vezni nabor": el["#text"] }),
				format_filter_maticne: (el) => ({ Format: el["#text"] }),
				pomnilnik: (el) => ({ "Pomnilniške reže": el["#text"] }),
			},
			Procesorji: {
				tip_procesorja: (el) => ({ Procesor: el["#text"] }),
				podnozje: (el) => ({ Podnožje: el["#text"] }),
			},
			Pomnilniki: {
				tip_ram: (el) => ({ "Vrsta pomnilnika": el["#text"] }),
				kapaciteta: (el) => ({
					"Kapaciteta pomnilnika": el["#text"].replace(" ", ""),
				}),
			},
			"Trdi diski": {
				tip_hdd: (el) =>
					el["#text"] === "No" ? {} : { "Vrsta diska": el["#text"] },
				kapaciteta_hdd_tekst: (el) => ({
					"Kapaciteta diska": el["#text"],
				}),
				vmesnik: (el) => ({ Vmesnik: el["#text"] }),
				format: (el) =>
					el["#text"] === "No"
						? {}
						: { "Velikost diska": el["#text"] },
			},
			Ohišja: {
				cas_tip: (el) => ({ Velikost: el["#text"] }),
				napajalnik: (el) => ({ Napajalnik: el["#text"] }),
			},
			Napajalniki: {
				moc: (el) => ({ Moč: AcordAttributes.replaceVat(el["#text"]) }),
				// pws_format_filter: (el) => ({ Format: el["#text"] }),
                pws_lastnosti: (el) => ({
                    Modularni: el["#text"]?.toLowerCase().includes("modularni") ? "Da" : "Ne"
                })
			},
			"Grafične kartice": {
				proizvajalec_cipovja: (el) => ({ GPU: el["#text"] }),
				graficni_procesor: (el) => ({
					"Grafični procesor": el["#text"],
				}),
				graficni_pomnilnik: (el) => ({
					"Pomnilnik": el["#text"],
				}),
			},
			Hlajenje: {
				namembnost: (el) => ({ "Vrsta hlajenja": el["#text"] }),
			},
			Tipkovnice: {
				povezljivost: (el) => ({ Povezava: el["#text"] }),
				drugo: (el) =>
					el["#text"].includes("mehanske") ? { Mehanska: "Da" } : {},
			},
			Miške: {
				povezljivost: (el) => ({ Povezava: el["#text"] }),
				tip_mou: (el) => ({ Senzor: el["#text"] }),
				mou_locljivost: (el) => ({ DPI: el["#text"] }),
			},
			Slušalke: {
				heapho_povezljivost: (el) => ({ Povezava: el["#text"] }),
				heapho_mikrofon: (el) => ({ Mikrofon: el["#text"] }),
			},
			"Usmerjevalniki, stikala in AP": {
				netswi_namestitev: (el) => ({ Vrsta: "Stikalo" }),
				netapo_postavitev_filter: (el) => ({ Vrsta: "Dostopna točka" }),
				antena: (el) => ({ Vrsta: "Usmerjevalnik" }),
				stevilo_portov: (el) => {
					const numberMatch = el["#text"].match(/\b\d+x\b/i);
					const speedMatch = el["#text"].match(
						/\b(?:\d+(\.\d+)?(?:\/\d+)*\s?(Mbps|Gbps)|Gigabit)\b/i
					);
					return {
						"št. LAN priklopov": numberMatch
							? numberMatch[0]
							: "Ni navedeno",
						Hitrost: speedMatch
							? speedMatch[0].replace(/\s/g, "")
							: "Ni navedeno",
					};
				},
				lan_porti: (el) => {
					const numberMatch = el["#text"].match(/\b\d+x\b/i);
					const speedMatch = el["#text"].match(
						/\b(?:\d+(\.\d+)?(?:\/\d+)*\s?(Mbps|Gbps)|Gigabit)\b/i
					);
					return {
						"št. LAN priklopov": numberMatch
							? numberMatch[0]
							: "Ni navedeno",
						Hitrost: speedMatch
							? speedMatch[0].replace(/\s/g, "")
							: "Ni navedeno",
					};
				},
				hitrost: (el) => ({ Hitrost: el["#text"] }),
				brezzicna_hitrost: (el) => ({ Hitrost: el["#text"] }),
			},
			"Mrežne kartice, antene, WIFI ojačevalci": {
				hitrost: (el) => ({ Hitrost: el["#text"] }),
				netcrd_povezava_filter: (el) => ({
					Vrsta: "Mrežna kartica",
					"Vrsta povezave": el["#text"],
				}),
				netant_tip_filter: (el) => ({ Vrsta: "Antena" }),
				netext_tip_filter: (el) => ({ Vrsta: "Wifi ojačevalec" }),
				netext_hitrost: (el) => ({ Hitrost: el["#text"] }),
			},
			Zvočniki: {
				spk_priklop_filter: (el) => ({ Povezava: el["#text"] }),
				stevilo_zvocnikov: (el) => ({ Sistem: el["#text"] }),
			},
			"Spletne kamere": {
				cam_locljivost_snemanja: (el) => ({ Ločljivost: el["#text"] }),
			},
			"USB ključi": {
				kapaciteta: (el) => ({ "Kapaciteta ključka": el["#text"] }),
				vmesnik: (el) => ({ Hitrost: el["#text"] }),
			},
			"Spominske kartice in čitalci": {
				kapaciteta: (el) => ({ "Kapaciteta": el["#text"] }),
				hitrost_zapisovanja: (el) => ({
					"Hitrost zapisovanja": el["#text"],
				}),
				hitrost_branja: (el) => ({ "Hitrost branja": el["#text"] }),
				tip_spominske_kartice: (el) => ({ "Tip kartice": el["#text"] }),
				tip_carrdr: (el) => ({ Čitalec: "Da" }),
			},
			"Brezprekinitveni napajalniki": {
				izhodna_moc_w: (el) => ({ Moč: el["#text"] }),
				ups_rack: (el) => ({ Postavitev: el["#text"] }),
			},
			"Konferenčna oprema": {
				
			},
		};

		const handlers = attributeHandlers[this.category] || {};

		this.attribute.forEach((el) => {
			const id = el["@_id"];
			const handler = handlers[id];


			if (handler) {
				const result = handler(el);
				Object.assign(filterData, result);
			} else {
                Object.assign(attributes, AcordAttributes.defaultHandler(el));
			}
		});
        // console.log(filterData);
		return { attributes, filterData };
	}
}

export default AcordAttributes;
