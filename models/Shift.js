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
	 * @typedef {"requested off" | "cancelled" | "completed" | "in progress" | "not started"} ShiftStatus
	 * @description
	 * status of shift
	 */
	/** @type {....ShiftStatus[]}
	 * @readonly	*/
	static ShiftStatuses = /** @type {ShiftStatus[]} */["requested off", "cancelled", "completed", "in progress", "not started"];
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
					const status = stringArray[4];
					const shift = Shift.fromFirestoreDataString(startDateString, endDateString, schStartString, schEndString, status);
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
	 * @param {ShiftStatus} status - The status of the shift.
	 * @return {Shift} - The newly created Shift object.
	 */
	static fromFirestoreDataString(startDateString, endDateString,scheduledStartString, scheduledEndString, status) {
		const startDate = startDateString === "null" ? null : new Date(startDateString);
		const endDate = endDateString === "null" ? null : new Date(endDateString);
		const scheduledStart = scheduledStartString === "null" ? null : new Date(scheduledStartString);
		const scheduledEnd = scheduledEndString === "null" ? null : new Date(scheduledEndString);
		return new Shift(startDate, endDate, scheduledStart, scheduledEnd, status);
	}

	/**
	 * Generates a Firestore string representation of the date and time values of the current shift.
	 *
	 * @return {string} A string representing the date and time values in the format "startDate/scheduledStart/endDate/scheduledEnd".
	 */
	toFirestoreString() {
		return `${this.startDate}/${this.scheduledStart}/${this.endDate}/${this.scheduledEnd}/${this.status}`;
	}

	/**
	 * @description
	 * creates a new shift
	 * @param {Date | null} startDateTime the actual start time (and date) of the shift
	 * @param {Date | null} endDateTime the actual end time (and date) of the shift
	 * @param {Date | null} scheduledStart the scheduled start time (and date) of the shift
	 * @param {Date | null} scheduledEnd the scheduled end time (and date) of the shift
	 * @param {....ShiftStatus} status the status of the shift
	 * @throws {Error} if startDateTime is not a Date, or any [scheduled] date is after its corresponding [scheduled] end date
	 */
	constructor(startDateTime, endDateTime, scheduledStart, scheduledEnd, status) {
		this.startDate = startDateTime ?? null;
		this.endDate = endDateTime ?? null;
		this.scheduledStart = scheduledStart ?? null;
		this.scheduledEnd = scheduledEnd ?? null;
		if(isNullOrUndefined(status))
			if(this.endDate > new Date())
				this.status = "completed";
			else if(this.startDate >= new Date())
				this.status = "in progress";
			else
				this.status = "not started";
		else
			this.status = status;
	}

	/**
	 * @description
	 * the start of the shift, or null if the shift has not started yet
	 * @memberof Shift
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
	 * @returns {Date | null} the start of the shift, or null if the shift has not started yet
	 */
	get startDate() {
		return this.#startDate;
	}

	/**
	 * @param {Date | null} value
	 * @throws {Error} if value is not a Date, null or undefined, or is after {@link endDate}
	 * @throws {Error} if value is after end date
	 */
	set startDate(value) {
		if(value === null)
		{
			this.#startDate = null;
			return;
		}
		if(!(value instanceof Date))
			throw new Error("invalid date: start date must be a Date object");
		if(isNullOrUndefined(value))
			throw new Error("invalid date: start date cannot be null or undefined");
		if(this.#endDate !== null &&value > this.#endDate)
			throw new Error("invalid date: start date must be before end date");
		this.#startDate = value;
		if(this.#startDate !== null && this.#endDate === null)
			this.#status = "in progress";
	}

	/**
	 * @description
	 * the end of the shift, or null if the shift has not ended yet
	 * @memberof Shift
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
	 * @returns {Date | null} the end of the shift
	 */
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
		if(value < this.#startDate && this.#startDate !== null)
			throw new Error("invalid date: end date must be after start date");
		this.#endDate = value;

		if(this.#startDate !== null && this.#endDate !== null)
			this.#status = "completed";
	}

	/**
	 * the status of the shift
	 * @returns {ShiftStatus}
	 */
	get status() {
		return this.#status;
	}

	/**
	 * Sets the status of the object.
	 *
	 * @param {ShiftStatus} value - The new status value.
	 * @throws {Error} If the value is null or undefined.
	 * @throws {Error} If the value is not one of the valid status options.
	 */
	set status(value) {
		if(typeof value !== "string")
			throw new Error("invalid status: status must be a string");
		if(isNullOrUndefined(value))
			throw new Error("invalid status: status cannot be null or undefined");
		if(Shift.ShiftStatuses.find(s => s.toLocaleLowerCase() === value.toLocaleLowerCase()) === undefined)
			throw new Error("invalid status: status must be one of: waiting, approved, denied, requestedOff, canceled, completed");
		else
			this.#status = value;
	}

	/**
	 * @description
	 * the scheduled start of the shift, or null if the shift has not been scheduled, or has not a scheduled start
	 * @memberof Shift
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
	 * @returns {Date | null} the scheduled start of the shift
	 */
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
		if(value > this.scheduledEnd && this.scheduledEnd !== null)
			throw new Error("invalid date: scheduled start date must be before the scheduled end date");
		this.#scheduledStart = value;
	}


	/**
	 * @description
	 * the scheduled end of the shift, or null if the shift has not been scheduled, or has not a scheduled end
	 * @memberof Shift
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
	 * @returns {Date | null} the scheduled end of the shift
	 */
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
		if(value < this.scheduledStart && this.scheduledStart !== null)
			throw new Error("invalid date: scheduled end date must be after the scheduled start date");
		this.#scheduledEnd = value;
	}

	requestOff() {
		this.#status = "requested off";
	}


	/**
	 * returns the duration of the shift as a Period
	 * @returns {Period} the duration of the shift
	 */
	getDuration() {
		return new Period(this.startDate, this.endDate);
	}

	/**
	 * Converts the current object to a plain JavaScript object.
	 * @return {Object} An object containing the start date, end date, scheduled start time, scheduled end time, and status of the current object.
	 */
	toObject() {
		return {
			startDate: this.startDate,
			endDate: this.endDate,
			scheduledStart: this.scheduledStart,
			scheduledEnd: this.scheduledEnd,
			status: this.status,
			getDuration: this.getDuration,
		};
	}
}

module.exports = Shift;