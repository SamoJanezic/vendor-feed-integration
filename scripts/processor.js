import { executeAll } from "../app.js";

executeAll().catch(err => console.error("Fatal error executing controllers:", err));