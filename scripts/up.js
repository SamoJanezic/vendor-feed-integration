import { createTable } from "../db/sql.js";
import { Izdelek } from "../Models/Izdelek.js";
import { IzdelekDobavitelj } from "../Models/IzdelekDobavitelj.js";
import { insertCategories } from "../Seeders/insertCategories.js";
import { Dobavitelj } from "../Models/Dobavitelj.js"
import { Komponenta } from "../Models/Komponenta.js";
import { Atribut } from "../Models/Atribut.js";
import { Slika } from "../Models/Slika.js";
import { Kategorija } from "../Models/Kategorija.js";

const tables = [
    // Kategorija,
    Dobavitelj,
    Izdelek,
    Komponenta,
    IzdelekDobavitelj,
    Atribut,
    Slika,
];


async function up() {
	tables.forEach((table) => {
	    createTable(table);
	});
    insertCategories();
}

up()