// buildXml.js
import fsp from "fs/promises";
import { XMLBuilder } from "fast-xml-parser";
import { getIzdelekInfo } from "../../db/sql.js";
import { createBody } from "./createBody.js";
import { getCurrentTimestamp } from "./utils.js";

const parser = new XMLBuilder({
	ignoreAttributes: false,
	format: true,
	cdataPropName: "cdata",
});

export async function build() {
	const file = "xml/build/softtrade.xml";
	const spinnerChars = ["|", "/", "-", "\\"];
	let spinnerIndex = 0;

	const spinner = setInterval(() => {
		process.stdout.write(
			`\rBuilding XML ${spinnerChars[spinnerIndex++ % spinnerChars.length]}`
		);
	}, 200);

	try {
		console.log("Fetching product list...");
		const izdelekInfo = await getIzdelekInfo();

		console.log(`Generating ${izdelekInfo[0].length} product entries...`);
		const allProducts = await Promise.all(
			izdelekInfo[0].map(el => createBody(el))
		);

		const rootObj = {
			podjetje: {
				"@_id": "Softtrade, Ljutomer",
				"@_ts": getCurrentTimestamp(),
				"@_opis_storitve": "",
				izdelki: { izdelek: allProducts },
			},
		};

		const fullXml = `<?xml version="1.0" encoding="UTF-8"?>\n` + parser.build(rootObj);

		clearInterval(spinner);
		console.log("Writing XML file...");
		await fsp.writeFile(file, fullXml, "utf8");

		console.log(`✅ Writing of ${file} finished!`);
	} catch (err) {
		clearInterval(spinner);
		console.error(`❌ Error building XML: ${err.message}`);
	}
}
