const express = require("express");
const router = express.Router();
const Authentication = require("../models/utility/authentication");
const Database = require("../models/utility/database");
//class imports
const Expense = require("../models/Expense");


router.get("/", async function(req, res, next) {
	const uid = Authentication.getUid();
	console.log(uid);
	const currentEmp = await Database.getEmployee(uid);
	console.log("current cookie: " + currentEmp);
	const empID = await currentEmp.employeeID;
	const permissions = await currentEmp.permissions;
	const expense = await Database.getExpenseList(empID, permissions);
	console.log(expense);
	if (currentEmp.permissions == "No") {
		res.render("expense", {currentEmp: currentEmp, expense: expense, permissions:permissions});
	}
	else {
		res.render("expense", {layout: "managerLayout.hbs", currentEmp: currentEmp, expense: expense, permissions:permissions});
	}
});

router.post("/", async function(req,res,next) {
	var expID = String(Math.floor(Math.random() * 10000000) + 100000);
	try {
		const myExpense = new Expense(
			expID,
			req.body.type,
			req.body.amount,
			req.body.from,
			req.body.to,
			"Pending"
		);
		await Database.addExpense(expID, myExpense);
		res.redirect("/expense");
	}
	catch (error) {
		console.error(error);
		res.status(500).send("Error creating expense");
	}
});

module.exports = router;