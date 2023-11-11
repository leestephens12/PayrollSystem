const {initializeApp} = require('@firebase/app');
const {getAuth, onAuthStateChanged, signInWithEmailAndPassword} = require('@firebase/auth');
const {getFirestore, collection, doc, getDoc} = require('@firebase/firestore');

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
const db = getFirestore(firebaseApp);
const express = require('express');
const router = express.Router();

//class imports
const Employee = require('../public/javascripts/Employee');

router.get('/login', function(req, res, next) {
  res.render('login');
});

//when user completes log in form this method is called 
router.post('/login', function(req, res){
  const email = req.body.email;
  const password = req.body.password;
  //static method in employee class so we can call without an instance of the object
  Employee.login("lrsteph1@lakeheadu.ca", "admin123");
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      //gets user id of logged in user
      const uid = user.uid;
      //gets a document refernce from the firestore collection
      const docRef = doc(db, "employees", uid);
      //creates a snapshot of the data
      const docSnap = await getDoc(docRef);

      //if it does pull data 
      if (docSnap.exists()) {
        //create a new Employee object with the Data
        emp = new Employee(docSnap.data().empId, docSnap.data().fname, docSnap.data().lname, docSnap.data().status, docSnap.data().manager, docSnap.data().shifts);
        console.log(emp);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
      // ...
    } else {
      console.log("no user currently logged in");
    }
  });

  //redirect to index page
  res.redirect('/');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
  

});
module.exports = router;