const express = require("express");
const router = express.Router();
const Database = require("../models/utility/database");

//class imports
const Expense = require("../models/Expense");


router.get("/", function(req, res, next) {
	res.render("expense");
});

router.post("/", function(req, res){
	const type = req.body.type;
	const amount = req.body.amount;
	const from = req.body.from;

	var expense = {type:type, amount:amount, from:from};

	Database.getDocs("expense");
	Database.addExpense(expense);

	res.redirect("/expense")
});

module.exports = router;