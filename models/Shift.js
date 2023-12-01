const  Period = require("./utility/Period");
const Employee = require("./Employee");
const { isNullOrUndefined } = require("./utility/helpers");

/**
 * @class
 * @description
 * Shift class
 * @classdesc - holds data for a single shift obj
 */
class Shift {

	//#region type definitions
	/**
	 * @typedef {"waiting" | "approved" | "denied" | "requestedOff" | "canceled" | "completed"} ShiftStatus
	 * @description
	 * status of shift
	 *
	 */
	/** @type {ShiftStatus[]}
	 * @readonly	*/
	static ShiftStatus = ["waiting", "approved", "denied", "requestedOff", "canceled", "completed"];
	//#endregion

	/**
	 * @type {Date}
	 * @description
	 * the beginning of the shift
	 * @memberof Shift
	 */
	#startDate;
	/**
	 * @type {Date}
	 * @description
	 * the scheduled start of the shift
	 * @memberof Shift
	 */
	#scheduledStart;
	/**
	 * @type {Date}
	 * @description
	 * the end of the shift
	 * @memberof Shift
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
	 */
	#endDate;
	/**
	 * @type {Date}
	 * @description
	 * the scheduled end of the shift
	 * @memberof Shift
	 */
	#scheduledEnd;

	/**
	 * todo: remove useless attribute and move up appropriate methods
	 * @type {Employee}
	 * @description
	 * employee associated with the shift
	 * @memberof Shift
	 */
	#employee;

	/**
	 * @type {ShiftStatus}
	 */
	#status;

	/**
	 * @description
	 * firebase converter
	 */
	static firebaseConverter = {
		/**
		 * @param{Shift[]} shifts
		 * @return {string[]} string representation of shifts (start date/scheduled start date/end date/scheduled end date)
		 */
		toFirestore: (shifts) => {
			return shifts.map(shift => shift.toFirestoreString());
		},
		/**
		 * converts shift objects to Shift class from firestore
		 * @param {string[]} shifts shifts from firestore
		 * @returns {Shift[]} shifts
		 */
		fromFirestore: (shifts) => {
			const shiftList = [];
			if(shifts.length >0)
				shifts.forEach(element => {
					const stringArray = element.split("/");
					const startDateString = stringArray[0];
					const schStartString = stringArray[1];
					const endDateString = stringArray[2];
					const schEndString = stringArray[3];
					const shift = Shift.fromFirestoreDataString(startDateString, endDateString, schStartString, schEndString);
					shiftList.push(shift);
				});
			return shiftList;
		},
	};

	/**
	 * Creates a new Shift object from the provided date strings.
	 *
	 * @param {string} startDateString - The start date string of the shift.
	 * @param {string} endDateString - The end date string of the shift.
	 * @param {string} scheduledStartString - The scheduled start date string of the shift.
	 * @param {string} scheduledEndString - The scheduled end date string of the shift.
	 * @return {Shift} - The newly created Shift object.
	 */
	static fromFirestoreDataString(startDateString, endDateString,scheduledStartString, scheduledEndString) {
		const startDate = startDateString === "null" ? null : new Date(startDateString);
		const endDate = endDateString === "null" ? null : new Date(endDateString);
		const scheduledStart = scheduledStartString === "null" ? null : new Date(scheduledStartString);
		const scheduledEnd = scheduledEndString === "null" ? null : new Date(scheduledEndString);
		return new Shift(startDate, endDate, scheduledStart, scheduledEnd);
	}

	/**
	 * Generates a Firestore string representation of the date and time values of the current shift.
	 *
	 * @return {string} A string representing the date and time values in the format "startDate/scheduledStart/endDate/scheduledEnd".
	 */
	toFirestoreString() {
		return `${this.startDate}/${this.scheduledStart}/${this.endDate}/${this.scheduledEnd}`;
	}

	/**
	 * @description
	 * creates a new shift
	 * @param {Date} startDateTime the actual start time (and date) of the shift
	 * @param {Date} endDateTime the actual end time (and date) of the shift
	 * @param {Date} scheduledStart the scheduled start time (and date) of the shift
	 * @param {Date} scheduledEnd the scheduled end time (and date) of the shift
	 * @throws {Error} if any
	 */
	constructor(startDateTime, endDateTime, scheduledStart, scheduledEnd) {
		this.startDate = startDateTime;
		this.endDate = endDateTime ?? null;
		this.scheduledStart = scheduledStart ?? null;
		this.scheduledEnd = scheduledEnd ?? null;
	}

	get startDate() {
		return this.#startDate;
	}

	/**
	 * @param {Date} value
	 * @throws {Error} if value is not a Date, null or undefined, or is after {@link endDate}
	 * @throws {Error} if value is after end date
	 */
	set startDate(value) {
		if(!(value instanceof Date))
			throw new Error("invalid date: start date must be a Date object");
		if(isNullOrUndefined(value))
			throw new Error("invalid date: start date cannot be null or undefined");
		if(value > this.#endDate)
			throw new Error("invalid date: start date must be before end date");
		this.#startDate = value;
	}

	get endDate() {
		return this.#endDate;
	}

	set endDate(value) {
		if(value === null)
		{
			this.#endDate = null;
			return;
		}

		if(!(value instanceof Date))
			throw new Error("invalid date: end date must be a Date object or null");
		if(value === undefined)
			throw new Error("invalid date:	end date cannot be undefined");
		if(value !== null && value < this.#startDate)
			throw new Error("invalid date: end date must be after start date");
		this.#endDate = value;
	}

	get status() {
		return this.#status;
	}

	set status(value) {
		if(typeof value !== "string")
			throw new Error("invalid status: status must be a string");
		if(isNullOrUndefined(value))
			throw new Error("invalid status: status cannot be null or undefined");
		if(Shift.ShiftStatus.find(s => s.toLocaleLowerCase() === value.toLocaleLowerCase()) === undefined)
			throw new Error("invalid status: status must be one of: waiting, approved, denied, requestedOff, canceled, completed");
		else
			this.#status = value;
	}

	get scheduledStart() {
		return this.#scheduledStart;
	}

	set scheduledStart(value) {
		if(value === null)
		{
			this.#scheduledStart = null;
			return;
		}

		if(!(value instanceof Date))
			throw new Error("invalid date: scheduled start date must be a Date object or null");
		if(value === undefined)
			throw new Error("invalid date: scheduled start date cannot be undefined");
		if(value > this.scheduledEnd)
			throw new Error("invalid date: scheduled start date must be before the scheduled end date");
		this.#scheduledStart = value;
	}

	get scheduledEnd() {
		return this.#scheduledEnd;
	}

	set scheduledEnd(value) {
		if(value === null)
		{
			this.#scheduledEnd = null;
			return;
		}

		if(!(value instanceof Date ))
			throw new Error("invalid date: scheduled end date must be a Date object or null");
		if(value === undefined)
			throw new Error("invalid date: scheduled end date cannot be null or undefined");
		if(value < this.scheduledStart)
			throw new Error("invalid date: scheduled end date must be after the scheduled start date");
		this.#scheduledEnd = value;
	}

	requestOff() {
		this.#status = "requestedOff";
		throw new Error("not implemented");
	}

	getEarnings() {
		const wage = this.#employee.getPay();
		// todo: check if employee is salaried or hourly
		const duration = this.getDuration();
		const earnedWage = duration.getTotalHours() * wage;
		return Number.parseFloat(earnedWage.toFixed(2));
	}

	getDuration() {
		return new Period(this.startDate, this.endDate);
	}
}

module.exports = Shift;