

var shift;
var clockFlag;
// Initialize Firebase


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
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

export class Shift{

    constructor(startDateTime, endDateTime) {
        this.startDateTime = startDateTime;
        this.endDateTime = endDateTime;
    }


    get startDateTime() {
        return this._startDateTime;
    }

    set startDateTime(value) {
        this._startDateTime = value;
    }

    get endDateTime() {
        return this._endDateTime;
    }

    set endDateTime(value) {
        this._endDateTime = value;
    }

    requestOff(){

    }
    async clockIn(employee) {

        //create new shift add to DB
        const d = new Date();
        const ref = doc(db, "shifts", employee.employeeID + d).withConverter(shiftConverter);
        await setDoc(ref, new Shift(d, "waiting"));
        employee.shifts.push(d)
        //Update the Employees shift
        const shiftsRef = doc(db, "employees", employee.employeeID);

        await updateDoc(shiftsRef, {
            shifts: arrayUnion(employee.employeeID + d)
        });


    }
    async clockOut(employee) {
        //create new shift add to DB
        const d = new Date();

        //Update the Employees shift
        const shiftsRef = doc(db, "shifts", employee.getLatestShift());

        await updateDoc(shiftsRef, {
            endDateTime: d
        });

        //Resign in
        dbCall("employees", employeeConverter, employee.employeeID, "na")

        alert("Clocked Out")
    }
}