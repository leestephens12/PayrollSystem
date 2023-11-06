class PayStub{
    constructor(amount, start, end, shift) {

        this.amount = amount;
        this.start = start;
        this.end = end;
        this.shift = shift;
    }

    get amount() {
        return this._amount;
    }

    set amount(value) {
        this._amount = value;
    }

    get start() {
        return this._start;
    }

    set start(value) {
        this._start = value;
    }

    get end() {
        return this._end;
    }

    set end(value) {
        this._end = value;
    }

    get shift() {
        return this._shift;
    }

    set shift(value) {
        this._shift = value;
    }
}