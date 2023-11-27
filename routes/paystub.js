const express = require("express");
const Database = require("../models/utility/database");
const Employee = require("../models/Employee");
const {Router} = express;
const router = Router();

const Paystub = require("../models/PayStub");

router.get("/", (req, res, next) => {
	const search =(req.query.search);

	const employeeObject = req.cookies["Employee"];
	const { _employeeID,	_firstName,		_lastName,		_department,		_permissions,		_status,		_manager,_uid, _shifts} = employeeObject;
	const employee = new Employee(_employeeID, _firstName, _lastName, _department, _permissions, _status, _manager,_shifts, _uid);
	employee.generatePaystubs();
	const paystubs = employee.paystubs;
	console.dir(employee.paystubs[0]);
	if(search)
	{
		//todo: filter/query based on query
	}
	res.render("paystub/paystubs", { title: "Paystubs", paystubs });
});

router.get("/:id", (req, res, next) => {
	res.render("paystub/paystub", { title: "Paystub" });
});

router.get("/:id/download", async (req, res, next) => {
	const id = req.params.id;
	const paystub = new Paystub();
	const pdf = await paystub.createPdf();
	res.attachment(`paystub_${paystub.start}-${paystub.end}.pdf`).send(pdf);
});

module.exports = router;