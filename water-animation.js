/* =================================
 WaterGuardian-X Animation JS
================================= */


document.addEventListener(
"DOMContentLoaded",
()=>{


let container =
document.querySelector(
".water-background"
);



if(container){


for(let i=0;i<15;i++){


let bubble =
document.createElement("div");


bubble.className="bubble";



let size =
Math.random()*40+20;



bubble.style.width =
size+"px";


bubble.style.height =
size+"px";


bubble.style.left =
Math.random()*100+"%";



bubble.style.animationDuration =
(Math.random()*5+5)+"s";



container.appendChild(
bubble
);


}



let wave =
document.createElement("div");


wave.className="wave";


container.appendChild(
wave
);


}



});