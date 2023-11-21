const express = require("express");
const router = express.Router();
const Authentication = require("../models/utility/authentication");
const Database = require("../models/utility/database");

router.get("/", async function(req, res, next) {
	res.render("empIndex");
	uid = await Authentication.getUid();
	console.log(uid);
	currentEmp = await Database.getEmployee(uid);
	console.log(currentEmp);
});

module.exports = router;