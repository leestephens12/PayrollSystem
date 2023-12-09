const express = require("express");
const router = express.Router();
//class imports
const Employee = require("../models/Employee");
const Manager = require("../models/Manager");
const Database = require("../models/utility/database");
const Handlebars = require("handlebars");


router.get("/", async function(req, res, next) {
	const empID = req.query.empID;
	console.log(empID);
	const employee = await Database.getEmployeeByEmpID(empID);
	console.log(employee);
	res.render("updateEmployee", {layout: "managerLayout.hbs", employee:employee});
});

router.post("/", async function(req, res, next){
	try {
		const employee = new Employee(
			req.body.employeeID,
			req.body.firstName,
			req.body.lastName,
			req.body.department,
			req.body.permissions,
			req.body.status,
			req.body.manager,
			[],
			"null"
		);

		const employeePlainObject = {
			employeeID: employee.employeeID,
			firstName: employee.firstName,
			lastName: employee.lastName,
			department: employee.department,
			permissions: employee.permissions,
			status: employee.status,
			manager: employee.manager,
			uid: "null"
		};
		console.log(employee);
		await Database.updateEmployee(employeePlainObject.employeeID, employeePlainObject);
		res.redirect("/employees");

	} catch (error) {
		console.error(error);
		res.status(500).send("Error updating employee");
	}
});

module.exports = router;