const Shift = require('./Shift');
//const Database = require("../models/utility/database");
class Employee {
	static EmployeeConverter = {
		toFirestore: (employee) => {
			return {
				employeeID: employee.employeeID,
				firstName: employee.firstName,
				lastName: employee.lastName,
				department: employee.department,
				permissions: employee.permissions,
				status: employee.status,
				manager: employee.manager,
				shifts: Shift.firebaseConverter.toFirestore(employee.shifts),
				uid: employee.uid
			};
		},
		fromFirestore: (snapshot, options) => {
			const data = snapshot.data(options);

			var counter = 0; //counter iteration
			var i = 0; //array index iteration variable
			var shiftList = [] //holds the list
			while(counter < (data.shifts.length/2)){
				var shift = new Shift(data.shifts[i],data.shifts[i+1]) //create new shift, with the start and end date
				shiftList.push(shift) //add it to the list of shifts
				i +=2 //move forward 2, to the new shift
				counter +=1
				
			}

			let employee = new Employee(data.employeeID, data.firstName, data.lastName, data.department,data.permissions,data.status,data.manager,shiftList, data.uid);
			
			//set each of the shifts employee value, to the newly created employee
			employee.shifts.forEach(element => {
				element.Employee = employee
			});

			return employee 
		}
	};
	constructor(employeeID, firstName, lastName, department, permissions, status,manager, shifts, uid) {
		this.employeeID = employeeID;
		this.firstName = firstName;
		this.lastName = lastName;
		this.department = department;
		this.permissions = permissions;
		this.status = status;
		this.manager = manager;
		this.shifts = shifts;
		this.uid = uid;
	}

	get employeeID() {
		return this._employeeID;
	}

	set employeeID(value) {

		// id must have the first name, and lastname initial followed by a hastag, then a 7 digit number
		if (value.length == 10 && value.substring(2,3) == "#"){
			this._employeeID = value;
		}else {

			this._employeeID = "Null";
		}
	}

	get firstName() {
		return this._firstName;
	}

	set firstName(value) {
		if (value.length >0)
			this._firstName = value;
		else
			this._firstName = "null";
	}

	get lastName() {
		return this._lastName;
	}

	set lastName(value) {
		if (value.length >0)
			this._lastName = value;
		else
			this._lastName = "null";
	}

	get department() {
		return this._department;
	}

	set department(value) {
		if (value == "Human Resources" || value == "IT Department" || value =="Accounting")
			this._department = value;
		else
			this._department = "Null";
	}

	get permissions() {
		return this._permissions;
	}

	set permissions(value) {
		this._permissions = value;
	}

	get status() {
		return this._status;
	}

	set status(value) {
		if (value == "Active" || value =="Suspeneded" || value == "Terminated")
			this._status = value;
		else
			this._status = "Null";
	}

	get manager() {
		return this._manager;
	}

	set manager(value) {
		this._manager = value;
	}

	get shifts() {
		return this._shifts;
	}

	set shifts(value) {
		this._shifts = value;
	}

	payStub(){

	}
	getLatestShift(){
		if (this.shifts.length > 0) //get the last element of array
			return this.shifts[this.shifts.length - 1]
	 	else //if blank array
		 return "blank"
	}
	
	clockIn(){
		let shift = this.getLatestShift()

		if (shift.endDate == null && shift != "blank"){
			//shift.endDate = new Date()
			console.log("shift already open")
			//Database.updateEmployeeShift( "employees", this)
		}else{
			this.shifts.push(new Shift(new Date))
		}

	}
	clockOut(){
		let shift = this.getLatestShift()

		if (shift.endDate == null && shift != "blank"){
			this.shifts.push(new Shift(new Date))

			//shift.endDate = new Date()
			//console.log("shift already open")
			//Database.updateEmployeeShift( "employees", this)
		}else{
			//shift.endDate = new Date()
			console.log("shift already open")
			//Database.updateEmployeeShift( "employees", this)
		}
	}
	getPayStubDocument(){

	}
	shiftToArray(){

		//return all but the last shift
		var shiftArray = [];
		//var i = 1;
		this._shifts.forEach(element => {
		//	if(i < this._shifts.length){ //if this is not the last shift


			shiftArray.push(element.startDate)
			if (element.endDate != null)
				shiftArray.push(element.endDate)
		//}
		//i++
			
		});
		return shiftArray
	}

	get uid() {
		return this._uid;
	}

	set uid(value) {
		this._uid = value;
	}
}

module.exports = Employee;
