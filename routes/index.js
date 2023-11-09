//Create Variables for firestore functions
const express = require('express');
const router = express.Router();

//class imports
const Employee = require('../public/javascripts/Employee');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res){
  //static method in employee class so we can call without an instance of the object
  Employee.login("lrsteph1@lakeheadu.ca", "admin123");
  
  res.render('index', { title: 'Express' });
});

module.exports = router;
