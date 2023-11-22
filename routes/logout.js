const express = require("express");
const router = express.Router();
const Authentication = require("../models/utility/authentication");

router.get("/", function(req, res, next) {
    Authentication.logout();
	res.render("login");
});

module.exports = router;