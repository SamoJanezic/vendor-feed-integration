import DobaviteljController from "./DobaviteljController.js";
export default class AcordController extends DobaviteljController {
	constructor(categoryMap, Attributes, ...args) {
		super(...args);
		this.categoryMap = categoryMap;
		this.Attributes = Attributes;
	}
	name = "acord";
	nodes = "podjetje.izdelki.izdelek";
	file = "acord.xml";
	encoding = "utf8";
	keys = [
		"EAN",
		"izdelekIme",
		"niPodatka",
		"opis",
		"nabavnaCena",
		"DC",
		"PPC",
		"davcnaStopnja",
		"slikaMala",
		"slikaVelika",
		"dodatneSlike",
		"dodatneLastnosti",
		"blagovnaZnamka",
		"kategorija",
		"eprel",
		"dobava",
	];

	ignoreCategorySet = new Set([
        "Športni dodatki",
		"Kolutni podaljški",
		"Žarnice",
		"Zunanja svetila",
		"Namizna svetila",
		"Naglavna svetila",
		"Ročna svetila",
		"Pametne inštalacije",
		"Povečevalne lupe",
		"LED okrasitev",
		"Kabli in dodatki",
		"Svetlobni elementi",
		"Svetila",
		"Kabli in adapterji",
		"Dodatna oprema za komponente",
		"Dodatki za računalnike",
		"Dodatna oprema za monitorje",
		"Transformatorji",
		"Root catalog",
		"Ročno orodje",
		"Baterijsko orodje",
		"Multimedijski predvajalniki",
		"Omare in dodatki",
		"Omare",
		"LED zasloni",
		"Računalniške mize",
		"Polnilci",
		"Napajalni adapterji",
		"LED trakovi",
		"Razdelilci in podaljški",
		//TODO
		"Zunanje naprave",
		"Orodje",
		"Optične enote",
		"Stikala",
		"Senzorji",
		"Dodatna oprema za omare",
		"Igračarski pripomočki",
		"Baterije",
		"Dodatna oprema za mrežno",
		"Dodatna oprema za projektorje",
		"Električna mobilnost",
		"Globinske 3D kamere",
		"Hubi, čitalci",
		"Mikroskopi",
		"Interaktivni zasloni",
		"Powerbank baterije",
		"Dodatna oprema",
	]);

	exceptions(param) {
		if (
			param["EAN"] === "" ||
			param["EAN"].toString().length < 5 ||
			param["EAN"].toString().includes(" ") ||
			param["EAN"] === null
		) {
			return true;
		}
		if (this.ignoreCategorySet.has(param["kategorija"]["#text"])) {
			return true;
		}
	}

	parseObject(obj) {
		if (obj.dodatnaSlika1) {
			return Object.values(obj);
		}
		if (!obj.hasOwnProperty("lastnost")) {
			return obj["#text"];
		}
		if (obj.lastnost) {
			return obj;
		}
	}

	formatZaloga(zaloga) {
		return zaloga["@_id"] === "1" ? "Na zalogi" : "Ni na zalogi";
	}

	getEprel(key) {
		return key ? key.match(/[0-9]+/g)?.[0] ?? null : null;
	}
}