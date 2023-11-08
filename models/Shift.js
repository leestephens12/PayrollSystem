import Period from "./utility/Period";

/**
 * @class
 * @description
 * Shift class
 * @classdesc - holds data for a single shift obj
 */
class Shift {
	
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
		this._startDateTime = startDateTime;
		this._endDateTime = endDateTime;
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