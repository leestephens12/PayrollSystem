const express = require("express");
const router = express.Router();
//class imports
const Employee = require("../models/Employee");
const Manager = require("../models/Manager");
const Authentication = require("../models/utility/authentication");


router.get("/", function(req, res, next) {
	if (req.query.error) {
		res.render("login", {layout: null, errorMessage: "invalid credentials"});
	}
	else{
		res.render("login", {layout: null});
	}
});

//when user completes log in form this method is called
router.post("/", async function(req, res){
	const email = req.body.email;
	const password = req.body.password;
	//static method in employee class so we can call without an instance of the object
	try {
		await Authentication.login(email, password);
		res.redirect("/empIndex");
	}
	catch(error) {
		res.redirect('/login/?error=true');
	}

});

module.exports = router;