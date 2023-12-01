const express = require("express");
const router = express.Router();
//class imports
const Employee = require("../models/Employee");
const Manager = require("../models/Manager");
const Database = require("../models/utility/database");


router.get("/", async function(req, res, next) {  
    console.log("im here");
    const employeeID = req.query.empID;
    console.log(employeeID);
    await Database.deleteDocument("employees", employeeID);
	res.redirect("/employees");
});

module.exports = router;