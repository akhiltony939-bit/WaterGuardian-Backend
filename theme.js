/* ==========================================
   WaterGuardian-X Professional Theme JS
   Dark / Light Mode Controller
========================================== */


document.addEventListener("DOMContentLoaded",()=>{


/* ===============================
   Load Saved Theme
================================ */


let savedTheme =
localStorage.getItem("theme");



if(savedTheme==="dark"){

    document.body.classList.add(
        "dark-mode"
    );

}

else{

    document.body.classList.remove(
        "dark-mode"
    );

}



/* ===============================
   Prevent Duplicate Button
================================ */


if(document.querySelector(".theme-btn"))

return;



/* ===============================
   Create Theme Button
================================ */


const themeBtn =
document.createElement("button");



themeBtn.className =
"theme-btn";


themeBtn.title =
"Switch Dark / Light Mode";



updateIcon();



document.body.appendChild(
themeBtn
);




/* ===============================
   Toggle Theme
================================ */


themeBtn.addEventListener(
"click",
()=>{


document.body.classList.toggle(
"dark-mode"
);



let isDark =
document.body.classList.contains(
"dark-mode"
);



if(isDark){


localStorage.setItem(
"theme",
"dark"
);


}

else{


localStorage.setItem(
"theme",
"light"
);


}



updateIcon();



});





/* ===============================
   Icon Update
================================ */


function updateIcon(){


if(
document.body.classList.contains(
"dark-mode"
)

){


themeBtn.innerHTML="☀️";


}

else{


themeBtn.innerHTML="🌙";


}


}



});