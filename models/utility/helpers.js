
class Utility{

	/**
	 * Checks if a value is null or undefined.
	*
	 * @param {any} value - The value to be checked.
	 * @return {boolean} Returns true if the value is null or undefined, otherwise returns false.
	*/
	static isNullOrUndefined(value){
		// same as value === null || value === undefined
	// refer to https://stackoverflow.com/questions/2559318/how-to-check-for-an-undefined-or-null-variable-in-javascript
		return value == null;
	}
}

module.exports = Utility;
/**
 * Parses an employee object from the request cookie.
*
* @param {Object} req - The request object.
* @return {Employee} The parsed employee object.
*/
function parseEmployeeFromRequestCookie(req) {
	const Shift = require("../Shift");
	const Employee = require("../Employee");
	const employeeObject = req.cookies.Employee;
	const { _employeeID, _firstName, _lastName, _department, _permissions, _status, _manager, _uid } = employeeObject;
	let _shifts = employeeObject._shifts;
	//check if shifts is an array
	if(Array.isArray(_shifts) && _shifts.some(element => typeof element === "string"))
		_shifts=_shifts.map(shift=>{
			const [startDate, scheduledStart, endDate, scheduledEnd, status] = shift.split("/");
			return Shift.fromFirestoreDataString(startDate, endDate, scheduledStart, scheduledEnd, status);
		});
	return new Employee(_employeeID, _firstName, _lastName, _department, _permissions, _status, _manager, _shifts, _uid);
}
module.exports.parseEmployeeFromRequestCookie = parseEmployeeFromRequestCookie;
