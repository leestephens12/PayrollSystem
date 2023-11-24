class Expense {

	static ExpenseConverter = {
		toFirestore: (expense) => {
			return {
				type: expense.type,
				amount: expense.amount,
				from: expense.from,
			};
		},
		fromFirestore: (snapshot, options) => {
			const data = snapshot.data(options);
			return new Expense(data.type, data.amount, data.from);
		}
	};

	constructor(type, amount, from, to, proof) {
		this.type = type;
		this.amount = amount;
		this.from = from;
		this.to = to;
		this.proof = proof;
	}

	get type() {
		return this._type;
	}


	set type(value) {
		if (value == "Mileage" || value == "Supplies" || value =="Meal")
			this._type = value;
		else
			this._type = "null";
	}


	get amount() {
		return this._amount;
	}


	set amount(value) {
		//Ensure the amount is more than 0
		if (value <= 0)
			this.amount = "null";
		else
			this._amount = value;
	}


	get from() {
		return this._from;
	}


	set from(value) {
		//Same requirements as employee ID
		if (value.length == 10 && value.substring(2,3) == "#"){
			this._from = value;
		}else {
		
			this._from = "null";
		}
	}


	get to() {
		return this._to;
	}


	set to(value) {
		this._to = value;
	}


	get proof() {
		return this._proof;
	}


	set proof(value) {
		this._proof = value;
	}


	approve() {


	}
	deny() {


	}




}
