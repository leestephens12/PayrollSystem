class Period {
	#elapsedMilliseconds;
	#start;
	#end;
	constructor(start, end) {
		this.#elapsedMilliseconds = end - start;
	}

	get elapsedMilliseconds() {
		return this.#elapsedMilliseconds;
	}

	get seconds(){
		return Math.this.getTotalSeconds();
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
	getTotalMilliseconds = () => this.#elapsedMilliseconds;
	/** Returns the total number of seconds elapsed.	 */
	getTotalSeconds = () => this.getTotalMilliseconds() / 1000;
	/** Returns the total number of minutes elapsed.	 */
	getTotalMinutes = () => this.getTotalSeconds() / 60;
	/** Returns the total number of elapsed hours.	 */
	getTotalHours = () => this.getTotalMinutes() / 60;
	/** Returns the total number of elapsed days.	 */
	getTotalDays = () => this.getTotalHours() / 24;
	/** Returns the total number of elapsed weeks.	 */
	getTotalWeeks = () => this.getTotalDays() / 7;
	/** Returns the total number of elapsed months.	 */
	getTotalMonths = () => this.getTotalDays() / 30;
	/** Returns the total number of elapsed years.	 */
	getTotalYears = () => this.getTotalWeeks() / 52;
}

//export default Period;
// export { Period };
// exports.Period = Period;
module.exports = Period;