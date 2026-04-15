import DobaviteljController from "./DobaviteljController.ts";

export default class AvteraController extends DobaviteljController {
	constructor(categoryMap, Attributes, ...args) {
		super(...args);
		this.categoryMap = categoryMap;
		this.Attributes = Attributes;
	}
	name = "avtera";
	nodes = "podjetje.izdelki.izdelek";
	file = "avtera.xml";
	encoding = "windows1250";
	keys = [
		"EAN",
		"izdelekIme",
		"niPodatka",
		"opis",
		"nabavnaCena",
		"DC",
		"PPC",
		"davcnaStopnja",
		"niPodatka",
		"slikaVelika",
		"dodatneSlike",
		"dodatneLastnosti",
		"blagovnaZnamka",
		"kategorija",
		"EprelID",
		"dobava",
	];

	ignoreCategorySet = new Set([
		"Dodatki",
		"Rezervni deli",
		"Kabli in adapterji",
		"Vinske omarice",
		"Električni skuterji",
		"Dodatki za skiroje",
		"Poslovni telefoni",
		"Dodatki za telefone",
		"ReproMS",
		"Pripomočki za male živali",
		"Daljnogledi",
		"Diktafoni in dodatki",
		"Dodatki za fotoaparate",
		"Dodatki za tiskalnike",
		"Domači kino",
		"Fotoaparati",
		"Tiskalniški strežniki",
		"Grafične kartice",
		"Zobne ščetke in prhe",
		"Sprehajalne steze",
		"Kalkulatorji",
		"Potovalni kovčki",
        "Mobilna telefonija",
        "Prenosne polnilne baterije",
        "Mikrofoni",
        "Medijski predvajalniki",
        "Dodatki za strežnike",
	]);

	exceptions(param) {
		if (param["EAN"] === "" || param["EAN"].toString().length < 5) {
			return true;
		}
		if (this.ignoreCategorySet.has(param["kategorija"]["#text"])) {
			return true;
		}
	}

	formatZaloga(zaloga) {
		return zaloga["@_id"] === "0" ? "Na zalogi" : "Ni na zalogi";
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

	getEprel(key) {}
}
