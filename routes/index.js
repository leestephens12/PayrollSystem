var express = require('express');
var router = express.Router();
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIPDGbcsCLfq3JBKA6m5q36DrT8ponHRo",
  authDomain: "payrollsystem-1b6ee.firebaseapp.com",
  projectId: "payrollsystem-1b6ee",
  storageBucket: "payrollsystem-1b6ee.appspot.com",
  messagingSenderId: "37884169561",
  appId: "1:37884169561:web:0fc7a7309a335014c95048",
  measurementId: "G-WR9YMW4QV6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
