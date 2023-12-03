class Period {
	/** The total number of milliseconds elapsed.
	 * @type {number} */
	#elapsedMilliseconds;
	#start;
	#end;
	constructor(start, end) {
		this.#elapsedMilliseconds = end - start;
	}

	get elapsedMilliseconds() {
		return this.#elapsedMilliseconds;
	}

	get start() {
		return this.#start;
	}
	set start(value) {
		this.#start = value;
	}

	get end() {
		return this.#end;
	}
	set end(value) {
		this.#end = value;
	}


	/** Returns the total number of milliseconds elapsed.	 */
	get TotalMilliseconds() {
		return this.#elapsedMilliseconds;
	}
	/** the total number of seconds elapsed.
	 * @return{number}*/
	get TotalSeconds() {
		return this.TotalMilliseconds / 1000;
	}
	/** the total number of minutes elapsed.
	 * @return{number}*/
	get TotalMinutes() {
		return this.TotalSeconds / 60;
	}
	/** the total number of elapsed hours.
	 * @return{number}*/
	get TotalHours() {
		return this.TotalMinutes / 60;
	}
	/** the total number of elapsed days.
	 * @return{number}*/
	get TotalDays() {
		return this.TotalHours / 24;
	}
	/** the total number of elapsed weeks.
	 * @return{number}*/
	get TotalWeeks() {
		return this.TotalDays / 7;
	}
	/** the total number of elapsed months.
	 * @return{number}*/
	get TotalMonths() {
		return this.TotalDays / 30;
	}
	/** the total number of elapsed years.
	 * @return{number}*/
	get TotalYears() {
		return this.TotalWeeks / 52;
	}
}

//export default Period;
// export { Period };
// exports.Period = Period;
module.exports = Period;