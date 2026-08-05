/* ==========================================
   WaterGuardian-X Complaint System JS
========================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{



const form =

document.getElementById(
"complaintForm"
);



const locationBtn =

document.getElementById(
"locationBtn"
);



const locationInput =

document.getElementById(
"location"
);






// GPS Location


if(locationBtn){


locationBtn.addEventListener(
"click",
()=>{


if(navigator.geolocation){



navigator.geolocation.getCurrentPosition(

(position)=>{


let lat =
position.coords.latitude;


let lon =
position.coords.longitude;



locationInput.value =

`Lat:${lat.toFixed(5)}, 
Long:${lon.toFixed(5)}`;



},


()=>{


alert(
"Location permission denied"
);


}


);



}

else{


alert(
"GPS not supported"
);


}



});


}









// Submit Complaint


if(form){



form.addEventListener(
"submit",
(e)=>{


e.preventDefault();





let complaints =

JSON.parse(

localStorage.getItem(
"complaints"
)

)

|| [];







// Generate ID


let id =

"WG" +

Date.now();









let complaint = {


id:id,


name:

document.getElementById(
"name"
).value,



issue:

document.getElementById(
"category"
).value,



location:

document.getElementById(
"location"
).value,



description:

document.getElementById(
"description"
).value,



date:

new Date()
.toLocaleString(),



status:

"Pending"



};








// Save complaint


complaints.push(
complaint
);



localStorage.setItem(

"complaints",

JSON.stringify(
complaints
)

);






// Save latest receipt


localStorage.setItem(

"latestComplaint",

JSON.stringify(
complaint
)

);







document.getElementById(
"message"
).innerHTML =

`

✅ Complaint Submitted Successfully

<br>

Complaint ID:

${id}

`;







form.reset();






setTimeout(
()=>{


window.location.href =
"receipt.html";



},
2000
);



});


}



});