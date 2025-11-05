import { controllerMap } from "./controllers/index.js";
import { categoryMap } from "./controllers/categoryMaps/index.js";
import { attributesMap } from "./controllers/attributeControllers/index.js";

// Safe runner for controllers
async function runController(name, ControllerClass, category, attributes) {
    try {
        const instance = new ControllerClass(category, attributes);
        await instance.executeAll();
        console.log(`Finished controller: ${name}`);
    } catch (err) {
        console.warn(`Controller "${name}" failed: ${err.message}`);
    }
}

export async function executeAll() {
    for (const [key, loader] of Object.entries(controllerMap)) {
        try {
            // Lazy-load controller class
            const { default: ControllerClass } = await loader();
            const category = categoryMap[key];
            const attributes = attributesMap[key];

            console.log(`Running controller: ${key}`);
            await runController(key, ControllerClass, category, attributes);

        } catch (err) {
            console.warn(`Failed to load controller "${key}": ${err.message}`);
        }
    }
}

// Entry point
executeAll().catch(err => console.error('Fatal error executing controllers:', err));