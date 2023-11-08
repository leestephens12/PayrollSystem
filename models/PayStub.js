import Shift from "./Shift";
import { isNullOrUndefined } from "./utility/helpers";

/**
 * @class
 * paystub
 */
class PayStub {
	/**
	 * @private
	 * @type {Number}
	 * monetary amount earned
	 */
	#amount;
	/**
	 * @private
	 * @type {Date}
	 * the beginning date for pay period
	 */
	#start;
	/**
	 * @private
	 * @type {Date}
	 * @description
	 * the last date for the pay period
	 */
	#end;
	/**
	 * @private
	 * @type {Shift[]}
	 * @description
	 * the shift that contribute to this Paystub
	 */
	#shifts;

	/**
	 *
	 * @param {number} amount - total paid amount
	 * @param {Date} start - the beginning of the pay period
	 * @param {Date} end - the end of the pay period
	 * @param {Shift[]} shifts - contributed shifts to the paystub
	 */
	constructor(amount, start, end, shifts) {
		this.#amount = amount;
		this.#start = start;
		this.#end = end;
		this.#shifts = shifts;
	}

	get amount() {
		return this.#amount;
	}

	/**
	 * @description
	 * sets the amount earned in the pay period
	 * @param {number} value - monetary amount earned
	 * @memberof PayStub
	 * @throws {Error} if value is less than 0
	 *
	 */
	set amount(value) {
		if(isNullOrUndefined(value))
			throw new Error("invalid amount: amount cannot be null or undefined");
		if(value < 0) {
			throw new Error("invalid amount: amount must be positive");
		}
		this.#amount = value;
	}

	/**
	 * @description
	 * the beginning date for pay period
	 * @returns {Date}
	 * @memberof PayStub
	 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date}
	 */
	get start() {
		return this.#start;
	}

	/**
	 * Setter function for the start property.
	 *
	 * @param {Date} value - The new value for the start property.
	 * @throws {Error} Throws an error if the start value is null or undefined, or if it is after the end value.
	 */
	set start(value) {
		if(isNullOrUndefined(value))
			throw new Error("invalid start date: start date cannot be null or undefined");
		if(value > this.#end)
			throw new Error("invalid start date: start date must be before end date");
		this.#start = value;
	}

	get end() {
		return this.#end;
	}

	set end(value) {
		if(isNullOrUndefined(value))
			throw new Error("invalid end date: end date cannot be null or undefined");
		if(value < this.#start)
			throw new Error("invalid end date: end date must be after start date");
		this.#end = value;
	}

	get shifts() {
		console.assert(this.#shifts == null);
		return this.#shifts;
	}

	set shifts(value) {
		if(isNullOrUndefined(value))
			throw new Error("invalid shifts: shifts cannot be null or undefined");
		this.#shifts = value;
		this.#updateAmount();
	}


	/**
	 * @private
	 * @description
	 * updates the amount based on the shifts
	 * @memberof PayStub
	 *
	 */
	#updateAmount() {
		for(const shift of this.#shifts) {
			this.#amount += shift.getEarnings();
		}
	}
}

export default PayStub;