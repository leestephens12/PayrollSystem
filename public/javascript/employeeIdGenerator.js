const employeeIdElement = document.getElementById("employeeID");
const firstNameElement = document.getElementById("firstName");
const lastNameElement = document.getElementById("lastName");

firstNameElement.addEventListener("input", generateEmployeeId);
lastNameElement.addEventListener("input", generateEmployeeId);

function generateEmployeeId() {
	if(firstNameElement.value.length === 0 || lastNameElement.value.length === 0)
		employeeIdElement.value = "";
	else {
		const firstName = firstNameElement.value.toUpperCase();
		const lastName = lastNameElement.value.toUpperCase();
		employeeIdElement.value = `${firstName[0]}${lastName[0]}@${Math.random().toString().slice(-7)}`;
	}
}