const express = require("express");
const Calendar = require("@fullcalendar/core");
const {Router} =  express;
const router = Router();
const Employee = require("../models/Employee");
const Shift = require("../models/Shift");

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

// view current employee's shifts
router.get("/", (req, res, next) => {
	const employee = parseEmployeeFromRequestCookie(req);
	const shifts = [];
	const pastShifts = getPastShifts(employee);
	const upcomingShifts = getUpcomingShifts(employee);
	//create events for each upcoming shift for the (full)calendar
	const events = createFullCalendarEventsFromShifts(upcomingShifts);
	calendarOptions.events = events;
	res.render("shifts", { title: "Shifts", calendarOptions,upcomingShifts,shifts,pastShifts });
});

//view given employee's shifts; managers only of subordinate employees
router.get("/:employeeID", (req, res, next) => {
	const employee = parseEmployeeFromRequestCookie(req);
	//check if their a manager
	if(!manager)
		return res.redirect(403,"/shifts"); //forbidden access
	const shifts = [];
	const pastShifts = getPastShifts(employee);
	const upcomingShifts = getUpcomingShifts(employee);
	//create events for each upcoming shift for the (full)calendar
	const events= createFullCalendarEventsFromShifts(shifts);
	calendarOptions.events = events;
	res.render("shifts", { title: "Shifts", calendarOptions,upcomingShifts,shifts,pastShifts });
});

/**
 * creates an array of events for the fullcalendar widget, from an array of shifts
 * @param {Shift[]} shifts shifts to create events from
 * @returns {import('@fullcalendar/core').EventSourceInput[]} events for fullcalendar
 */
function createFullCalendarEventsFromShifts(shifts) {
	const events = [];
	for (const shift of shifts) {
		//todo: add differentiator for past and upcmoing shifts
		/** @type {import('@fullcalendar/core').EventSourceInput} */
		const event = {
			title: "Shift",
			color: "blue",
			start: shift.scheduledStart,
			end: shift.scheduledEnd,
			editable: false,
		};
		events.push(event);
	}
	return events;
}

/**
 * Retrieves the upcoming shifts for a given employee.
 *
 * @param {Object} employee - The employee object.
 * @return {Shift[]} An array of upcoming shifts.
 */
function getUpcomingShifts(employee) {
	return employee.shifts.filter(shift => shift.scheduledStart > new Date());
}

/**
 * Returns the previously completed (past) shifts of an employee.
 *
 * @param {object} employee - The employee object containing the shifts.
 * @return {Shift[]} An array of past shifts.
*/
function getPastShifts(employee) {
	return employee.shifts.filter(shift => shift.endDate < new Date());
}

/**
 * Parses an employee object from the request cookie.
*
* @param {Object} req - The request object.
 * @return {Employee} The parsed employee object.
 */
function parseEmployeeFromRequestCookie(req) {
	const employeeObject = req.cookies.Employee;
	const { _employeeID, _firstName, _lastName, _department, _permissions, _status, _manager, _uid, _shifts } = employeeObject;
	return new Employee(_employeeID, _firstName, _lastName, _department, _permissions, _status, _manager, _shifts, _uid);
}

module.exports = router;