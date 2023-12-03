const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const hbs = require("hbs");

//routers
const loginRouter = require("./routes/login");
const paystubRouter = require("./routes/paystub");
const webAppRouter = require("./routes/webapp");
const expenseRouter = require("./routes/expense");
const empIndexRouter = require("./routes/empIndex");
const logoutRouter = require("./routes/logout");
const shiftsRouter = require("./routes/shifts");
const employeesRouter = require("./routes/employees");
const addEmployeeRouter = require("./routes/addEmployee");
const removeEmployeeRouter = require("./routes/removeEmployee");
const updateEmployeeRouter = require("./routes/updateEmployee");


const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//routes
app.use(["/login","/"], loginRouter);
app.use("/paystubs?", paystubRouter);
app.use("/webapp", webAppRouter);
app.use("/expense", expenseRouter);
app.use("/empIndex", empIndexRouter);
app.use("/logout", logoutRouter);
app.use(["/shifts?"], shiftsRouter);
app.use("/employees", employeesRouter);
app.use("/addEmployee", addEmployeeRouter);
app.use("/removeEmployee/?", removeEmployeeRouter);
app.use("/updateEmployee/?", updateEmployeeRouter);


//comparison operator for if statements in hbs
hbs.registerHelper("eq", function (value1, value2) {
	return value1 === value2;
});

hbs.registerHelper("json", content => JSON.stringify(content));

hbs.registerHelper("getShiftDuration", /** @param {Shift} shift */ shift=> shift.getDuration().TotalHours);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
