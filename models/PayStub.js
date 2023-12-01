const handlebars = require("handlebars");

const {isNullOrUndefined} = require("./utility/helpers");
const Employee = require("./Employee");
const Deductible = require("./Deductible");


/**
 * Represents a pay stub for an employee.
 * @class
 * @memberof module:payroll-system/models
 */
class PayStub {

	//#region instance properties
	/**
	 * @private
	 * @type {Employee}
	 * @description
	 * the employee associated with this Paystub
	 * @see module:payroll-system/models/Employee
	 */
	#employee;
	/**
	 * @private
	 * @type {Shift[]}
	 * @description
	 * the shift that contribute to this Paystub
	 */
	#shifts;
	/** the shift that contribute to this Paystub */
	get shifts() {
		return this.#shifts;
	}
	set shifts(value) {
		if(isNullOrUndefined(value))
			throw new Error("invalid shifts: shifts cannot be null or undefined");
		if(!(value instanceof Array))
			throw new Error("invalid shifts: shifts must be an array");
		this.#shifts = value;
	}

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
	 * the gross amount of deductions up to this date (exclusive - not including this paystub)
	 */
	#yearUntilDateDeducted;
	/** the gross amount of deductions up to this date (exclusive - not including this paystub) */
	get yearUntilDateDeducted() {
		return this.#yearUntilDateDeducted;
	}
	set yearUntilDateDeducted(value) {
		this.#yearUntilDateDeducted = value;
	}

	/**
	 * @private
	 * @type {Number}
	 * @description
	 * the gross amount of profit up to this date (exclusive - not including this paystub)
	 */
	#yearUntilDateGrossProfit;
	/** the gross amount of profit up to this date (exclusive - not including this paystub) */
	get yearUntilDateGrossProfit() {
		return this.#yearUntilDateGrossProfit;
	}
	set yearUntilDateGrossProfit(value) {
		this.#yearUntilDateGrossProfit = value;
	}
	//#endregion

	/**
	 * @param {Shift[]} shifts - the shifts that contributed to the paystub
	 * @param {Number} yearToDateGrossProfit - the year to date gross profit (without deductions) up to this date (exclusive - not including this paystub)
	 * @param {Number} yearToDateDeductions - the year to date deduction up to this date (exclusive - not including this paystub)
	*/
	constructor(shifts, yearToDateGrossProfit, yearToDateDeductions) {
		//todo: populate db with deductions or hardcode here what they are
		this.#deductions = [];
		this.#shifts = shifts;
		this.#yearUntilDateDeducted = yearToDateDeductions;
		this.#yearUntilDateGrossProfit = yearToDateGrossProfit;
	}



	/** the total year's net profit up until this date (exclusive - not including this paystub) */
	get yearUntilDateNetProfit() {
		return this.yearUntilDateGrossProfit - this.yearUntilDateDeducted;
	}
	/** the net profit earned in the pay periods */
	get netProfit() {
		return this.grossProfit - this.deducted;
	}
	/** the total year's net profit */
	get yearToDateNetProfit() {
		return this.yearUntilDateNetProfit + this.netProfit;
	}


	/** the gross profit earned in the pay period; pay without deductions */
	get grossProfit() {
		return this.shifts.reduce((total, shift) => total + shift.getEarnings(), 0);
	}
	/** the total year's gross profit */
	get yearToDateGrossProfit() {
		return this.yearUntilDateGrossProfit + this.grossProfit;
	}

	/**
	 * the deduction that contribute to this Paystub
	 * @return {Deductible[]}
	 */
	get deductions() {
		return this.#deductions;
	}


	/** the total amount deducted from this Paystub */
	get deducted() {
		return this.deductions.reduce((total, deduction) => total + deduction.calculateDeductibleAmount(this.grossProfit), 0);
	}
	/** the deducted amount up to this date (inclusive) */
	get yearToDateDeducted() {
		return this.yearUntilDateDeducted + this.deducted;
	}

	/**
	 * the beginning date for pay period
	 * @returns {Date}
	 * @memberof PayStub
	 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
	 */
	get startDate() {
		return this.shifts.map(shift => shift.startDate).sort((a, b) => a - b)[0];
	}

	/**
	 * the last date for the pay period
	 * @type {Date}
	 */
	get endDate() {
		return this.shifts.map(shift => shift.endDate).sort((a, b) => b - a)[0];
	}


	async createPdf() {
		const puppeteer = require("puppeteer");
		const fs = require("fs");
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		const template = fs.readFileSync(`${__dirname}/../views/paystub/paystub.hbs`, "utf8");
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