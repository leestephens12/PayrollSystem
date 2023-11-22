const Employee = require("./Employee");
class Manager extends Employee{

    constructor(employeeID, firstName, lastName, department, permissions, status,manager, shifts,timeOffRequest, testField, uid) {
        super(employeeID, firstName, lastName, department, permissions, status,manager, shifts, uid);
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
} module.exports = Manager;