const {isNullOrUndefined} = require("./utility/helpers");

class Deductible {
	/**
	 * @typedef {"percentage" | "fixed"} DeductibleType
	 * @description
	 * the type of the deductible; fixed rate or percentage
	 */

	/**
	 * @type {string}
	 * the name of the deductible
	 */
	#name;
	/**
	 * @type {string}
	 * @description
	 * the description of the deductible; reason, purpose, who it's for, where it's going, etc.
	 */
	#description;
	/**
	 * @type {number}
	 * the fixed rate or percentage value of the deductible
	 */
	#value;
	/**
	 * @type {DeductibleType}
	 * @description
	 * the way the deductible is calculated, if it is fixed rate or percentage
	 */
	#type;

	/**
	 * creates a new Deductible object
	 * @param {string} name
	 * @param description
	 * @param value
	 * @param {DeductibleType} type
	 */
	constructor(name, description, value, type) {
		this.#name = name;
		this.#description = description;
		this.#value = value;
		this.#type = type;
	}

	get name() {
		return this.#name;
	}
	/**
	 * sets the deductible's name
	 *
	 * @param {string} name - The new name/title of the deductible
	 * @throws {TypeError} If name is not a string.
	 * @throws {Error} If name is null or undefined.
	 */
	set name(name) {
		if(typeof name !== "string")
			throw new TypeError("name must be a string");
		if(isNullOrUndefined(name))
			throw new Error("name cannot be null or undefined");
		this.#name = name;
	}

	get description() {
		return this.#description;
	}
	/**
	 * sets the deductible's description
	 * @param {string} description - The new description of the deductible
	 * @throws {TypeError} If description is not a string.
	 * @throws {Error} If description is null or undefined.
	 */
	set description(description) {
		if(typeof description !== "string")
			throw new TypeError("description must be a string");
		if(isNullOrUndefined(description))
			throw new Error("description cannot be null or undefined");
		this.#description = description;
	}

	/**
	 * returns the deductible's value
	 * @return {number}
	 */
	get value() {
		return this.#value;
	}

	/**
	 * sets the value to be deducted
	 * @param {number} value - The new value to be deducted
	 */
	set value(value) {
		if(isNullOrUndefined(value))
			throw new Error("value cannot be null or undefined");
		if(typeof value !== "number")
			throw new TypeError("value must be a number");
		this.#value = value;
	}

	/**
	 * returns the type of the deductible
	 * @return {DeductibleType}
	 */
	get type() {
		return this.#type;
	}

	/**
	 * sets the type of the deductible
	 * @param {DeductibleType} type
	 */
	set type(type) {
		if(typeof type !== "string")
			throw new TypeError("type must be a string");
		if(isNullOrUndefined(type))
			throw new Error("type cannot be null or undefined");
		if(type !== "percentage" && type !== "fixed")
			throw new Error("type must be 'percentage' or 'fixed'");
		this.#type = type;
	}

	/**
	 * calculates the amount to be deducted from the given (gross) pay
	 * @param {number} pay - the amount of pay to be deducted from
	 * @return {number} the amount of money to be deducted
	 * @remarks if the Deductible type is fixed simply the Deductible's value is returned
	 */
	calculateDeductible(pay) {
		if(this.#type === "percentage")
			return pay * this.#value;
		else
			return this.#value;
	}

}

module.exports = Deductible;