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

	set amount(value) {
		if (value < 0) {
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

	set start(value) {
		if (this.#end < this.#start) {
			throw new Error("invalid start date: start date must be before end date");
		}
		this.#start = value;
	}

	get end() {
		return this.#end;
	}

	set end(value) {
		if (this.#end > this.#start) {
			throw new Error("invalid end date: end date must be after start date");
		}
		this.#end = value;
	}

	get shifts() {
		return this.#shifts;
	}

	set shifts(value) {
		this.#shifts = value;
	}
}
