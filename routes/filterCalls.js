import express from "express";
import { modelsMap } from "../models/index.js";

const router = express.Router();

const { Kategorija, Filter, IzdelekFilter } = modelsMap;



router.get("/categories", async (req, res) => {
    const kategorije = await Kategorija.findAll({
        attributes: ["kategorija_id", "kategorija"],
        order: [["kategorija", "ASC"]]
    });

    res.json(kategorije);
});

router.get("/categories/:id/filters", async (req, res) => {
    const filters = await Filter.findAll({
        where: { kategorija_id: req.params.id },
        attributes: ["filter_id", "filter_naziv"],
        order: [["filter_naziv", "ASC"]]
    });

    res.json(filters);
});

router.get("/filters/:id/values", async (req, res) => {
    const rows = await IzdelekFilter.findAll({
        where: { filter_id: req.params.id },
        attributes: ["filter_vrednost", "izdelek_ean"],
        raw: true
    });

    // group by filter_vrednost
    const out = {};
    for (const row of rows) {
        if (!out[row.filter_vrednost]) out[row.filter_vrednost] = [];
        out[row.filter_vrednost].push(row.izdelek_ean);
    }

    // format as array for frontend
    const result = Object.entries(out).map(([value, products]) => ({
        filter_vrednost: value,
        products
    }));

    res.json(result);
});

export default router;