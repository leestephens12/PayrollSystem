const express = require("express");
const router = express.Router();
const Authentication = require("../models/utility/authentication");
const Database = require("../models/utility/database");
const Employee = require("../models/Employee");

router.get("/", async function(req, res, next) {
    try {
        const uid = await Authentication.getUid();
        console.log(uid);

        const currentEmp = await Database.getEmployee(uid);
        
        if (currentEmp) {
            res.cookie("Employee", currentEmp, { httpOnly: true });
            //get the cookie by doing: 	console.log(req.cookies["Employee"]);

            // Now render the page
            res.render("empIndex");
        } else {
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