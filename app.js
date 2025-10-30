import { controllerMap } from "./controllers/index.js";
import { categoryMap } from "./controllers/categoryMaps/index.js";
import { attributesMap } from "./controllers/attributeControllers/index.js";

export async function executeAll() {
    for (const [key, Controller] of Object.entries(controllerMap)) {
        const category = categoryMap[key];
        const attributes = attributesMap[key];
        const instance = new Controller(category, attributes);

        console.log(`Running controller: ${key}`);
        await instance.executeAll();
        console.log(`Finished controller: ${key}`);
    }
}

executeAll().catch(err => console.error('Error executing controllers:', err));