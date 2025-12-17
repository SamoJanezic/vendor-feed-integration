import { downloadAll } from "../xml-downloader/app.js";
import { executeAll } from "../../app.js";
import { build } from "../builder/buildXml.js";
// const express = require('express')
// const cron = require('node-cron')
import express from "express";
import cron from "node-cron";

const app = express();
const port = 3001;

async function dataProcessor() {
	console.log("Starting XML downloads...");
	await downloadAll();
	console.log("XML downloads completed. Starting data processing...");
	await executeAll();
	console.log("Data processing completed. Starting build...");
	await build();
	console.log("Build completed.");
}

app.listen(port, () => {
	console.log("Server is running on port 3000");
});

cron.schedule("0 6 * * 1-5", dataProcessor); //"mm hh danVMescu MM danVTednu"
