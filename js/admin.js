/* =====================================
   WaterGuardian-X Professional Admin JS
   Charts + Excel + Complaint Management
===================================== */

document.addEventListener("DOMContentLoaded",()=>{


let complaints =
JSON.parse(localStorage.getItem("complaints")) || [];



const table =
document.getElementById("complaintTable");


const search =
document.getElementById("searchComplaint");



/* ===============================
   Date
================================ */

const dateBox =
document.getElementById("currentDate");


if(dateBox){

    dateBox.textContent =
    new Date().toLocaleString();

}



/* ===============================
   Load Table
================================ */

function loadTable(data = complaints){


table.innerHTML="";


if(data.length===0){


table.innerHTML=

`
<tr>
<td colspan="5" class="no-data">

No Complaints Found

</td>
</tr>
`;

updateCards();

return;

}




data.forEach((item,index)=>{


table.innerHTML +=


`

<tr>

<td>${item.id}</td>


<td>${item.name}</td>


<td>${item.issue}</td>


<td>

<span class="status ${item.status.toLowerCase()}">

${item.status}

</span>

</td>



<td>


${
item.status==="Pending"

?

`

<button class="action-btn resolve-btn"
onclick="resolveComplaint(${index})">

Resolve

</button>

`

:

`

<button class="action-btn delete-btn"
onclick="deleteComplaint(${index})">

Delete

</button>

`

}


</td>


</tr>


`;

});


updateCards();

createCharts();


}



/* ===============================
   Cards
================================ */


function updateCards(){


let total =
complaints.length;


let pending =
complaints.filter(
x=>x.status==="Pending"
).length;



let resolved =
complaints.filter(
x=>x.status==="Resolved"
).length;



if(document.getElementById("total"))

document.getElementById("total").textContent =
total;



if(document.getElementById("pending"))

document.getElementById("pending").textContent =
pending;



if(document.getElementById("resolved"))

document.getElementById("resolved").textContent =
resolved;


}



/* ===============================
   Search
================================ */


if(search){


search.addEventListener(
"input",
()=>{


let value =
search.value.toLowerCase();



let filtered = complaints.filter(c=>

c.id.toLowerCase().includes(value)

||

c.name.toLowerCase().includes(value)

||

c.issue.toLowerCase().includes(value)

||

c.status.toLowerCase().includes(value)

);



loadTable(filtered);


});


}



/* ===============================
   Resolve
================================ */


window.resolveComplaint=function(index){


complaints[index].status="Resolved";


localStorage.setItem(
"complaints",
JSON.stringify(complaints)
);



loadTable();


alert(
"✅ Complaint Resolved Successfully"
);


};




/* ===============================
   Delete
================================ */


window.deleteComplaint=function(index){


if(!confirm(
"Delete this complaint?"
))

return;



complaints.splice(index,1);



localStorage.setItem(
"complaints",
JSON.stringify(complaints)
);



loadTable();


};




/* ===============================
   Excel Export
================================ */


const excelBtn =
document.getElementById("exportExcel");


if(excelBtn){


excelBtn.onclick=function(){


if(complaints.length===0){

alert(
"No complaints available"
);

return;

}



let sheet =

XLSX.utils.json_to_sheet(
complaints
);



let book =
XLSX.utils.book_new();



XLSX.utils.book_append_sheet(
book,
sheet,
"Complaints"
);



XLSX.writeFile(
book,
"WaterGuardian_Complaints.xlsx"
);



};


}




/* ===============================
   Charts
================================ */


let complaintChart;
let statusChart;



function createCharts(){


if(
typeof Chart==="undefined"
)

return;



let total =
complaints.length;


let pending =
complaints.filter(
x=>x.status==="Pending"
).length;



let resolved =
complaints.filter(
x=>x.status==="Resolved"
).length;



let chart1 =
document.getElementById(
"complaintChart"
);



let chart2 =
document.getElementById(
"statusChart"
);




if(chart1){


if(complaintChart)

complaintChart.destroy();



complaintChart =
new Chart(chart1,{

type:"bar",

data:{


labels:[
"Total",
"Pending",
"Resolved"
],


datasets:[{

label:"Complaints",

data:[
total,
pending,
resolved
]

}]


},


options:{

responsive:true

}


});


}




if(chart2){


if(statusChart)

statusChart.destroy();



statusChart =
new Chart(chart2,{

type:"doughnut",

data:{


labels:[
"Pending",
"Resolved"
],


datasets:[{

data:[
pending,
resolved
]


}]


},


options:{

responsive:true

}


});


}



}




loadTable();


});
/* ==========================
   Export PDF
========================== */


function exportPDF(){


const {jsPDF}=window.jspdf;


let pdf=new jsPDF();



pdf.text(
"WaterGuardian-X Complaint Report",
20,
20
);



let complaints =

JSON.parse(

localStorage.getItem("complaints")

)||[];




let y=40;



complaints.forEach(item=>{


pdf.text(

`${item.id} | ${item.issue} | ${item.status}`,

20,

y

);


y+=10;


});




pdf.save(
"WaterGuardian-X-Report.pdf"
);


}








/* ==========================
   Export Excel
========================== */


function exportExcel(){



let complaints =

JSON.parse(

localStorage.getItem("complaints")

)||[];




let sheet =

XLSX.utils.json_to_sheet(
complaints
);



let book =

XLSX.utils.book_new();



XLSX.utils.book_append_sheet(

book,

sheet,

"Complaints"

);



XLSX.writeFile(

book,

"WaterGuardian-X-Complaints.xlsx"

);



}
/* ======================================
   WaterGuardian-X Admin Analytics Chart
====================================== */


function loadChart(){


let complaints =

JSON.parse(

localStorage.getItem("complaints")

)

|| [];





let total = complaints.length;



let pending =

complaints.filter(

item=>item.status==="Pending"

).length;





let resolved =

complaints.filter(

item=>item.status==="Resolved"

).length;






let chartArea =

document.getElementById(
"complaintChart"
);





if(!chartArea)
return;






new Chart(

chartArea,

{


type:"doughnut",



data:{


labels:[

"Total",

"Pending",

"Resolved"

],



datasets:[{


label:"Complaints",



data:[

total,

pending,

resolved

]



}]


},



options:{



responsive:true,



plugins:{


legend:{


position:"bottom"


}


}



}



}


);



}







document.addEventListener(

"DOMContentLoaded",

()=>{


loadChart();


});
