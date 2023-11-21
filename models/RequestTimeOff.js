class RequestTimeOff{

    constructor(employeeID, Shift, Status) {
        this.employeeID = employeeID;
        this.Shift = Shift;
        this.Status = Status;
    }
    get employeeID() {
        return this._employeeID;
    }

    set employeeID(value) {
        this._employeeID = value;
    }

    get Shift() {
        return this._Shift;
    }

    set Shift(value) {
        this._Shift = value;
    }

    get Status() {
        return this._Status;
    }

    set Status(value) {
        this._Status = value;
    }

    approve(){

    }
    deny(){

    }
}