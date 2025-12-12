// createBody.js
import { getAtributInfo, getSlikaInfo, getFilterInfo } from "../../db/sql.js";

export async function createBody(el) {
	const izdelekId = `softT${el.id}`;
	const atributInfo = await getAtributInfo(el.ean);
	const slike = await getSlikaInfo(el.ean);
	const filterInfo = await getFilterInfo(el.ean);

	const dodatneLastnosti = {
		lastnost: atributInfo[0].map(attr => ({
			'@_naziv': attr.komponenta,
			'@_id': attr.komponenta_id,
			cdata: attr.atribut || "",
		}))
	};

	const atributi = {
		lastnost: filterInfo.map(f => ({
			'@_naziv': f.naziv,
			'@_id': f.filter_id,
			cdata: f.value || "",
		}))
	};

	let count = 1;
	const dodatneSlike = {};
	slike.filter(img => img.tip === "dodatna").forEach(img => {
		dodatneSlike[`dodatnaSlika${count++}`] = { cdata: img.slika_url };
	});

	const slikaMala = slike.find(s => s.tip === "mala")?.slika_url || "";
	const slikaVelika = slike.find(s => s.tip === "velika")?.slika_url || "";

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
		blagovnaZnamka: { "@_id": el.blagovna_znamka, cdata: el.blagovna_znamka },
		dimenzijePaketa: {
			"@_kratekZapisVCm": el.dimenzije_paketa || "xx",
			depth: { "@_unitOfMeasure": "MM", cdata: el.depth || "/" },
			height: { "@_unitOfMeasure": "MM", cdata: el.height || "/" },
			width: { "@_unitOfMeasure": "MM", cdata: el.width || "/" },
			grossWeight: { "@_unitOfMeasure": "KG", cdata: el.grossWeight || "/" },
			netWeight: { "@_unitOfMeasure": "KG", cdata: el.netWeight || "/" },
		},
		davcnaStopnja: el.davcna_stopnja,
		kategorija: { "@_id": el.kategorija_id, cdata: el.kategorija },
		slikaMala: { cdata: slikaMala },
		slikaVelika: { cdata: slikaVelika },
		dobava: { "@_id": el.zaloga === "Na zalogi" ? 1 : 0, cdata: el.zaloga },
		spletnaStranProizvajalca: { cdata: el.spletnaStranProizvajalca || "" },
		dodatneLastnosti,
		atributi,
		dodatneSlike,
	};
}
