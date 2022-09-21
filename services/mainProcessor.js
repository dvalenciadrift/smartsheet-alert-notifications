const e = require("express");
const axios = require("axios").default;

const API_TOKEN = process.env.API_TOKEN;
const usersEndpoint = "https://api.rm.smartsheet.com/api/v1/users?per_page=100";

const dateFrom = "2022-09-12";
const dateTo = "2022-09-18";

const headers = {
	auth: API_TOKEN,
	"Content-Type": "application/json",
};

const mainProcessor = async () => {
	//Query all users in Smartsheet
	// endpoint https://api.rm.smartsheet.com/api/v1/users
	let usersIds = [];
	axios.get(usersEndpoint, { headers }).then((res) => {
		res.data.data.forEach((element) => {
			usersIds.push({
				id: element.id,
				email: element.email,
				role: element.role,
			});
		});
		//Check if their data.approvals.data is empty
		// endpoint: https://api.rm.smartsheet.com/api/v1/users/{userid}/time_entries?from={YY-MM-DD}&to={YY-MM-DD}&fields=approvals
		usersIds.forEach((element) => {
			const approvalsEndpoint = `https://api.rm.smartsheet.com/api/v1/users/${element.id}/time_entries?from=${dateFrom}&to=${dateTo}&fields=approvals`;
			axios.get(approvalsEndpoint, { headers }).then((res) => {
				let counter = false;
				for (let i = 0; i < res.data.data.length; i++) {
					const e = res.data.data[i];
					if (e.approvals.data.length > 0) {
						counter = true;
					}
				}
				if (counter) {
					element.timesheetSubmitted = "Yes";
				} else {
					element.timesheetSubmitted = "No";
					if (
						element.role === "VP" ||
						element.role === "Manager" ||
						element.role === "Operations"
					) {
						console.log("Manager - Do not Slack");
					} else {
						axios.post(
							//"https://hooks.zapier.com/hooks/catch/12931690/bep9y1c/", //Slack Webhook
							"https://hooks.zapier.com/hooks/catch/12931690/beg76xr/", //Google Sheet Webhook
							{
								body: element,
							}
						);
					}
				}
			});
		});
	});
};

module.exports = {
	mainProcessor,
};
