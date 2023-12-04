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
	
	res.render("expense", {currentEmp: currentEmp, expense: expense, permissions:permissions});
});

router.post("/", function(req, res){
	const id = String(Math.floor(Math.random() * 10000000) + 100000);
	const type = req.body.type;
	const amount = req.body.amount;
	const from = req.body.from;
	const to = req.body.to;
	//const proof = req.body.proof;

	var expense = {id: id, type:type, amount:amount, from:from, to:to, status:"pending"};
	console.log("iddddd: " + expense.id);
	Database.getDocs("expense");
	Database.addExpense(expense.id, expense);

	res.redirect("/expense");
});

module.exports = router;