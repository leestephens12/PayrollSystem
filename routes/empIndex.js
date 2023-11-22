const express = require("express");
const router = express.Router();
const Authentication = require("../models/utility/authentication");
const Database = require("../models/utility/database");
const Employee = require("../models/Employee");
const Manager = require("../models/Manager");

router.get("/", async function(req, res, next) {
    try {
        const uid = await Authentication.getUid();
        console.log(uid);

        const currentEmp = await Database.getEmployee(uid);
        
        if (currentEmp.permissions == "No") {
            employee = new Employee(
                currentEmp.employeeID, 
                currentEmp.firstName, 
                currentEmp.lastName, 
                currentEmp.department, 
                currentEmp.permissions, 
                currentEmp.status,
                currentEmp.manager,
                currentEmp.shifts,
                currentEmp.uid);
            res.cookie("Employee", employee, { httpOnly: true });
            //get the cookie by doing: 	console.log(req.cookies["Employee"]);
            res.render("empIndex", {currentEmp: currentEmp});
        }
        else if (currentEmp.permissions == "Yes") {
            employee = new Manager(
                currentEmp.employeeID, 
                currentEmp.firstName, 
                currentEmp.lastName, 
                currentEmp.department, 
                currentEmp.permissions, 
                currentEmp.status,
                currentEmp.manager,
                currentEmp.shifts,
                currentEmp.timeOffRequests,
                currentEmp.testField,
                currentEmp.uid);
            res.cookie("Employee", employee, { httpOnly: true });
            //get the cookie by doing: 	console.log(req.cookies["Employee"]);
            res.render("empIndex", {currentEmp: currentEmp});
        } 
        else {
            // Handle the case where employee data is not found
            res.status(404).send("Employee not found");
        }
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;