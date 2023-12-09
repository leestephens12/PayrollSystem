class Expense {
	static ExpenseConverter = {
		toFirestore: (expense) => {
			return {
				id: expense.id,
				type: expense.type,
				amount: expense.amount,
				to: expense.to,
				from: expense.from,
				status: expense.status
			};
		},
		fromFirestore: (snapshot, options) => {
			const data = snapshot.data(options);
			return new Expense(data.id, data.type, data.amount, data.to, data.from, data.status);
		}
	};

	constructor(id, type, amount, from, to, status) {
		this.id = id;
		this.type = type;
		this.amount = amount;
		this.from = from;
		this.to = to;
		this.status = status;
	}

	get id() {
		return this._id;
	}

	set id(value) {
		this._id = value;
	}

	get type() {
		return this._type;
	}

	set type(value) {
		if (value == "Mileage" || value == "Supplies" || value =="Meal")
			this._type = value;
		else
			throw new Error("Type must be selected");
	}


	get amount() {
		return this._amount;
	}


	set amount(value) {
		//Ensure the amount is more than 0
		if (value <= 0)
			throw new Error("Amount cannot be negative");
		this._amount = value;
	}

	get to() {
		return this._to;
	}


	set to(value) {
		this._to = value;
	}


	get from() {
		return this._from;
	}


	set from(value) {
		this._from = value;
	}

	get status() {
		return this._status;
	}

	set status(value) {
		this._status = value;
	}
}

module.exports = Expense;