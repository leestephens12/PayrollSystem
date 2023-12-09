const login = document.getElementById("login");
const logout = document.getElementById("logout");
const employees = document.getElementById("employees");
const employeeID = document.cookie.includes("employeeID");
if (employeeID) {
	login.style.display = "none";
	login.hidden = true;
}
else {
	logout.style.display = "none";
	logout.hidden = true;
}

if(!document.cookie.includes("permissions%22%3A%22Yes"))
{
	employees.style.display = "none";
	employees.hidden = true;
}
