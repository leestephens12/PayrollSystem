
document.getElementById("btnClockOut").addEventListener("click", btnClockOutOnClick);
function btnClockOutOnClick() {

    var employeeId = prompt("Enter Employee ID", "");
    document.getElementById("txtEmployeeID").value = employeeId
    document.getElementById("lblClockType").value = "clockOut"
}
document.getElementById("btnClockIn").addEventListener("click", btnClockInOnClick);
function btnClockInOnClick() {

    var employeeId = prompt("Enter Employee ID", "");
    document.getElementById("txtEmployeeID").value = employeeId
    document.getElementById("lblClockType").value = "clockIn"
}
    //click clock in, or clock out. Then will be promted a alert, then will redirect
    var searchParams = new URLSearchParams(window.location.search);
    console.log(searchParams.get('result'))

    document.getElementById("lblMsg").innerHTML = searchParams.get('result')
    //for (const param of searchParams) {
 //   console.log(param);
  //  }



if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;
              console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

              document.getElementById("lblLatitude").value = latitude
              document.getElementById("lblLongitude").value = longitude

   })}


   