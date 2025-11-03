import { db } from "./db.js";
import { modelsMap } from "../models/index.js";

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
		if(tableName === modelsMap.IzdelekDobavitelj) {
			tableName
				.bulkCreate(data, { updateOnDuplicate: ['dealer_cena', 'nabavna_cena', 'ppc'] })
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

export async function getIzdelekInfo() {
	return await db.query(
		`SELECT MIN(izdelek_ean) AS	ean,
			id,
			izdelek_ime,
			izdelek_opis,
			ppc,
			nabavna_cena,
			dealer_cena,
			blagovna_znamka,
			davcna_stopnja,
			kategorija_id,
			kategorija,
			zaloga
		FROM IZDELEK
			INNER JOIN
			IZDELEK_DOBAVITELJ ON IZDELEK.ean = IZDELEK_DOBAVITELJ.izdelek_ean
			INNER JOIN
			KATEGORIJA ON IZDELEK_DOBAVITELJ.KATEGORIJA_kategorija = KATEGORIJA.kategorija
			WHERE aktiven = 1
			GROUP BY ean`
	);
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
		raw: true
	})
}

export async function upsertTable(tableName, allData) {
    for (const data of allData) {
        const [instance, created] = await tableName.findOrCreate({
            where: {
                izdelek_ean: data.izdelek_ean,
                DOBAVITELJ_dobavitelj: data.DOBAVITELJ_dobavitelj
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
                aktiven: data.aktiven
            }
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
                where: { kategorija_id: id }
            }
        );
        return affectedRows;
    } catch (error) {
        console.error("Error updating Kategorija:", error);
        throw error;
    }
}
