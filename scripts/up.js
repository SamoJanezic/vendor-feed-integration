import { createTable } from "../db/sql.js";
import { modelsMap } from "../Models/index.js";

const tables = [
    // modelsMap.Kategorija,
    // modelsMap.Filter,
    modelsMap.IzdelekFilter,
    modelsMap.Dobavitelj,
    modelsMap.Izdelek,
    modelsMap.Komponenta,
    modelsMap.IzdelekDobavitelj,
    modelsMap.Atribut,
    modelsMap.Slika,
];


async function up() {
    for (const table of tables) {
        await createTable(table);
    }
}

up();