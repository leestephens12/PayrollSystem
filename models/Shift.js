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
	 * @typedef {Object} ShiftDbModel
	 * @property {Date} startDate - the beginning of the shift
	 * @property {Date} endDate - the end of the shift
	 */

	/**
	 * @typedef {"waiting" | "approved" | "denied" | "requestedOff" | "canceled" | "completed"} ShiftStatus
	 * @description
	 * status of shift
	 *
	 */
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
		 * @return {ShiftDbModel[]}
		 */
		toFirestore: (shifts) => {
			/**
			 * Creates a new Shift Class object based on the given shift from firestore.
			 *
			 * @param {Shift} shift - The shift object to be converted.
			 * @return {ShiftDbModel} - The new ShiftClass object.
			 */
			function toShiftClass(shift) {
				return {
					startDate: shift.startDate,
					endDate: shift.endDate
				};
			}
			return shifts.map(shift => toShiftClass(shift));
		},
		/**
		 * converts shift objects to Shift class from firestore
		 * @param {ShiftDbModel[]} shifts shifts from firestore
		 * @returns {Shift[]} shifts
		 */
		fromFirestore: (shifts) => {
			/**
			 * Creates a new Shift object based on the given shift from firestore.
			 *
			 * @param {ShiftDbModel} shift - The shift object to be converted.
			 * @return {Shift} - The new Shift object.
			 */
			function toShift(shift) {
				return new Shift(shift.startDate, shift.endDate);
			}
			return shifts.map(shift => toShift(shift));
		},
	};

	constructor(startDateTime, endDateTime) {
		this.#startDate = startDateTime;
		this.#endDate = endDateTime;
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
			throw new Error("invalid date: date must be a Date object");
		if(isNullOrUndefined(value))
			throw new Error("invalid date: date cannot be null or undefined");
		if(value > this.#endDate)
			throw new Error("invalid date: start date must be before end date");
		this.#startDate = value;
	}

	get endDate() {
		return this.#endDate;
	}

	set endDate(value) {
		if(!(value instanceof Date))
			throw new Error("invalid date: date must be a Date object");
		if(isNullOrUndefined(value))
			throw new Error("invalid date: date cannot be null or undefined");
		if(value < this.#startDate)
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
		if(!(value == "waiting" || value == "approved" || value == "denied" || value == "requestedOff" || value == "canceled" || value == "completed"))
			throw new Error("invalid status: status must be one of: waiting, approved, denied, requestedOff, canceled, completed");
		else
			this.#status = value;
	}

	get scheduledStart() {
		return this.#scheduledStart;
	}

	set scheduledStart(value) {
		if(!(value instanceof Date))
			throw new Error("invalid date: date must be a Date object");
		if(isNullOrUndefined(value))
			throw new Error("invalid date: date cannot be null or undefined");
		if(value > this.scheduledEnd)
			throw new Error("invalid date: start date must be before the scheduled end date");
		this.#scheduledStart = value;
	}

	get scheduledEnd() {
		return this.#scheduledEnd;
	}

	set scheduledEnd(value) {
		if(!(value instanceof Date))
			throw new Error("invalid date: date must be a Date object");
		if(isNullOrUndefined(value))
			throw new Error("invalid date: date cannot be null or undefined");
		if(value < this.scheduledStart)
			throw new Error("invalid date: end date must be after the scheduled start date");
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
		return new Period(this.#startDate, this.#endDate);
	}
}

module.exports = Shift;