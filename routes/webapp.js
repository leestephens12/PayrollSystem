const express = require("express");
const router = express.Router();
const Database = require("../models/utility/database");
const Shift = require("../models/Shift");
const Workplace = require("../models/Workplace");
//class imports
const Employee = require("../models/Employee");


router.get("/", function(req, res, next) {
	res.render("webapp");
});

router.post("/", async function(req, res){

	//collected from the client webpage
	const employeeId = req.body.EmployeeID; //the employee ID trying to sign in
	const type = req.body.clockType; // what operation 
	var lat = parseFloat(req.body.latitude)//geo data
	var long = parseFloat(req.body.longitude) //geo data
	
	//holder variables
	let employee
	let returnMsg
	let  workplaceFlag
	try{
		//Database section, checks employeeId, and gets all possible workplace locations
		employee = await Database.getEmployeeClock(employeeId)
		let workplace = await Database.getWorkplace()
		//console.log(workplace)


		if(employee.employeeID == employeeId){//if the employee has been found
			
			workplace.forEach(location => { //checks to see that if employee is located at any workplace locations
				console.log(location)
				if (workplaceFlag != true)
					workplaceFlag =  location.checkLocation(Math.abs(lat),Math.abs(long),(location))
				
			});
			//workplaceFlag = true //Used to ignore geolocation, for testing

			let shift//shift before operation
			let shift2 //shift after operation

			if (type == "clockIn" && workplaceFlag){ //if the employee is trying to clock in
				shift = employee.getLatestShift() //set to the most recent shift
				employee.clockIn() //attempt to clock in
				shift2 = employee.getLatestShift() // get the recent shift after modification
				if (shift2.startDate != shift.startDate){ //checks to see if the shift has been updated.
					//if the shift has updated, clockin on the database
					Database.updateEmployeeShift("employees",employee)
					returnMsg = "Clocked in Succesfully" //return a sucessful message to the user
				}
				else //no Change in shift, thus clockin has failed
				returnMsg = "Cant clock in, as you have a open shift waiting"
			}
			else if(type =="clockOut" && workplaceFlag){ //if the employee is trying to clock out
				shift = employee.getLatestShift().endDate //set to the most recent shift
				employee.clockOut()//attempt to clock in
				shift2 = employee.getLatestShift() //gets shift after modifcation
				if (shift2.endDate != shift){ //if a difference occurs
						Database.updateEmployeeShift("employees",employee) //update in database
						returnMsg = "Clocked Out Succesfully"
				}
				else
					returnMsg = "Cant clock out, as you have no open shift waiting"
			}
			else if(workplaceFlag == false) //if you are not in the correct geolocation
					returnMsg = "You are not in the correct location to clock in or out"
			else
				returnMsg = "Please try again." //if the operation is undefined
		}else //did not enter the proper id
			returnMsg = "Invalid Employee ID"
	}catch (error) {
		returnMsg = "a Unkown Error has occured"
		}

	


	res.redirect("/webapp?result="+returnMsg); //return message to client webpage

});

module.exports = router;