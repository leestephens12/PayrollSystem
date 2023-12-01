const PayStub = require("./PayStub");
const Shift = require("./Shift");
const { Period } = require("./utility/Period");
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

			const shifts = Shift.firebaseConverter.fromFirestore(data.shifts);

			const employee = new Employee(data.employeeID, data.firstName, data.lastName, data.department,data.permissions,data.status,data.manager,shifts, data.uid);

			//set each of the shifts employee value, to the newly created employee
			if(!employee.shifts)
				employee.shifts = [];
			else
				employee.shifts.forEach(element => {
					element.Employee = employee;
				});

			return employee;
		}
	};

	/**
	 * The employee's paystubs
	 * @type {PayStub[]}
	 */
	#paystubs;

	constructor(employeeID, firstName, lastName, department, permissions, status,manager, shifts, uid) {
		this.employeeID = employeeID;
		this.firstName = firstName;
		this.lastName = lastName;
		this.department = department;
		this.permissions = permissions;
		this.status = status;
		this.manager = manager;
		this.#paystubs = [];
		this.shifts = shifts;
		this.uid = uid;
	}

	get employeeID() {
		return this._employeeID;
	}

	set employeeID(value) {

		// id must have the first name, and last name initial followed by a hastag, then a 7 digit number
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
		if (value == "Active" || value =="Suspended" || value == "Terminated")
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

	/**
	 * Get the shifts.
	 *
	 * @return {Shift[]} The shifts.
	 */
	get shifts() {
		return this._shifts;
	}

	set shifts(value) {
		this._shifts = value;
	}

	get paystubs(){
		return this.#paystubs;
	}
	set paystubs(value){
		if((value)==null)
			throw new Error("invalid paystubs: paystubs cannot be null or undefined");
		if(!Array.isArray(value))
			throw new Error("invalid paystubs: paystubs must be an array");
		this.#paystubs = value;
	}
	generatePaystubs(){
		this.#paystubs = new Array();
		/**@type {Array<Shift[]>}
		 * the pay periods (2 weeks)
		 * an array where each element represents a pay period (an array) containing all the shifts for that pay period
		 * tl;dr an array of Shift arrays  */
		const payPeriods = [];

		const twoWeekPeriod = new Period(new Date("2020-01-01"), new Date("2020-01-15"));

		let j = 0;
		for (const shift of this.shifts) {
			//? for the first shift
			if(payPeriods[j] == null) // initialize the first array of pay periods
				payPeriods[j] = [];
			//? if the shift is outside of the current pay period (j) - from it's first shift's start date
			else if(new Period(payPeriods[j][0].endDate, shift.startDate) > twoWeekPeriod){
				j++; //? move to the next pay period
				payPeriods[j] = [];
			}
			//? add the shift to the current pay period
			payPeriods[j].push(shift);
		}

		//? generate the paystubs
		for(const shifts of payPeriods)
		{
			const previousPayStub = this.#paystubs.pop();
			if(previousPayStub)
				this.#paystubs.push(new PayStub(shifts, previousPayStub.grossProfit, previousPayStub.deducted));
			const payStub = new PayStub(shifts);
			this.#paystubs.push(payStub);
		}

	}

	getLatestShift(){
		if (this.shifts.length > 0) //get the last element of array
			return this.shifts[this.shifts.length - 1];
		else //if blank array
			return "blank";
	}

	clockIn(){
		let shift = this.getLatestShift();

		if (shift.endDate == "undefined" && shift != "blank"){
			//shift.endDate = new Date()
			console.log("shift already open");
			//Database.updateEmployeeShift( "employees", this)
		}else{
			this.shifts.push(new Shift(new Date));
		}

	}
	clockOut(){
		let shift = this.getLatestShift();

		if (shift.endDate == "undefined" && shift != "blank"){


			shift.endDate = new Date();
			//console.log("shift already open")
			//Database.updateEmployeeShift( "employees", this)
		}else{
			//shift.endDate = new Date()
			console.log("shift already open");
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
			let string = element.startDate +"/" + element.scheduledStart  + "/" +element.endDate  + "/" + element.scheduledEnd;
			shiftArray.push(string);
		});
		return shiftArray;
	}

	get uid() {
		return this._uid;
	}

	set uid(value) {
		this._uid = value;
	}
}

module.exports = Employee;
