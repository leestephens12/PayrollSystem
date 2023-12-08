const express = require("express");
const Calendar = require("@fullcalendar/core");
const {Router} =  express;
const router = Router();
const Employee = require("../models/Employee");
const Shift = require("../models/Shift");
const Database = require("../models/utility/database");
const { parseEmployeeFromRequestCookie } = require("../models/utility/helpers");

/** @type {Calendar.CalendarOptions } */
const calendarOptions ={
	initialView: "dayGridMonth",
	nowIndicator: true,
	weekends: true,
	editable: false,
	headerToolbar: {
		left: "prev,next today",
		center: "title",
		right: "dayGridMonth,timeGridWeek,timeGridDay"
	},
};

//#region view shifts
// view current employee's shifts
router.get("/", (req, res, next) => {
	const employee = parseEmployeeFromRequestCookie(req);
	const shifts = employee.shifts;
	const pastShifts = getPastShifts(employee).map(shift => shift.toObject());
	let upcomingShifts = getUpcomingShifts(employee);
	//create events for each upcoming shift for the (full)calendar
	calendarOptions.events = createFullCalendarEventsFromShifts(shifts);
	upcomingShifts = upcomingShifts.map(shift => shift.toObject());
	res.render("shift/viewShifts", { title: "Shifts", calendarOptions,upcomingShifts,shifts,pastShifts });
});

//view given employee's shifts; managers only of subordinate employees
router.get("/view/:employeeID", async (req, res, next) => {
	const manager = parseEmployeeFromRequestCookie(req);
	const employeeID = req.params.employeeID;
	if (!isManager(manager) && isEmployee(manager, employeeID))
		return res.redirect(403, "/shifts"); //forbidden access
	const employee = await Database.getEmployeeByEmpID(employeeID);
	const shifts = employee.shifts;
	const pastShifts = getPastShifts(employee).map(shift => shift.toObject());
	let upcomingShifts = getUpcomingShifts(employee);
	//create events for each upcoming shift for the (full)calendar
	calendarOptions.events = createFullCalendarEventsFromShifts(shifts);
	upcomingShifts = upcomingShifts.map(shift => shift.toObject());
	res.render("shift/viewShifts", {layout: "managerLayout", calendarOptions, upcomingShifts, shifts, pastShifts, employee});
});


//#endregion

//#region CRUD shifts

router.get("/delete/:shiftIndex", async (req, res) => {
	const manager = parseEmployeeFromRequestCookie(req);
	const employeeID = req.query.employeeID;
	if (!isManager(manager) && isEmployee(manager, employeeID))
		return res.redirect(403, "/shifts"); //forbidden access
	const employee = await Database.getEmployeeByEmpID(employeeID);
	employee.shifts.splice(req.params.shiftIndex, 1);
	Database.updateEmployee(employee.employeeID,Employee.EmployeeConverter.toFirestore(employee));
	res.redirect("/shifts/edit?employeeID=" + employeeID);
});

router.get("/edit", async (req, res) => {
	const manager = parseEmployeeFromRequestCookie(req);
	const employeeID = req.query.employeeID;
	if (!isManager(manager) && isEmployee(manager, employeeID))
		return res.redirect(403, "/shifts"); //forbidden access
	const employee = await Database.getEmployeeByEmpID(employeeID);
	const shifts = employee.shifts.map(shift => shift.toObject());
	res.render("shift/manageShifts", {
		title: "Edit Shift",
		layout: "managerLayout",
		employee,
		shifts
	});
});

router.get("/edit/:shiftIndex", async (req, res, next) => {
	const manager = parseEmployeeFromRequestCookie(req);
	const employeeID = req.query.employeeID;
	if (!isManager(manager) && isEmployee(manager, employeeID))
		return res.redirect(403, "/shifts"); //forbidden access
	const employee = await Database.getEmployeeByEmpID(employeeID);
	/** @type {Shift} */
	const shift = employee.shifts[req.params.shiftIndex];

	//ensure that some default date is passed to the form for what was initially set
	let date;
	if(shift.startDate)
		date = shift.startDate;
	else if(shift.scheduledStart)
		date = shift.scheduledStart;
	else if(shift.endDate)
		date = shift.endDate;
	else if(shift.scheduledEnd)
		date = shift.scheduledEnd;
	else
		date = new Date();

	res.render("shift/editShift.hbs", {
		title: "Edit Shift",
		employee,
		shift,
		statuses: Shift.ShiftStatuses,
		date
	});
});

router.post("/edit/:shiftIndex", async (req, res) => {
	const manager = parseEmployeeFromRequestCookie(req);
	const employeeID = req.query.employeeID;

	if (!isManager(manager) && isEmployee(manager, employeeID))
		return res.redirect(403, "/shifts"); //forbidden access
	const employee = await Database.getEmployeeByEmpID(employeeID);
	const shift = employee.shifts[req.params.shiftIndex];
	const {date,  status, startTime: start, endTime: end, scheduledStartTime: scheduledStart, scheduledEndTime: scheduledEnd} = req.body;
	// if any of the form inputs are empty, set them to null
	shift.startDate = start ? new Date(`${date} ${start}`) : null;
	shift.endDate = end ? new Date(`${date} ${end}`) : null;
	shift.scheduledStart = scheduledStart ? new Date(`${date} ${scheduledStart}`) : null;
	shift.scheduledEnd = scheduledEnd ? new Date(`${date} ${scheduledEnd}`) : null;
	shift.status = status;
	// replace the employee's shift
	employee.shifts[req.params.shiftIndex] = shift;
	const result = await Database.updateEmployee(employeeID, Employee.EmployeeConverter.toFirestore(employee));
	if (!result)
		res.redirect(`/shifts/edit/${req.params.shiftIndex}?employeeID=${employeeID}`);
	else
		res.redirect(`/shifts/edit/?employeeID=${employeeID}`);
});


router.get("/create", async (req, res, next) => {
	const manager = parseEmployeeFromRequestCookie(req);
	const employeeID = req.query.employeeID;
	const employee = await Database.getEmployeeByEmpID(employeeID);
	//check if they're a manager
	if(!isManager(manager) && isEmployee(manager, employeeID))
		return res.redirect(403, "/shifts"); //forbidden access
	//check if the employee has a shift at that time

	res.render("shift/addShift", {title: "Create Shift", employee, layout: "managerLayout"});
});

router.post("/create", async (req, res, next) => {
	const manager = parseEmployeeFromRequestCookie(req);
	const employeeID = req.body.employeeID;
	/** @type {Employee | null} */
	const employee = await Database.getEmployeeByEmpID(employeeID);
	//check if they're a manager
	if(!isManager(manager) && isEmployee(manager, employeeID))
		return res.redirect(403, "/shifts"); //forbidden access
	const {start, end,date} = req.body;
	const scheduledStart = new Date(`${date} ${start}`);
	const scheduledEnd = new Date(`${date} ${end}`);
	const shift = new Shift(null,null,scheduledStart,scheduledEnd);
	employee.shifts.push(shift);
	await Database.updateEmployee(employeeID, Employee.EmployeeConverter.toFirestore(employee));
	res.redirect(`/shifts/view/${employeeID}`);
});

//#endregion

/**
 * Checks if an employee is an employee of the given manager
 * @param {Employee} manager - The manager object.
 * @param {string} employeeID - The employee ID of the employee.
 * @returns {boolean} True if the employee is an employee of the manager, false otherwise.
 */
async function isEmployee(manager, employeeID) {
	/** @type {Employee[]} */
	const employees = [];
	(await Database.getEmployees()).forEach(employee =>employees.push(employee.data()));
	for (const employee of employees)
		if (employee.manager === manager.employeeID && employee.employeeID === employeeID)
			return true;
	return false;
}


/**
 * Checks if an employee is a manager
 * @param {Employee} employee - The employee object.
 * @returns {boolean} True if the employee is a manager, false otherwise.
 */
function isManager(employee) {
	return employee.permissions.toLowerCase() === "yes";
}

/**
 * creates an array of events for the fullcalendar widget, from an array of shifts
 * @param {Shift[]} shifts shifts to create events from
 * @returns {import('@fullcalendar/core').EventSourceInput[]} events for fullcalendar
 */
function createFullCalendarEventsFromShifts(shifts) {
	const events = [];
	for (const shift of shifts) {
		/** @type {import('@fullcalendar/core').EventInput} */
		const event = {
			title: `${shift.getDuration().TotalHours}hrs - ${shift.status}`,
			start: shift.scheduledStart,
			end: shift.scheduledEnd,
			editable: false,
		};
		switch (shift.status) {
		case "completed":
			event.color = "green";
			break;
		case "canceled":
			event.backgroundColor = "red";
			break;
		case "requestedOff":
			event.backgroundColor = "yellow";
			break;
		case "not started":
			event.backgroundColor = "blue";
			break;
		case "in progress":
		default:
			event.backgroundColor = "purple";
			break;
		}
		events.push(event);
	}
	return events;
}

/**
 * Retrieves the upcoming shifts for a given employee.
 *
 * @param {Employee} employee - The employee object.
 * @return {Shift[]} An array of upcoming shifts.
 */
function getUpcomingShifts(employee) {
	return employee.shifts.filter(shift => shift.scheduledStart !== null ?
		shift.scheduledStart > new Date() :
		shift.startDate > new Date());
}

/**
 * Returns the previously completed (past) shifts of an employee.
 *
 * @param {Employee} employee - The employee object containing the shifts.
 * @return {Shift[]} An array of past shifts.
*/
function getPastShifts(employee) {
	return employee.shifts.filter(shift => shift.scheduledEnd !== null ?
		shift.scheduledEnd < new Date() :
		shift.endDate < new Date());
}

module.exports = router;