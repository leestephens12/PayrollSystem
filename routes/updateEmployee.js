const express = require("express");
const router = express.Router();
//class imports
const Employee = require("../models/Employee");
const Manager = require("../models/Manager");
const Database = require("../models/utility/database");


router.get("/", async function(req, res, next) {
    const empID = req.query.empID;
    console.log(empID);
    const employee = await Database.getEmployeeByEmpID(empID);
    console.log(employee);  
    res.render("updateEmployee", {employee:employee});
});

router.post("/", async function(req, res, next){
    try {
        const employee = {
            employeeID: req.body.employeeID,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            department: req.body.department,
            permissions: req.body.permissions,
            status: req.body.status,
            manager: req.body.manager,
            shifts: [],
            uid: "null"      
        }
        console.log(employee);
        await Database.updateEmployee(employee.employeeID, employee);
        res.redirect("/employees");
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating employee");
    }
});

module.exports = router;