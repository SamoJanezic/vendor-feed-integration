import DobaviteljController from "./DobaviteljController.js";

export default class ElkotexController extends DobaviteljController {
	constructor(categoryMap, Attributes, ...args) {
		super(...args);
		this.categoryMap = categoryMap;
		this.Attributes = Attributes;
	}
	name = "elkotex";
	nodes = "items.item";
	file = "elkotex.xml";
	encoding = "utf8";
	keys = [
		"ean",
		"naziv",
		"niPodatka",
		"opis",
		"price",
		"niPodatka",
		"mpc",
		"davek",
		"niPodatka",
		"niPodatka",
		"slike",
		"niPodatka",
		"znamkaId",
		"podkategorijaNaziv",
		"niPodatka",
		"zaloga",
	];

	ignoreCategorySet = new Set([
		undefined,
		"undefined",
		"Pametne vtičnice",
		"Pametne sijalke",
		"Uncategorized",
		"Oprema za kopalnice",
		"Medicinski pripomočki",
		"Obnovljeni računalniki",
		"Bazeni, dodatki za bazene",
		"LED sijalke, žarnice",
		"LED luči",
		"Električno orodje",
		"Pisarniški stoli",
		"Balkonske sončne elektrarne",
		"Pisarniško pohištvo",
		"Robustni telefoni",
		"Ostali izdelki",
		"Odstranjevalci vlaken",
		"Ohišja za diske",
		"Vrtno pohištvo in dodatki",
		"LED trakovi",
		"Telefonija",
		"Sokovniki",
		"Čistilniki zraka",
		"Baterije in polnilci",
		"Polnilne postaje, agregati",
		"Pohištvo",
		"Solarni paneli",
		"Namizne svetilke",
		"Dodatki",
		"Sit-stand mize, podstavki in nosilci",
		"Koši za odpadke",
		"Ostalo",
		"Rezervni deli",
		"Rezervni deli in dodatki",
		"Napajalniki za prenosnike",
		"Video adapterji",
		"Zvočni adapterji",
		"Priključni kabli in adapterji",
		"Kabli",
		"Podaljški, razdelilci",
		"Video kabli",
		"Mrežni kabli",
		"Mrežni adapterji",
		"Video kabli",
		"Urejanje kablov",
		"Avto polnilci",
		"Zvočni kabli",
		"Kabli in adapterji",
		"Hlajenje za prenosnike",
		"Rezervni deli za skiroje",
		"Torbe in nahrbtniki za prosti čas",
		"Rezervni deli in dodatki za sesalnike",
		"Nega telesa",
		"Domofoni",
		"Vremenske postaje",
		"Kuhinjski organizatorji",
		"Kuhinjski pripomočki",
		"Priprava hrane",
		"Pametne naprave",
		"Čistila",
		"Kuhinjsko orodje",
		"Kuhinjski organizatorji",
		"Kuhinjski pripomočki",
		"Priprava hrane",
		"Senzorji",
		"Zvočne kartice",
	]);

	exceptions(param) {
		if (this.ignoreCategorySet.has(param["podkategorijaNaziv"])) {
			return true;
		}
	}

	sortCategory() {
		// Build flat map
		const flatCategoryMap = {};
		for (const [newCategory, oldCategories] of Object.entries(
			this.categoryMap
		)) {
			oldCategories.forEach((old) => {
				flatCategoryMap[old] = newCategory;
			});
		}

		this.allData.forEach((el) => {
			if (flatCategoryMap[el.kategorija]) {
				el.kategorija = flatCategoryMap[el.kategorija];
			}
		});
	}

	formatZaloga(zaloga) {
		return zaloga > 0 ? "Na zalogi" : "Ni na zalogi";
	}

	parseObject(obj) {
		if (obj.slika) {
			return Object.values(obj);
		}
	}

	getEprel() {
		return null;
		// function extractNumber(str) {
		// 	const regex = /Fiche_(\d+)_SL\.pdf/;
		// 	const match = str.match(regex);
		// 	return match ? match[1] : null;
		// }

		// const inputString = `<p><strong>diagonala zaslona</strong>: 86,36 cm/34"<br /> <strong>tip zaslona</strong>: VA<br /> <strong>format zaslona</strong>: 21:9<br /> <strong>največja ločljivost</strong>: 3440x1440 @ 100Hz<br /> <strong>odzivni čas</strong>: 4ms<br /> <strong>kontrast</strong>: 3000:1<br /> <strong>svetilnost</strong>: 500cd/<span style="line-height: 17.12px; font-size: 16px; color: #333333;">m&sup2;</span><br /> <strong>vidni kot&nbsp;</strong>(horizontalno/vertikalno): 178&deg;/178&deg;<br /> <strong>priključki</strong>: 1x HDMI 2.0, 1x DisplayPort 1.4, 1x USB-C 3.2 z PD 90W; signalni izhod DisplayPort ( DP, USB-C)<br /> <strong>zvočniki</strong>: 2x 5W<br /> <strong>poraba</strong>: On: 34,1 W, Standby: 0,5 W<br /> <strong>barva</strong>: črna<br /> <strong>dodatno</strong>: vgrajena priključna postaja USB-C za prenosnik, premaz proti ble&scaron;čanju, izhod za slu&scaron;alke, <span>Ethernet LAN do 1 Gbs, prebujanje prek omrežja LAN, spletna k<span>amera FullHD z 2,0 milijona slikovnih pik, mikrofonom in LED-indikatorjem (za Windows 10 Hello). n<span>ačin prikaza slike PIP/PBP, 180mm nastavljiv po vi&scaron;ini, -180&deg;/+180&deg;vrtljiv, HDR 400<br /></span></span></span></p>
		// <p><span><span><span>Povezava do informacijskega lista: <a href="https://eprel.ec.europa.eu/fiches/electronicdisplays/Fiche_416787_SL.pdf">https://eprel.ec.europa.eu/fiches/electronicdisplays/Fiche_416787_SL.pdf</a><br />Povezava do energetske nalepke: <a href="https://eprel.ec.europa.eu/labels/electronicdisplays/Label_416787.svg">https://eprel.ec.europa.eu/labels/electronicdisplays/Label_416787.svg</a><br /><br /></span></span></span></p>]]`;

		// const extractedNumber = extractNumber(inputString);
		// console.log(extractedNumber)
	}

	splitSlike() {
		let slike = [];
		this.allData.forEach((data) => {
			if (typeof data.dodatne_slike[0] === "object") {
				data.dodatne_slike[0].forEach((el) => {
					slike.push({
						izdelek_ean: data.ean,
						slika_url: el,
						tip: "dodatna",
					});
				});
			} else {
				slike.push({
					izdelek_ean: data.ean,
					slika_url: data.dodatne_slike[0],
					tip: "dodatna",
				});
			}
		});
		this.slika = slike;
	}

	extractLastnosti(desc) {
		const html = desc.replaceAll("&scaron;", "š").replaceAll("&nbsp;", " ");
		const clean = html.replace(/<[^>]+>/g, "\n"); // Remove HTML tags, replace with newlines
		const preprocessed = clean.replace(/([a-z0-9])([A-ZČŠŽĆĐ])/g, "$1\n$2");
		const regex = /([A-Za-zČčŠšŽžĆćĐđč\s\/\-,\(\)0-9&;]+):\s*([^<\n]+)/g;

		let match;
		const attributes = {};
		while ((match = regex.exec(preprocessed)) !== null) {
			const key = match[1]
				.trim()
				.replace(/&[a-z]+;/gi, "")
				.replaceAll("\n", ""); // Optionally clean HTML entities
			const value = match[2].trim().replaceAll("\n", "");
			attributes[key] = value;
		}

		return attributes;
	}

	splitDodatneLastnosti() {
		let lastnosti = [];

		this.allData.forEach((data) => {
			const lastnosti = this.extractLastnosti(data.opis);
			const Attributes = new this.Attributes(data.kategorija, lastnosti);
			const attrs = Attributes.formatAttributes();
			if (Object.keys(attrs).length) {
				// console.log(attrs);
			}
		});
	}

	// executeAll() {
	// 	this.createDataObject();
	// 	this.sortCategory();
	// 	this.splitSlike();
	// 	this.splitDodatneLastnosti();
	// 	this.insertDataIntoDb();
	// }
}
