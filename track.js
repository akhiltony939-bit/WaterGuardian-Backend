console.log("Track JS Loaded");


document
.getElementById("trackBtn")
.addEventListener("click", trackComplaint);



async function trackComplaint(){


let id =
document
.getElementById("complaintId")
.value
.trim();



if(id===""){

alert("Enter Complaint ID");

return;

}



let result =
document.getElementById("result");


result.innerHTML="Searching...";



try{


let response = await fetch(

`https://waterguardian-backend.onrender.com/api/complaints/track/${id}`

);



let data = await response.json();



console.log(data);



if(data.success){


let c=data.complaint;


result.innerHTML=`

<div class="success">

<h2>✅ Complaint Found</h2>


<p><b>ID:</b> ${c.complaintId || c.id}</p>

<p><b>Name:</b> ${c.name}</p>

<p><b>Issue:</b> ${c.issue}</p>

<p><b>Status:</b> ${c.status}</p>

<p><b>Description:</b> ${c.description}</p>


</div>

`;


}
else{


result.innerHTML=

`
<div class="error">

❌ Complaint Not Found

</div>

`;

}



}

catch(error){


console.log(error);


result.innerHTML=

`
<div class="error">

⚠️ Backend Connection Error

</div>

`;

}


}