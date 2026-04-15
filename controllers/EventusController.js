import DobaviteljController from "./DobaviteljController.ts";

export default class EventusController extends DobaviteljController {
	constructor(categoryMap, Attributes, ...args) {
		super(...args);
		this.categoryMap = categoryMap;
		this.Attributes = Attributes;
	}
	name = "eventus";
	nodes = "podjetje.izdelki.izdelek";
	file = "eventus.xml";
	encoding = "utf8";
	keys = [
		"EAN",
		"izdelekIme",
		"kratek_opis",
		"opis",
		"nabavnaCena",
		"DC",
		"PPC",
		"davcnaStopnja",
		"slikaVelika",
		"slikaVelika",
		"dodatneSlike",
		"dodatneLastnosti",
		"blagovnaZnamka",
		"kategorija",
		"niPodatka",
		"dobava",
	];

	ignoreCategorySet = new Set([
		"Promocija",
		"Odprodaja %",
		"LED osvetlitev",
		"Rezervni deli",
		"GLS",
		"Polnilne baterije in postaje",
		"Varnostni dodatki",
		"Stojala",
		"Polnilne baterije",
		"Oprema za telefone in ure",
		"Polnilci",
		"Zvočne kartice",
		"Pisala, stojala in dodatki",
		"Čistila za tehniko",
		"Strojne denarnice",
		"Varnostne kopije in dodatki",
		"Kabli",
		"Adapterji",
        "Računalniki"
	]);

	exceptions(param) {
		if (this.ignoreCategorySet.has(param["kategorija"]["#text"])) {
			return true;
		}
		if (!param["EAN"]) {
			return true;
		}
	}

	parseObject(obj) {
		let str = "";
		if (obj.dodatnaSlika1) {
			return Object.values(obj);
		}
		if (!obj.hasOwnProperty("lastnost")) {
			return obj["#text"];
		}
		if (obj.lastnost) {
			return obj;
		}
		return str;
	}

	formatZaloga(zaloga) {
		return zaloga["@_id"] === "1" ? "Ni na zalogi" : "Na zalogi";
	}

	getEprel(key) {}
}
