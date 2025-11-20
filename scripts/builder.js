import fsp from "fs/promises";
import { getIzdelekInfo, getAtributInfo, getSlikaInfo } from "../db/sql.js";

async function createBody(el) {
  const izdelekId = `softT${el.id}`;
  const atributInfo = await getAtributInfo(el.ean);
  const slike = await getSlikaInfo(el.ean);

  const dodatneLastnosti = atributInfo[0]
    .map(attr =>
      `        <lastnost naziv="${attr.komponenta.replace('"', '')}" id="${attr.komponenta_id}"><![CDATA[${attr.atribut}]]></lastnost>`
    )
    .join("\r\n");

  let count = 1;
  const dodatneSlike = slike
    .filter(img => img.tip === "dodatna")
    .map(img => `        <dodatnaSlika${count++}><![CDATA[${img.slika_url}]]></dodatnaSlika${count - 1}>`)
    .join("\r\n");

  const slikaMala = slike.find(s => s.tip === "mala")?.slika_url || "";
  const slikaVelika = slike.find(s => s.tip === "velika")?.slika_url || "";

  return `  <izdelek id="${el.id}">
      <izdelekID>${izdelekId}</izdelekID>
      <EAN>${el.ean}</EAN>
      <izdelekIme><![CDATA[${el.izdelek_ime}]]></izdelekIme>
      <url/>
      <opis><![CDATA[${el.izdelek_opis}]]></opis>
      <PPC>${el.ppc}</PPC>
      <cenaAkcijska></cenaAkcijska>
      <nabavnaCena>${el.nabavna_cena}</nabavnaCena>
      <DC>${el.dealer_cena}</DC>
      <DRabat>0</DRabat>
      <blagovnaZnamka id="${el.blagovna_znamka}"><![CDATA[${el.blagovna_znamka}]]></blagovnaZnamka>
      <dimenzijePaketa kratekZapisVCm="xx">
        <depth unitOfMeasure="MM">/</depth>
        <height unitOfMeasure="MM">/</height>
        <width unitOfMeasure="MM">/</width>
        <grossWeight unitOfMeasure="KG">/</grossWeight>
        <netWeight unitOfMeasure="KG">/</netWeight>
      </dimenzijePaketa>
      <davcnaStopnja>${el.davcna_stopnja}</davcnaStopnja>
      <kategorija id="${el.kategorija_id}">${el.kategorija}</kategorija>
      <slikaMala><![CDATA[${slikaMala}]]></slikaMala>
      <slikaVelika><![CDATA[${slikaVelika}]]></slikaVelika>
      <dobava id="${el.zaloga === "Na zalogi" ? 1 : 0}">${el.zaloga}</dobava>
      <spletnaStranProizvajalca></spletnaStranProizvajalca>
      <dodatneLastnosti>
${dodatneLastnosti}
      </dodatneLastnosti>
      <dodatneSlike>
${dodatneSlike}
      </dodatneSlike>
    </izdelek>
  `;
}

function getCurrentTimestamp() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const dd = pad(now.getDate());
    const mm = pad(now.getMonth() + 1);
    const yyyy = now.getFullYear();
    const hh = pad(now.getHours());
    const min = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    return `${dd}.${mm}.${yyyy} ${hh}:${min}:${ss}`;
}


export async function build() {
  const file = `xml/build/softtrade.xml`;

  const head = `<?xml version="1.0" encoding="UTF-8"?>
<podjetje id="Softtrade, Ljutomer" ts="${getCurrentTimestamp()}" opis_storitve="https://www.pcplus.si/catalog-export/">
  <izdelki>
`;
  const foot = `</izdelki>
</podjetje>`;

  try {
    console.log("Fetching product list...");
    const izdelekInfo = await getIzdelekInfo();

    console.log(`Generating ${izdelekInfo[0].length} product entries...`);
    const bodies = await Promise.all(
      izdelekInfo[0].map(el => createBody(el))
    );

    const xmlContent = head + bodies.join("") + foot;

    console.log("Writing XML file...");
    await fsp.writeFile(file, xmlContent, "utf8");

    console.log(`✅ Writing of ${file} finished!`);
  } catch (err) {
    console.error(`❌ Error building XML: ${err.message}`);
  }
}

build()