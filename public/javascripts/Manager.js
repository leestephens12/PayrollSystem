const Employee = require('../javascripts/Employee');
class Manager extends Employee {
    constructor(employeeId, fname, lname, role, status, timeOffRequests) {
        super(employeeId, fname, lname, role, status);
        this.timeOffRequests = timeOffRequests;
    }

    //add an employee to db
    addEmployee() {

    }

    //remove employee from db
    deleteEmployee() {

    }

    editEmployee() {

    }

    viewEmployee() {

    }
}module.exports = Manager;