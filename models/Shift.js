const  Period = require("./utility/Period");
const {v4: uuid} = require("uuid");


/**
 * @typedef {Object} ShiftDbModel
 * @property {Date} startDate - the beginning of the shift
 * @property {Date} endDate - the end of the shift
 */


/**
 * @class
 * @description
 * Shift class
 * @classdesc - holds data for a single shift obj
 */
class Shift {

	/**
	 * @type {string}
	 * @description
	 * unique id for the shift
	 * @memberof Shift
	 * @see {@link https://en.wikipedia.org/wiki/Universally_unique_identifier}
	 */
	#id;

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
	 * the end of the shift
	 * @memberof Shift
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
	 */
	#endDate;
	/**
	 * @type {Employee}
	 * @description
	 * employee associated with the shift
	 * @memberof Shift
	 */
	#employee;

	/**
	 * @description
	 * firebase converter
	 */
	static firebaseConverter = {
		/**
		 * @param{Shift} shift
		 * @return {ShiftDbModel}
		 */
		toFirestore: (shift) => {
			return {
				startDate: shift.startDate,
				endDate: shift.endDate,
			};
		},
		/**
		 * @param {{data:()=>ShiftDbModel,get:(field:string|FieldPath)=>*}} snapshot
		 * @param {*} options
		 * @return {Shift}
		 */
		fromFirestore: (snapshot, options) => {
			const data = snapshot.data(options);
			return new Shift(data.startDate, data.endDate);
		},
	};

	constructor(startDateTime, endDateTime) {
		this.#startDate = startDateTime;
		this.#endDate = endDateTime;
		this.#id = uuid();
	}

	get startDate() {
		return this.#startDate;
	}

	set startDate(value) {
		this.#startDate = value;
	}

	get endDate() {
		return this.#endDate;
	}

	set endDate(value) {
		this.#endDate = value;
	}

	requestOff() {
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