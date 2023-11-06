class Manager extends Employee{

    constructor(employeeID, firstName, lastName, department, permissions, status,manager, shifts,timeOffRequest, testField) {
        super(employeeID, firstName, lastName, department, permissions, status,manager, shifts);
        this._timeOffRequest = timeOffRequest;
        this._testField = testField;

    }

    get timeOffRequest() {
        return this._timeOffRequest;
    }

    set timeOffRequest(value) {
        this._timeOffRequest = value;
    }

    get testField() {
        return this._testField;
    }

    set testField(value) {
        this._testField = value;
    }
}