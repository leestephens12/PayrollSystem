const express = require("express");
const Calendar = require("@fullcalendar/core");
const {Router} =  express;
const router = Router();
const Employee = require("../models/Employee");

router.get("/", (req, res, next) => {
	const employeeObject = req.cookies["Employee"];
	const { _employeeID,	_firstName,		_lastName,		_department,		_permissions,		_status,		_manager,_uid, _shifts} = employeeObject;
	const employee = new Employee(_employeeID, _firstName, _lastName, _department, _permissions, _status, _manager,_shifts, _uid);
	const shifts = [];

	const pastShifts = employee.shifts.filter(shift => shift.endDate < new Date());

	const upcomingShifts = employee.shifts.filter(shift => shift.scheduledStart > new Date());

	//create events for each upcoming shift for the (full)calendar
	const events=[];
	for (const shift of upcomingShifts) {
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

	/** @type {import('@fullcalendar/core').CalendarOptions } */
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
		events,
	};
	res.render("shifts", { title: "Shifts", calendarOptions,upcomingShifts,shifts,pastShifts });
});

module.exports = router;