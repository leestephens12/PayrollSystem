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
        console.log(currentEmp);
        
        if (currentEmp.permissions == "No") {
            const employee = new Employee(
                currentEmp.employeeID, 
                currentEmp.firstName, 
                currentEmp.lastName, 
                currentEmp.department, 
                currentEmp.permissions, 
                currentEmp.status,
                currentEmp.manager,
                currentEmp.shifts,
                currentEmp.uid);
            res.cookie("employeeID", employee.employeeID);
            res.cookie("Employee", employee);
            //get the cookie by doing: 	console.log(req.cookies["Employee"]);
            res.render("empIndex", {currentEmp: currentEmp});
        }
        else if (currentEmp.permissions == "Yes") {
            const employee = new Manager(
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
            console.log("this is the current emp id:" + currentEmp.employeeID);
            res.cookie("employeeID", currentEmp.employeeID);
            res.cookie("Employee", employee);
            //get the cookie by doing: 	console.log(req.cookies["Employee"]);
            res.render("empIndex", {layout: "managerLayout.hbs", currentEmp: currentEmp});
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