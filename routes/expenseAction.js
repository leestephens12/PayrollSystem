const express = require("express");
const router = express.Router();
//class imports
const Database = require("../models/utility/database");


router.post("/", async function(req, res, next) {  
    const expID = req.body.expID;
    const status = req.body.approvalStatus;
    console.log("This is the expense ID: " + expID);
    const currExpense = await Database.getExpense(expID);

    if (status == "Approve") {
        console.log(currExpense);
        const expense = {
            id: currExpense.id,
            type: currExpense.type,
            amount:currExpense.amount,
            to: currExpense.to,
            from: currExpense.from,
            status: "Approved"
        }
        await Database.updateExpense('7363586', expense);
    }
    else {
        console.log("Crr Emp");
    }
	res.redirect("/expense");
});

module.exports = router;