const express = require("express");
const router = express.Router();
//class imports
const Employee = require("../models/Employee");
const Manager = require("../models/Manager");
const Database = require("../models/utility/database");


router.get("/", async function(req, res, next) {
    const currentEmpID = req.cookies["employeeID"];
    console.log(currentEmpID);
    try {
        const employees = await Database.getEmployeeList(currentEmpID);
        console.log(employees);
        res.render("employees", {layout: "managerLayout.hbs", employees: employees});
    }
    catch (error) {
        console.log(error);
    }
});

module.exports = router;