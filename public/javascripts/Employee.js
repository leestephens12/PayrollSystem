const {initializeApp} = require('@firebase/app');
const {getAuth, signInWithEmailAndPassword} = require('@firebase/auth');
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
class Employee {
    //constructor for employee
    constructor(employeeId, fname, lname, status, manager, shifts) {
        //instance varibale
        this.employeeId = employeeId;
        this.fname = fname;
        this.lname = lname;
        this.status = status;
        this.manager = manager;
        this.shifts = shifts;
    }
    //methods go here
    // employees can log in to the system as long as they exist in DB
    static login(email, password) {
        //Logs employee in, using firebase authentication
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in and user object is now stored in user object
                const user = userCredential.user;
                console.log("signed in user: " + user.uid );

            })
            .catch((error) => { //if there is an error signing in then display the error message
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log("Message:" + errorMessage + " Error Code: " + errorCode);
            });
    }

    logout() {
       
    }

    getPay() {

    }

    generatePayStub() {

    }
}module.exports = Employee;