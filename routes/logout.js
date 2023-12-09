const express = require("express");
const router = express.Router();
const Authentication = require("../models/utility/authentication");

router.get("/", function(req, res) {
	Authentication.logout();
	res.redirect("login");
});

module.exports = router;