import express from "express";
import allow from "allow-cors";
import routes from "./routes/routes.js";

const app = express();
const hostname = "127.0.0.1";
const port = 3000;

app.use(express.json());
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, id, table, limit, offset, kategorija, dobavitelj"
	);
	res.setHeader(
		"Content-Security-Policy",
		"default-src 'self'; connect-src 'self' http://127.0.0.1:3000 http://localhost:3000"
	);

	// Handle OPTIONS preflight requests
	if (req.method === "OPTIONS") {
		return res.sendStatus(200);
	}

	next();
});

app.use("/", routes);

app.listen(port, hostname, () => {
	console.log(`Server running at http://${hostname}:${port}/`);
});