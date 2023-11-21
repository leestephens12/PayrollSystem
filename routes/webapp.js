const express = require("express");
const router = express.Router();
const Database = require("../models/utility/database");
const Shift = require("../models/Shift");
//class imports
const Employee = require("../models/Employee");


router.get("/", function(req, res, next) {
	res.render("webapp");
});

router.post("/", function(req, res){
	const employeeId = req.body.EmployeeID;
	const type = req.body.clockType;
	let employee
	
	let returnMsg


	Database.getDocs("employees").then((querySnapshot) => {
	    querySnapshot.forEach((doc) => {
	     	
			employee = doc.data() //set employee to the instance of the employee object
			console.log(employee)
			if(employee.employeeID == employeeId){
			
				let shift
				let shift2 
				if (type == "clockIn"){
					shift = employee.getLatestShift()
					employee.clockIn()
					shift2 = employee.getLatestShift()
					if (shift2.startDate != shift.startDate){
						Database.updateEmployeeShift("employees",employee)
						returnMsg = "Clocked in Succesfully"
					}
					else
						returnMsg = "Cant clock in, as you have a open shift waiting"
				}else if(type =="clockOut"){
					shift = employee.getLatestShift()
					employee.clockOut()
					shift2 = employee.getLatestShift()
					if (shift2.startDate != shift.startDate){
						Database.updateEmployeeShift("employees",employee)
						returnMsg = "Clocked Out Succesfully"
					}
					else
						returnMsg = "Cant clock out, as you have no open shift waiting"
				}else
					returnMsg = "Please try again."
			}else
				returnMsg = "Invalid Employee ID"

	    });

		res.redirect("/webapp?result="+returnMsg);

	});
	

	


	// if (employeeId = "12345")
	//     res.redirect('/webapp?result=ClockedInSuc');
	// else
	// res.redirect('/webapp?result=ClockedInFail');
});

module.exports = router;