const express = require("express");
const router = express.Router();
//class imports
const Employee = require("../models/Employee");
const Manager = require("../models/Manager");
const Database = require("../models/utility/database");


router.get("/", function(req, res, next) {
	res.render("addEmployee", {layout: "managerLayout.hbs"});
});

router.post("/", async function(req,res,next) {
    try {
        const employee = new Employee (
            req.body.employeeID,
            req.body.firstName,
            req.body.lastName,
            req.body.department,
            req.body.permissions,
            req.body.status,
            req.body.manager,
            [],
            "null"      
        );

        await Database.addEmployee("employees", employee, employee.employeeID);
        res.redirect("/employees");
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Error adding employee");
    }
});


module.exports = router;