const {initializeApp} = require('@firebase/app');
const {getAuth} = require('@firebase/auth');

const firebaseApp = initializeApp({
    apiKey: "AIzaSyCIPDGbcsCLfq3JBKA6m5q36DrT8ponHRo",
    authDomain: "payrollsystem-1b6ee.firebaseapp.com",
    projectId: "payrollsystem-1b6ee",
    storageBucket: "payrollsystem-1b6ee.appspot.com",
    messagingSenderId: "37884169561",
    appId: "1:37884169561:web:0fc7a7309a335014c95048",
    measurementId: "G-WR9YMW4QV6"
  });
  
  //Create Variables for firestore functions
const auth = getAuth(firebaseApp);
const express = require('express');
const router = express.Router();

//class imports
const Employee = require('../public/javascripts/Employee');

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', function(req, res){
  const email = req.body.email;
  const password = req.body.password;
  //static method in employee class so we can call without an instance of the object
  Employee.login(email, password);
  //redirect to index page
  res.render('index');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
  /*
    in here create a new employee object with 
    setFname()
    set...
  */
});


module.exports = router;