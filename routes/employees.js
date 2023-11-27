const express = require("express");
const router = express.Router();
//class imports
const Employee = require("../models/Employee");
const Manager = require("../models/Manager");
const Database = require("../models/utility/database");


router.get("/", async function(req, res, next) {
    const employees = await Database.getEmployees();
    console.log(employees);
	res.render("employees", {layout: "managerLayout.hbs", employees: employees});
});

module.exports = router;