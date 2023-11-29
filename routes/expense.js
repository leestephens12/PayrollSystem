const express = require("express");
const router = express.Router();
const Authentication = require("../models/utility/authentication");
const Database = require("../models/utility/database");

//class imports
const Expense = require("../models/Expense");


router.get("/", async function(req, res, next) {
	const uid = await Authentication.getUid();
	const currentEmp = await Database.getEmployee(uid);

	const expense = await Database.getExpenseList();
	console.log(expense);
	
	res.render("expense", {currentEmp: currentEmp, expense: expense});
});

router.post("/", function(req, res){
	const type = req.body.type;
	const amount = req.body.amount;
	const from = req.body.from;
	//const proof = req.body.proof;

	var expense = {type:type, amount:amount, from:from};

	Database.getDocs("expense");
	Database.addExpense(expense);

	res.redirect("/expense");
});

module.exports = router;