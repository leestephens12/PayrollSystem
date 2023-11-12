  class Employee {
      constructor(employeeID, firstName, lastName, department, permissions, status,manager, shifts) {

          this.employeeID = employeeID
          this.firstName = firstName
          this.lastName = lastName
          this.department = department
          this.permissions = permissions
          this.status = status
          this.manager = manager
          this.shifts = shifts
      }

    get employeeID() {
        return this._employeeID;
    }

    set employeeID(value) {

       // id must have the first name, and lastname initial followed by a hastag, then a 7 digit number
        if (value.length == 10 && value.substring(2,3) == "#"){
                this._employeeID = value;
        }else {

            this._employeeID = "Null"
        }
    }

    get firstName() {
        return this._firstName;
    }

    set firstName(value) {
        if (value.length >0)
            this._firstName = value;
        else
            this._firstName = "null";
    }

    get lastName() {
        return this._lastName;
    }

    set lastName(value) {
        if (value.length >0)
            this._lastName = value;
        else
            this._lastName = "null";
    }

    get department() {
        return this._department;
    }

    set department(value) {
        if (value == "Human Resources" || value == "IT Department" || value =="Accounting")
            this._department = value;
        else
            this._department = "Null"
    }

    get permissions() {
        return this._permissions;
    }

    set permissions(value) {
        this._permissions = value;
    }

    get status() {
        return this._status;
    }

    set status(value) {
        if (value == "Active" || value =="Suspeneded" || value == "Terminated")
            this._status = value;
        else
            this._status = "Null"
    }

    get manager() {
        return this._manager;
    }

    set manager(value) {
        this._manager = value;
    }

    get shifts() {
        return this._shifts;
    }

    set shifts(value) {
        this._shifts = value;
    }

     login() {

     }
     payStub(){

     }
     getLatestShift(){

     }
     clockIn(){

     }
     clockOut(){

     }
     getPayStubDocument(){

     }
}
