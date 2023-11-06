class Shift{

    constructor(startDateTime, endDateTime) {
        this._startDateTime = startDateTime;
        this._endDateTime = endDateTime;
    }


    get startDateTime() {
        return this._startDateTime;
    }

    set startDateTime(value) {
        this._startDateTime = value;
    }

    get endDateTime() {
        return this._endDateTime;
    }

    set endDateTime(value) {
        this._endDateTime = value;
    }

    requestOff(){

    }
}