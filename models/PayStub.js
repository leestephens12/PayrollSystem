const handlebars = require("handlebars");

const {isNullOrUndefined} = require("./utility/helpers");
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
	#netProfit;
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
	 * @private
	 * @type {Number}
	 * @description
	 * the gross profit earned in the pay period.
	 * pay without deductions
	 */
	#grossProfit;
	/**
	 * @private
	 * @type {Deductible[]}
	 * @description
	 * the deduction that contribute to this Paystub
	 */
	#deductions;

	/**
	 * @private
	 * @type {Number}
	 * @description
	 * the total year's net profit
	 */
	#yearToDateNetProfit;

	/**
	 * @private
	 * @type {Number}
	 * @description
	 * the total year's gross profit
	 */
	#yearToDateGrossProfit;

	/**
	 * @private
	 * @type {Map<String, number>  | Deduction[]}
	 * @description
	 * the total year's deduction
	 */

	/**
	 * @param {Date} start - the beginning of the pay period
	 * @param {Date} end - the end of the pay period
	 * @param {Shift[]} shifts - contributed shifts to the paystub
	 */
	constructor( start, end, shifts) {
		this.#start = start;
		this.#end = end;
		this.#shifts = shifts;
	}

	get netProfit() {
		return this.#netProfit;
	}

	/**
	 * @description
	 * sets the amount earned in the pay period
	 * @param {number} value - monetary amount earned
	 * @memberof PayStub
	 * @throws {Error} if value is less than 0
	 *
	 */
	set netProfit(value) {
		if(isNullOrUndefined(value))
			throw new Error("invalid amount: amount cannot be null or undefined");
		if(value < 0) {
			throw new Error("invalid amount: amount must be positive");
		}
		this.#netProfit = value;
	}

	/**
	 * @description
	 * the beginning date for pay period
	 * @returns {Date}
	 * @memberof PayStub
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
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
		this.#updatePaystub();
	}


	/**
	 * @private
	 * @description
	 * updates the paystub details: gross profit, net profit, and its deductions
	 * @memberof PayStub
	 *
	 */
	#updatePaystub() {
		// calculate gross profit; the sum of all shift earnings
		for(const shift of this.#shifts) {
			this.#grossProfit += shift.getEarnings();
		}
		// calculate net profit; gross profit - deductions
		for(const deductible of this.#deductions)
			this.#netProfit -= deductible.calculateDeductible(this.#grossProfit);
		this.#netProfit += this.#grossProfit;
	}

	async createPdf() {
		const puppeteer = require("puppeteer");
		const fs = require("fs");
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		const template = fs.readFileSync(__dirname + "/../views/paystub.hbs", "utf8");
		// compile template
		const compiledTemplate = handlebars.compile(template);
		// render template
		const html = compiledTemplate({
			//todo: the actual data
		});
		await page.setContent(html);
		await page.emulateMediaType("print");
		const pdf = await page.pdf();
		browser.close();
		return pdf;
	}
}

module.exports = PayStub;