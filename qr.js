/* =================================
 WaterGuardian-X QR Tracking FIX
================================= */


function trackComplaint(){



let id =

document
.getElementById("trackId")
.value
.trim();




let complaints =

JSON.parse(

localStorage.getItem("complaints")

)

|| [];





let result =

document.getElementById("result");



let qr =

document.getElementById("qrcode");



qr.innerHTML="";







let found =

complaints.find(

item=>item.id===id

);





if(found){



result.innerHTML=`

<h3>
✅ Complaint Found
</h3>

<p>
ID : ${found.id}
</p>

<p>
Issue : ${found.issue}
</p>

<p>
Location : ${found.location}
</p>

<p>
Status : ${found.status}
</p>

`;





new QRCode(

qr,

{

text:

found.id,


width:180,


height:180


}

);



}

else{


result.innerHTML=

"❌ Invalid Complaint ID";


}



}