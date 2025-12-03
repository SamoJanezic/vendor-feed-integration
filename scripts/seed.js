import { insertCategories } from "../seeders/insertCategories.js";
import { insertFilters } from "../seeders/insertFilters.js";

    await insertCategories();
    await insertFilters();