/* ==========================================
   WaterGuardian-X Professional Dashboard JS
========================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{



// Load User Details

let user =

JSON.parse(

localStorage.getItem("waterUser")

);





if(user){


let welcomeName =
document.querySelector(".welcome h1");


if(welcomeName){

welcomeName.innerHTML =
"Welcome " + user.name + " 👋";

}


}









// Load Complaints


let complaints =

JSON.parse(

localStorage.getItem("complaints")

)

|| [];







// Count Complaints


let total =
complaints.length;



let pending =

complaints.filter(

item=>item.status==="Pending"

).length;





let resolved =

complaints.filter(

item=>item.status==="Resolved"

).length;







// Update Cards


let totalBox =

document.getElementById(
"totalComplaint"
);



let pendingBox =

document.getElementById(
"pendingComplaint"
);



let resolvedBox =

document.getElementById(
"resolvedComplaint"
);





if(totalBox)

totalBox.innerHTML=total;



if(pendingBox)

pendingBox.innerHTML=pending;



if(resolvedBox)

resolvedBox.innerHTML=resolved;









// Recent Complaint Table


let table =

document.getElementById(
"recentTable"
);




if(table){



table.innerHTML="";



if(complaints.length===0){


table.innerHTML=`

<tr>

<td colspan="3">

No Complaints Found

</td>

</tr>

`;



}

else{



// Show latest complaints first


let latest =

complaints.slice().reverse().slice(0,5);





latest.forEach(item=>{



table.innerHTML += `


<tr>


<td>

${item.id}

</td>



<td>

${item.issue}

</td>



<td>

<span>

${item.status}

</span>

</td>



</tr>


`;



});



}



}




});