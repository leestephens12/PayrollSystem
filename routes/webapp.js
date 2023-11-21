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
	var employeeId = req.body.EmployeeID;
	console.log(employeeId);
	var x = 1;


	Database.getDocs("employees").then((querySnapshot) => {
	    querySnapshot.forEach((doc) => {
	        console.log(doc.data());

			var emp = doc.data()
			emp.firstName = "MasonChanged"
			Database.updateEmployeeShift( "employees", emp)

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
 

	});
	console.log("x");
	x = x + 1;
	res.redirect("/webapp?result="+employeeId);


	// if (employeeId = "12345")
	//     res.redirect('/webapp?result=ClockedInSuc');
	// else
	// res.redirect('/webapp?result=ClockedInFail');
});

module.exports = router;