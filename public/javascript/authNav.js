const login = document.getElementById("login");
const logout = document.getElementById("logout");
const employeeID = document.cookie.includes("employeeID");
if (employeeID) {
	login.style.display = "none";
	login.hidden = true;
} else {
	logout.style.display = "none";
	logout.hidden = true;
}