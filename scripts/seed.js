import { insertCategories } from "../services/seeders/insertCategories.js";
import { insertFilters } from "../services/seeders/insertFilters.js";

    await insertCategories();
    await insertFilters();