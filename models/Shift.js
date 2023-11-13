import Period from "./utility/Period";
import {v4 as uuid} from "uuid";
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

	constructor(startDateTime, endDateTime) {
		this.#startDate = startDateTime;
		this.#endDate = endDateTime;
		this.#id = uuid();
	}

	get startDateTime() {
		return this.#startDate;
	}

	set startDateTime(value) {
		this.#startDate = value;
	}

	get endDateTime() {
		return this.#endDate;
	}

	set endDateTime(value) {
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

export default Shift;