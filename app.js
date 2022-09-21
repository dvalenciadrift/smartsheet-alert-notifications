require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { processEndpoint } = require("./controllers/webhookController");
const { ngrokStartup } = require("./services/ngrokStartup");

app.use(bodyParser.json());

if (process.env.DEV_MODE) {
	ngrokStartup();
	app.listen(process.env.PORT, () =>
		console.log(`App initialized on port: ${process.env.PORT}`)
	);
}

app.get("/endpoint", processEndpoint);

module.exports = {
	app,
};
