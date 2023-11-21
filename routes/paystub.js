const express = require("express");
const Database = require("../models/utility/database");
const {Router} = express;
const router = Router();


const Paystub = require("../models/PayStub");

router.get("/", (req, res, next) => {
	const search =(req.query.search);
	new Paystub().createPdf();
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

router.get("/:id/download", async (req, res, next) => {
	const id = req.params.id;
	const paystub = new Paystub();
	const pdf = await paystub.createPdf();
	res.attachment(`paystub_${paystub.start}-${paystub.end}.pdf`).send(pdf);
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