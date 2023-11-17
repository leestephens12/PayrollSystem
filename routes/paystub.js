const express = require("express");
const Database = require("../models/utility/database");
const {Router} = express;
const router = Router();

router.get("/", (req, res, next) => {
	const search =(req.query.search);
	if(search)
	{
		//todo: filter/query based on query
	}
	res.render("paystubs");
});

router.get("/:id", (req, res, next) => {
	const id = req.params.id;
	res.render("paystub", { title: "Paystub", id: id });
});

router.get("/employee/paystub", async (req, res, next) => {
	//todo: add way to check for authentication
	if(!req.isAuthenticated()||req.session.user == null) {
		res.redirect("/login");
		return;
	}

	//todo: standardize way to get current  user; store in session or store id in session and retrieve from db
	const employee =  await Database.getEmployee(id) || req.user;
	res.render("employee/paystub", { title: "Paystub", paystubs: employee.paystubs });
});

module.exports= router;