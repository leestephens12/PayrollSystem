const {initializeApp} = require('@firebase/app');
const {getAuth} = require('@firebase/auth');
const {getFirestore} = require('@firebase/firestore');

const firebaseApp = initializeApp({
  apiKey: "AIzaSyCIPDGbcsCLfq3JBKA6m5q36DrT8ponHRo",
  authDomain: "payrollsystem-1b6ee.firebaseapp.com",
  projectId: "payrollsystem-1b6ee",
  storageBucket: "payrollsystem-1b6ee.appspot.com",
  messagingSenderId: "37884169561",
  appId: "1:37884169561:web:0fc7a7309a335014c95048",
  measurementId: "G-WR9YMW4QV6"
});

const express = require('express');
const router = express.Router();
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp)

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
