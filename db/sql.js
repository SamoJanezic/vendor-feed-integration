import { db } from "./db.js";
import { modelsMap } from "../models/index.js";
import "../models/associations.js";
import { fn, col } from "sequelize";

export function createTable(tableName) {
	tableName
		.sync({ force: true })
		.then(() => {
			console.log(`Successfully created table ${tableName}`);
		})
		.catch((err) => {
			console.error(err);
		});
}

export function insertIntoTable(tableName, data) {
	if (data.length) {
		if (tableName === modelsMap.IzdelekDobavitelj) {
			tableName
				.bulkCreate(data, {
					updateOnDuplicate: ["dealer_cena", "nabavna_cena", "ppc"],
				})
				.then(() => {
					console.log(
						`Successfully inserted ${data.length} entries into ${tableName}`
					);
				})
				.catch((err) => {
					console.error(err);
				});
		}
		tableName
			.bulkCreate(data, { ignoreDuplicates: true })
			.then(() => {
				console.log(
					`Successfully inserted ${data.length} entries into ${tableName}`
				);
			})
			.catch((err) => {
				console.error(err);
			});
	} else {
		tableName
			.create(data)
			.then(() => {
				console.log(`Successfully inserted entry into ${tableName}`);
			})
			.catch((err) => {
				console.error(err);
			});
	}
}

export function selectAll(tableName, cols) {
	tableName
		.findAll({
			attributes: cols,
		})
		.then((data) => {
			return data;
		})
		.catch((err) => {
			console.error(err);
		});
}

export function updateItem(tableName, id, pairs) {
	tableName
		.update(req.body.values, {
			where: { id: req.body.values.id },
		})
		.then(() => {
			res.status(200);
		})
		.catch((err) => {
			console.error(err);
		});
}

// export async function getIzdelekInfo() {
// 	return await db.query(
// 		`SELECT MIN(izdelek_ean) AS	ean,
// 			id,
// 			izdelek_ime,
// 			izdelek_opis,
// 			ppc,
// 			nabavna_cena,
// 			dealer_cena,
// 			blagovna_znamka,
// 			davcna_stopnja,
// 			KATEGORIJA.kategorija_id,
// 			KATEGORIJA.kategorija,
// 			zaloga
// 		FROM IZDELEK
// 			INNER JOIN
// 			IZDELEK_DOBAVITELJ ON IZDELEK.ean = IZDELEK_DOBAVITELJ.izdelek_ean
// 			INNER JOIN
// 			KATEGORIJA ON IZDELEK_DOBAVITELJ.KATEGORIJA_kategorija = KATEGORIJA.kategorija
// 			WHERE aktiven = 1
// 			GROUP BY ean`
// 	);
// }

export async function getIzdelekInfo(categoryArr) {
  return await modelsMap.IzdelekDobavitelj.findAll({
    attributes: [
      [fn("MIN", col("IzdelekDobavitelj.izdelek_ean")), "ean"],

      "izdelek_ime",
      "izdelek_opis",
    //   "izdelek_kratki_opis",
      "ppc",
      "nabavna_cena",
      "dealer_cena",
      "zaloga",

      [col("Izdelek.davcna_stopnja"), "davcna_stopnja"],
      [col("Izdelek.blagovna_znamka"), "blagovna_znamka"],

      [col("Kategorija.kategorija_id"), "kategorija_id"],
      [col("Kategorija.kategorija"), "kategorija"]
    ],
    include: [
        {
            model: modelsMap.Izdelek,
            as: "izdelek",
            attributes: []
        },
        {
            model: modelsMap.Kategorija,
            attributes: []
        }
    ],
    where: { aktiven: 1, KATEGORIJA_kategorija: categoryArr},
    group: [
      "IzdelekDobavitelj.izdelek_ean",
      "Izdelek.davcna_stopnja",
      "Izdelek.blagovna_znamka",
      "Kategorija.kategorija_id",
      "Kategorija.kategorija"
    ],
    raw: true
  });
}

export async function getAtributInfo(ean) {
	return await db.query(
		`SELECT komponenta_id,
			komponenta,
			atribut
		FROM KATEGORIJA
			INNER JOIN
			KOMPONENTA ON KATEGORIJA.kategorija = KOMPONENTA.KATEGORIJA_kategorija
			INNER JOIN
			ATRIBUT ON KOMPONENTA.komponenta = ATRIBUT.KOMPONENTA_komponenta
			INNER JOIN
			IZDELEK_DOBAVITELJ ON ATRIBUT.izdelek_ean = IZDELEK_DOBAVITELJ.izdelek_ean AND
				IZDELEK_DOBAVITELJ.KATEGORIJA_kategorija = KATEGORIJA.kategorija
		WHERE IZDELEK_DOBAVITELJ.izdelek_ean = "${ean}"
		ORDER BY ATRIBUT.id`
	);
}

export async function getSlikaInfo(ean) {
	return await modelsMap.Slika.findAll({
		attributes: ["slika_url", "tip"],
		where: {
			izdelek_ean: ean,
		},
		raw: true,
	});
}

export async function getFilterInfo(ean) {
    const filterValues = await modelsMap.IzdelekFilter.findAll({
        where: { izdelek_ean: ean },
        include: [
            {
                model: modelsMap.Filter,
                attributes: ['filter_id', 'filter_naziv'],
                required: true, // only include rows that have a matching Filter
            }
        ]
    });

    const formatted = filterValues.map(fd => ({
        ean: fd.izdelek_ean,
        filter_id: fd.Filter.filter_id,
        naziv: fd.Filter.filter_naziv,
        value: fd.filter_vrednost
    }));

    return formatted;
}

export async function upsertTable(tableName, allData) {
	for (const data of allData) {
		const [instance, created] = await tableName.findOrCreate({
			where: {
				izdelek_ean: data.izdelek_ean,
				DOBAVITELJ_dobavitelj: data.DOBAVITELJ_dobavitelj,
			},
			defaults: {
				KATEGORIJA_kategorija: data.KATEGORIJA_kategorija,
				izdelek_ime: data.izdelek_ime,
				izdelek_opis: data.izdelek_opis,
				izdelek_kratki_opis: data.izdelek_kratki_opis,
				nabavna_cena: data.nabavna_cena,
				dealer_cena: data.dealer_cena,
				ppc: data.ppc,
				zaloga: data.zaloga,
				aktiven: data.aktiven,
			},
		});

		if (!created) {
			await instance.update({
				dealer_cena: data.dealer_cena,
				nabavna_cena: data.nabavna_cena,
				ppc: data.ppc,
				zaloga: data.zaloga,
			});
		}
	}
}

export async function updateKategorija(marza, id) {
	try {
		const [affectedRows] = await Kategorija.update(
			{ marza },
			{
				where: { kategorija_id: id },
			}
		);
		return affectedRows;
	} catch (error) {
		console.error("Error updating Kategorija:", error);
		throw error;
	}
}
