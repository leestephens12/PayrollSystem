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
const expenseActionRouter = require("./routes/expenseAction");


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
app.use("/expenseAction", expenseActionRouter);


//comparison operator for if statements in hbs
hbs.registerHelper("eq", function (value1, value2) {
	return value1 === value2;
});

hbs.registerHelper("json", content => JSON.stringify(content));
hbs.registerHelper("date", date => date instanceof Date ? date.toLocaleDateString() : null);
hbs.registerHelper("time", date => date instanceof Date ? date.toLocaleTimeString(Intl.NumberFormat().resolvedOptions().locale, {hour: "2-digit", minute: "2-digit",hour12: false}) : null);
hbs.registerHelper("getShiftDuration", /** @param {Shift} shift */ shift=> shift.getDuration().TotalHours);
hbs.registerHelper("toCurrency",  value =>
// credits https://stackoverflow.com/a/16233919/16929246
// Create our number formatter.
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		signDisplay:"auto",
		// These options are needed to round to whole numbers if that's what you want.
		minimumFractionDigits: 2, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
	// maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	}).format(value)
);
hbs.registerHelper("getDeduction", (deductible,amount)=>deductible.calculateDeductibleAmount(amount));

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
module.exports.hbs = hbs;