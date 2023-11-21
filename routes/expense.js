const express = require("express");
const router = express.Router();

//class imports
const Expense = require("../models/Expense");


router.get("/", function(req, res, next) {
	res.render("expense");
});

router.post("/", function(req, res){

});


module.exports = router;