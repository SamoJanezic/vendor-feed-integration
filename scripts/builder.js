import fsp from "fs/promises";
import { XMLBuilder } from "fast-xml-parser";
import { getIzdelekInfo, getAtributInfo, getSlikaInfo } from "../db/sql.js";

// Configure XML builder
const parser = new XMLBuilder({
	ignoreAttributes: false,
	format: true,
	cdataPropName: "cdata",
});

function getCurrentTimestamp() {
	const now = new Date();
	const pad = (n) => n.toString().padStart(2, "0");
	return `${pad(now.getDate())}.${pad(
		now.getMonth() + 1
	)}.${now.getFullYear()} ${pad(now.getHours())}:${pad(
		now.getMinutes()
	)}:${pad(now.getSeconds())}`;
}

async function createBody(el) {
	const izdelekId = `softT${el.id}`;
	const atributInfo = await getAtributInfo(el.ean);
	const slike = await getSlikaInfo(el.ean);

const dodatneLastnosti = {
  lastnost: atributInfo[0].map(attr => ({
    '@_naziv': attr.komponenta,
    '@_id': attr.komponenta_id,
    cdata: attr.atribut || "",
  }))
};

	let count = 1;
	const dodatneSlike = {};
	slike
		.filter((img) => img.tip === "dodatna")
		.forEach((img) => {
			dodatneSlike[`dodatnaSlika${count++}`] = { cdata: img.slika_url };
		});

	const slikaMala = slike.find((s) => s.tip === "mala")?.slika_url || "";
	const slikaVelika = slike.find((s) => s.tip === "velika")?.slika_url || "";

	return {
		"@_id": el.id,
		izdelekID: izdelekId,
		EAN: el.ean,
		izdelekIme: { cdata: el.izdelek_ime },
		url: { cdata: el.url || "" },
		opis: { cdata: el.izdelek_opis || "" },
		PPC: el.ppc,
		cenaAkcijska: "",
		nabavnaCena: el.nabavna_cena,
		DC: el.dealer_cena,
		DRabat: 0,
		blagovnaZnamka: {
			"@_id": el.blagovna_znamka,
			cdata: el.blagovna_znamka,
		},
		dimenzijePaketa: {
			"@_kratekZapisVCm": el.dimenzije_paketa || "xx",
			depth: { "@_unitOfMeasure": "MM", cdata: el.depth || "/" },
			height: { "@_unitOfMeasure": "MM", cdata: el.height || "/" },
			width: { "@_unitOfMeasure": "MM", cdata: el.width || "/" },
			grossWeight: {
				"@_unitOfMeasure": "KG",
				cdata: el.grossWeight || "/",
			},
			netWeight: { "@_unitOfMeasure": "KG", cdata: el.netWeight || "/" },
		},
		davcnaStopnja: el.davcna_stopnja,
		kategorija: { "@_id": el.kategorija_id, cdata: el.kategorija },
		slikaMala: { cdata: slikaMala },
		slikaVelika: { cdata: slikaVelika },
		dobava: { "@_id": el.zaloga === "Na zalogi" ? 1 : 0, cdata: el.zaloga },
		spletnaStranProizvajalca: { cdata: el.spletnaStranProizvajalca || "" },
		dodatneLastnosti,
		dodatneSlike,
	};
}

export async function build() {
	const file = "xml/build/softtrade.xml";

	const spinnerChars = ["|", "/", "-", "\\"];
	let spinnerIndex = 0;

	const spinner = setInterval(() => {
		process.stdout.write(
			`\rBuilding XML ${
				spinnerChars[spinnerIndex++ % spinnerChars.length]
			}`
		);
	}, 200);

	try {
		console.log("Fetching product list...");
		const izdelekInfo = await getIzdelekInfo();

		console.log(`Generating ${izdelekInfo[0].length} product entries...`);
		const allProducts = await Promise.all(
			izdelekInfo[0].map((el) => createBody(el))
		);

		const rootObj = {
			podjetje: {
				"@_id": "Softtrade, Ljutomer",
				"@_ts": getCurrentTimestamp(),
				"@_opis_storitve": "",
				izdelki: {
					izdelek: allProducts,
				},
			},
		};

		const fullXml =
			`<?xml version="1.0" encoding="UTF-8"?>\n` + parser.build(rootObj);

		clearInterval(spinner);
		console.log("Writing XML file...");
		await fsp.writeFile(file, fullXml, "utf8");

		console.log(`✅ Writing of ${file} finished!`);
	} catch (err) {
		clearInterval(spinner);
		console.error(`❌ Error building XML: ${err.message}`);
	}
}

build();
