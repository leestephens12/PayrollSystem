class Employee {
    //constructor for employee
    constructor(employeeId, fname, lname, permission, status, manager, shifts) {
        //instance varibale
        this.employeeId = employeeId;
        this.fname = fname;
        this.lname = lname;
        this.permission = permission;
        this.status = status;
        this.manager = manager;
        this.shifts = shifts;
    }
    //methods go here
    // employees can log in to the system as long as they exist in DB
    login() {

    }
    getPay() {

    }

    generatePayStub() {

    }
}