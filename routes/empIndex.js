const express = require("express");
const router = express.Router();
const Authentication = require("../models/utility/authentication");
const Database = require("../models/utility/database");

router.get("/", function(req, res, next) {
	res.render("empIndex");
    uid = Authentication.getUid();
    console.log(uid);
    currentEmp = Database.getEmployee(uid);
    console.log(currentEmp);
});

module.exports = router;