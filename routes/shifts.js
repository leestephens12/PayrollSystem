const express = require("express");
const Calendar = require("@fullcalendar/core");
const {Router} =  express;
const router = Router();

router.get("/", (req, res, next) => {
    //todo: get events from database of current employee
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
		events: [{}],
	};
	/** @type {import('@fullcalendar/core').EventInput[]} */
	const events = [	];
	res.render("shifts", { title: "Shifts", calendarOptions });
});

module.exports = router;