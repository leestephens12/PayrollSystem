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
	const type = "clockIn"
	let employee
	
	let returnMsg


	Database.getDocs("employees").then((querySnapshot) => {
	    querySnapshot.forEach((doc) => {
	        // console.log(doc.data());

			// var emp = doc.data()
			// emp.firstName = "MasonChanged"
			// Database.updateEmployeeShift( "employees", emp)

			if(doc.data().EmployeeID = employeeId){
				employee = doc.data() //set employee to the instance of the employee object
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
				}
			}
			

	    });

		
      
    //get employee
      //If succesful
        //read the shift objects
          //If not open shift
            //create new shift
            //update database object
          //If open shift
            //return unsucessful msg
      //if Unsuccesful
        //Return unsucessful Msg
		res.redirect("/webapp?result="+returnMsg);

	});
	

	


	// if (employeeId = "12345")
	//     res.redirect('/webapp?result=ClockedInSuc');
	// else
	// res.redirect('/webapp?result=ClockedInFail');
});

module.exports = router;