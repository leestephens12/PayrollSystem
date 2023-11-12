// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.2/firebase-app.js";
import {getFirestore,collection,getDocs,doc,setDoc,getDoc, updateDoc, arrayUnion, arrayRemove}
    from "https://www.gstatic.com/firebasejs/10.5.2/firebase-firestore.js"
const firebaseConfig = {
    apiKey: "AIzaSyAjItgNX9G5m_5FUtjMBiKJo26r7ucxgCY",
    authDomain: "comp3415-payrollsystem.firebaseapp.com",
    projectId: "comp3415-payrollsystem",
    storageBucket: "comp3415-payrollsystem.appspot.com",
    messagingSenderId: "532660971200",
    appId: "1:532660971200:web:54d52bce08c0ff6c806f25",
    measurementId: "G-RD6EGRBLL9"
};

var employee;
var shift;
document.getElementById("btnLogin").addEventListener("click", btnLoginOnClick);
document.getElementById("btnClockIn").addEventListener("click", btnClockInOnClick);
document.getElementById("btnClockOut").addEventListener("click", btnClockOutClick);
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


//
// const docRef = doc(db, "cities", "SF");
// const docSnap = await getDoc(docRef);
//
// if (docSnap.exists()) {
//     console.log("Document data:", docSnap.data());
// } else {
//     // docSnap.data() will be undefined in this case
//     console.log("No such document!");
// }


// const querySnapshot = await getDocs(collection(db, "cities"));
// querySnapshot.forEach((doc) => {
//     // doc.data() is never undefined for query doc snapshots
//     console.log(doc.id, " => ", doc.data());
//});
const employeeConverter = {
    toFirestore: (employee) => {
        return {
            employeeID: employee.employeeID,
            firstName: employee.firstName,
            lastName: employee.lastName,
            department: employee.department,
            permissions: employee.permissions,
            status: employee.status,
            manager: employee.manager,
            shifts: employee.shifts
        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Employee(data.employeeID, data.firstName, data.lastName, data.department,data.permissions,data.status,data.manager,data.shifts);
    }
};

const shiftConverter = {
    toFirestore: (shift) => {
        return {
            startDateTime: shift.startDateTime,
            endDateTime: shift.endDateTime

        };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Shift(data.startDateTime, data.endDateTime);
    }
};
//Look Here! https://firebase.google.com/docs/firestore/query-data/get-data#web-modular-api

async function dbCall( collection, converter, docID) {
    const ref = doc(db, collection, docID).withConverter(converter);
    const docSnap = await getDoc(ref);
    var flag = 1
    if (docSnap.exists()) {
        if (collection == "employees"){
            employee = docSnap.data();
            console.log(employee.firstName);
        }else if (collection == "shifts"){
            shift = docSnap.data()
            console.log("Shift Found")
            console.log(shift.endDateTime)
            if (shift.endDateTime == "waiting"){
                alert("Cannot Clock In, you currently have a open shift")
                flag = 0
            }else{
                flag = 1
            }
        }


    }else{
        console.log("Not Found")
    }
    if((flag == 1 ||employee.getLatestShift() == "blank") && collection == "shifts")
        createNewShift();
}
async function createNewShift() {
    //create new shift add to DB
    const d = new Date();
    const ref = doc(db, "shifts", employee.employeeID+d).withConverter(shiftConverter);
    await setDoc(ref, new Shift(d, "waiting"));

    //Update the Employees shift
    const washingtonRef = doc(db, "employees", employee.employeeID);

    await updateDoc(washingtonRef, {
        shifts: arrayUnion( employee.employeeID+d)
    });

    //Resign in
    dbCall("employees", employeeConverter,employee.employeeID)

    alert("Clocked In")
}
function btnLoginOnClick() {
    console.log("Login BTN Clicked!")
    var employeeId = prompt("Enter Employee ID", "");
    if (employeeId != null) {
        dbCall("employees", employeeConverter,employeeId)
    }else {
        alert("You Did Not enter a Value")
    }



}
function btnClockInOnClick() {
    console.log("ClockIn BTN Clicked!")


    console.log(employee)
    //Check if person is logged in
    if (employee != null) {
        //Call all shifts of current ID
        dbCall("shifts", shiftConverter, employee.getLatestShift())
    }else {
        alert("You are not logged In.")
    }

        //if no open shift, create new one

        //add shift to Employee Object
        //if open shift, prompt user
    // }else {
    //     alert("You are not logged In.")
    // }

}

function btnClockOutClick() {
    console.log("Login BTN Clicked!")

    dbCall()

}