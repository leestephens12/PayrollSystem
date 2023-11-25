const express = require("express");
const router = express.Router();
//class imports
const Employee = require("../models/Employee");
const Manager = require("../models/Manager");


router.get("/", function(req, res, next) {
	res.render("employees", {layout: "managerLayout.hbs"});
});

module.exports = router;