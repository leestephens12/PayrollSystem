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


	getTotalMilliseconds = () => this.#elapsedMilliseconds;
	getTotalSeconds = () => this.getTotalMilliseconds() / 1000;
	getTotalMinutes = () => this.getTotalSeconds() / 60;
	getTotalHours = () => this.getTotalMinutes() / 60;
	getTotalDays = () => this.getTotalHours() / 24;
	getTotalWeeks = () => this.getTotalDays() / 7;
	getTotalMonths = () => this.getTotalDays() / 30;
	getTotalYears = () => this.getTotalWeeks() / 52;
}

//export default Period;
// export { Period };
exports.Period = Period;
// module.exports.Period = Period;