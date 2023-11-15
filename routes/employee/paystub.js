const express = require("express");
const {Router} = express;
const router = Router();



router.get("/employee/paystub", (req, res, next) => {
	res.render("employee/paystub", { title: "Paystub" });
});

module.exports= router;