const { mainProcessor } = require("../services/mainProcessor");

const processEndpoint = async (req, res) => {
	//console.log(req);
	mainProcessor();
	res.sendStatus(200);
};

module.exports = {
	processEndpoint,
};
