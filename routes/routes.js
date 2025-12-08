import express from "express";
import { modelsMap } from "../models/index.js";
import "../models/associations.js";
import sequelize from "sequelize";
import filterCallRoutes from "./filterCalls.js";

const router = express.Router();

const models = {
	IzdelekDobavitelj: modelsMap.IzdelekDobavitelj,
	Kategorija: modelsMap.Kategorija,
	Slike: modelsMap.Slika,
	Izdelki: modelsMap.Izdelek,
	Komponente: modelsMap.Komponenta,
	Atribut: modelsMap.Atribut,
	Dobavitelj: modelsMap.Dobavitelj,
    Filter: modelsMap.Filter,
    IzdelekFilter: modelsMap.IzdelekFilter
};


router.use("/filters", filterCallRoutes);
router.get("/getData", async (req, res) => {
	try {
		const table = req.headers.table;
		if (!models[table]) {
			return res.status(400).json({ error: "Invalid table name" });
		}

		const data = await models[table].findAll();

		res.status(200).json(data);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Server error" });
	}
});

router.get("/getSingle", async (req, res) => {
	console.log(req.headers);
	try {
		const id = req.headers.id;

		const product = await models.IzdelekDobavitelj.findOne({
			where: { id },
			attributes: [
				"id",
				"izdelek_ean",
				[sequelize.col("KATEGORIJA_kategorija"), "kategorija"],
				"izdelek_ime",
				"izdelek_opis",
				"dealer_cena",
				"nabavna_cena",
				"ppc",
				[sequelize.col("DOBAVITELJ_dobavitelj"), "dobavitelj"],
			],
			include: [
				{
					model: models.Atribut,
					as: "atribut",
					attributes: ["KOMPONENTA_komponenta", "atribut"],
				},
				{
					model: models.Izdelki,
					as: "izdelek",
					include: [
						{
							model: models.Slike,
							as: "slika",
							attributes: ["slika_url", "tip"],
						},
					],
				},
                {
                    model: models.IzdelekFilter,
                    attributes: ["filter_vrednost"],
                    include: [
                        {
                            model: models.Filter,
                            attributes:['filter_naziv'],
                        }
                    ]
                }
			],
		});

		if (!product)
			return res.status(404).json({ error: "Product not found" });

		// 2️⃣ Fetch attributes for this EAN
		const attributes = await modelsMap.Atribut.findAll({
			where: { izdelek_ean: product.izdelek_ean },
			attributes: [
				"id",
				"atribut",
				"KOMPONENTA_komponenta",
				"izdelek_ean",
			],
		});

		res.json(product);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: err.message });
	}
});

router.put("/update_kategorija", (req, res) => {
	const data = req.body;
	data.forEach((el) => {
		modelsMap.Kategorija.update(
			{ marza: el.marza },
			{
				where: {
					kategorija_id: el.id,
				},
			}
		);
	});
	res.status(200).json({ message: "Marže kategorij posodobljene." });
});

router.put("/update", (req, res) => {
	const data = req.body;
    console.log(data)

	modelsMap.IzdelekDobavitelj.update(
        data.newData,
		{
			where: {
				id: data.id,
			},
		}
	)
		.then(() => {
			res.status(200).json({ message: "Izdelek posodobljen." });
		})
		.catch((err) => {
			console.error(err);
		});
});

router.put("/upsert", (req, res) => {
	modelsMap.IzdelekDobavitelj.upsert(
		{
			name: username,
			results: surveyData,
		},
		{ name: username }
	)
		.then((data) => console.log(data))
		.catch((err) => console.log(err));
});

router.get("/lazy-test", (req, res) => {
	const offset = parseInt(req.query.offset);
	const limit = parseInt(req.query.limit);
	const dobavitelj = req.query.dobavitelj || null;
	const kategorija = req.query.kategorija || null
	const whereClause = {
    //   nabavna_cena: { [sequelize.Op.ne]: null }
    };

    if (dobavitelj && dobavitelj !== "Vsi") {
      whereClause.DOBAVITELJ_dobavitelj = dobavitelj;
    }
    if (kategorija && kategorija !== "Vsi") {
      whereClause.KATEGORIJA_kategorija = kategorija;
    }

	models.IzdelekDobavitelj.findAll({
		limit: limit,
		offset: offset,
		where: whereClause,
		attributes: [
			"id",
			"izdelek_ean",
			[sequelize.col("KATEGORIJA_kategorija"), "kategorija"],
			[sequelize.col("DOBAVITELJ_dobavitelj"), "dobavitelj"],
			"izdelek_ime",
			"dealer_cena",
			"nabavna_cena",
			"ppc",
		],
		include: [
			{
				model: models.Izdelki,
				as: "izdelek",
				include: [
					{
						model: models.Slike,
						as: "slika",
						attributes: ["slika_url", "tip"],
					},
				],
			},
		],
	}).then((data) => {
		res.status(200).json(data);
	});
});

export default router;
