const express = require('express');
const router = express.Router();
//class imports
const Employee = require('../models/Employee');


router.get('/', function(req, res, next) {
  res.render('webapp');
});


module.exports = router;