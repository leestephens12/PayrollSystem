const express = require("express");
const Database = require("../models/utility/database");
const Employee = require("../models/Employee");
const {Router} = express;
const router = Router();
const Paystub = require("../models/PayStub");
const { parseEmployeeFromRequestCookie } = require("../models/utility/helpers");

router.get("/", (req, res) => {
	const employee =parseEmployeeFromRequestCookie(req);
	employee.generatePaystubs();
	const paystubs = employee.paystubs;
	res.render("paystub/paystubs", { title: "Paystubs", paystubs });
});

router.get("/:index", (req, res) => {
	const index = req.params.index;
	const employee = parseEmployeeFromRequestCookie(req);
	employee.generatePaystubs();
	const paystubs = employee.paystubs;
	const paystub = paystubs[index];
	res.render("paystub/paystub", {  index: req.params.index, paystub ,employee});
});

router.get("/:index/download", async (req, res) => {
	const index = Number(req.params.index);
	const employee = parseEmployeeFromRequestCookie(req);
	employee.generatePaystubs();
	const paystubs = employee.paystubs;
	const paystub = paystubs[index];
	const pdf = await paystub.createPdf();
	res.attachment(`${employee.employeeID}_${paystub.startDate.toLocaleDateString()}_${paystub.endDate.toLocaleDateString()}.pdf`).send(pdf);
});

module.exports = router;