const express = require('express');
const router = express.Router();
const Database = require("../models/utility/database");
const Shift = require("../models/Shift");
//class imports
const Employee = require('../models/Employee');


router.get('/', function(req, res, next) {
  res.render('webapp');
});

router.post('/', function(req, res){
    var employeeId = req.body.EmployeeID;
    console.log(employeeId)
    res.redirect('/webapp?result='+employeeId);
    // if (employeeId = "12345")
    //     res.redirect('/webapp?result=ClockedInSuc');
    // else
    // res.redirect('/webapp?result=ClockedInFail');
  });

module.exports = router;