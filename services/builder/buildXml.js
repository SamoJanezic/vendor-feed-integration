// buildXml.js
import fsp from "fs/promises";
import { XMLBuilder } from "fast-xml-parser";
import { getIzdelekInfo } from "../../db/sql.js";
import { createBody } from "./createBody.js";
import { getCurrentTimestamp } from "./utils.js";
import xmlCategories from "./xmlCategories.js";

const parser = new XMLBuilder({
	ignoreAttributes: false,
	format: true,
	cdataPropName: "cdata",
});

export async function build() {
	// const file = "xml/build/softtrade.xml";
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
		for (const [mainCategory, subCategories] of Object.entries(
			xmlCategories
		)) {
			console.log(`Fetching product list for ${mainCategory}...`);
			const izdelekInfo = await getIzdelekInfo(subCategories);

			console.log(`Generating ${izdelekInfo.length} product entries...`);
			const allProducts = await Promise.all(
				izdelekInfo.map((el) => createBody(el))
			);

			const rootObj = {
				podjetje: {
					"@_id": "Softtrade, Ljutomer",
					"@_ts": getCurrentTimestamp(),
					"@_opis_storitve": "",
					izdelki: { izdelek: allProducts },
				},
			};

			const fullXml =
				`<?xml version="1.0" encoding="UTF-8"?>\n` +
				parser.build(rootObj);

			const fileName = `xml/build/softtrade_${mainCategory}.xml`;
			console.log(`Writing XML file: ${fileName}...`);
			await fsp.writeFile(fileName, fullXml, "utf8");
			console.log(`✅ Finished writing ${fileName}`);
		}

		clearInterval(spinner);
	} catch (err) {
		clearInterval(spinner);
		console.error("❌ Error building XML:", err);
	}
}
