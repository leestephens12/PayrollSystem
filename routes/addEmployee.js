const express = require("express");
const router = express.Router();
//class imports
const Employee = require("../models/Employee");
const Manager = require("../models/Manager");
const Database = require("../models/utility/database");


/**
 * check if the manager has the employee as a subordinate
 * @param {Employee} employee the employee to check against
 * @param {string} manager the employee id of the manager
 * @returns {boolean} true if the manager has the employee as a subordinate (is the employee's manager, or the
 *     employee's manager's manager, etc.)
 */
function isManager(employee, manager,managers) {
	//base cases
	// if the employee or manager is null or undefined, return false
	if(employee.manager === "" || employee.manager == null || manager === "" || manager == null)
		return false;
	// if the employee's manager is the manager, return true
	else if(employee.manager === manager)
		return true;
	
	const employeeManager = managers.find(m =>
	{
		return m.employeeID === employee.manager; });
	if(employeeManager === undefined)
		return false;
	return isManager(employeeManager, manager,managers);
}

router.get("/", async function(req, res, next) {
	const employeeObject = req.cookies.Employee;
	const { _employeeID, _firstName, _lastName, _department, _permissions, _status, _manager, _uid, _shifts } = employeeObject;
	const employee =  new Employee(_employeeID, _firstName, _lastName, _department, _permissions, _status, _manager, _shifts, _uid);
	
	if(!employee.uid) {
		res.redirect("/login");
		return;
	}
	
	const managers = (await Database.getManagers()).docs.map(manager => manager.data());
	//only display managers under the current manager (and the current manager)
	for(let i = 0; i < managers.length; i++) {
		const manager = managers[i];
		if(manager.employeeID !== employee.employeeID && !isManager(manager, employee.employeeID, managers)) {
			managers.splice(managers.indexOf(manager), 1);
			i--; //decrement i to account for the removed element
		}
	}
	res.render("addEmployee", {layout: "managerLayout.hbs", managers, employee});
});

router.post("/", async function(req,res,next) {
	try {
		const employee = new Employee(
			req.body.employeeID,
			req.body.firstName,
			req.body.lastName,
			req.body.department,
			req.body.permissions,
			req.body.status,
			req.body.manager,
			[],
			"null"
		);

		/*const employeePlainObject = {
            employeeID: employee.employeeID,
            firstName: employee.firstName,
            lastName: employee.lastName,
            department: employee.department,
            permissions: employee.permissions,
            status: employee.status,
            manager: employee.manager,
            shifts: [],
            uid: "null"
        }*/

		//await Database.addEmployeeToFirestore("employees", employeePlainObject, employeePlainObject.employeeID);
		await Database.addEmployeeToAuth(req.body.email, req.body.password, employee.employeeID, employee);
		res.redirect("/employees");

	} catch (error) {
		console.error(error);
		res.status(500).send("Error adding employee");
	}
});


module.exports = router;