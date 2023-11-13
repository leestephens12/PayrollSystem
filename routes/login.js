const {initializeApp} = require('@firebase/app');
const {getAuth, onAuthStateChanged} = require('@firebase/auth');
const {getFirestore, doc, getDoc} = require('@firebase/firestore');

//Firebase configuration settings
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
const Manager = require('../public/javascripts/Manager');

router.get('/', function(req, res, next) {
  res.render('login');
});

//when user completes log in form this method is called 
router.post('/', function(req, res){
  const email = req.body.email;
  const password = req.body.password;
  //static method in employee class so we can call without an instance of the object
  Employee.login("managertest@test.com", "test123");

    //when the athorization state of a user changes i.e they log in or log out
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      //gets user id of logged in user
      const uid = user.uid;
      //gets a document refernce from the firestore collection
      const docRef = doc(db, "employees", uid);
      //creates a snapshot of the data
      const docSnap = await getDoc(docRef);

      //if it does pull data 
      if (docSnap.exists()) {
        //create a new Employee object with the Data
        if (docSnap.data().role == "employee") {
          emp = new Employee(docSnap.data().empId, docSnap.data().fname, docSnap.data().lname, docSnap.data().status, docSnap.data().role, docSnap.data().manager, docSnap.data().shifts);
          res.redirect("/employeeIndex");
        }
        else {
          emp = new Manager(docSnap.data().empId, docSnap.data().fname, docSnap.data().lname, docSnap.data().status, docSnap.data().role, docSnap.timeOffRequests);
          res.redirect("/managerIndex");
        }
        console.log(emp);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    } else { //if there is no active user
      console.log("no user currently logged in");
    }
  });
});

module.exports = router;