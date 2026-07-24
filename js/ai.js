/* =================================
 WaterGuardian-X Aqua AI PRO
 Chat + Voice Assistant
================================= */



function sendMessage(){


let input =
document.getElementById("userInput");


let chat =
document.getElementById("chatBox");



let question =
input.value.toLowerCase().trim();



if(question==="")
return;




// User message

chat.innerHTML +=

`
<div class="user">
${input.value}
</div>
`;





let answer="";




// Greeting

if(
question.includes("hello") ||
question.includes("hi")
){

answer =
"Hello 👋 I am Aqua AI Assistant. I can help with water complaints, tracking and conservation.";

}





// Leakage

else if(
question.includes("leak") ||
question.includes("pipe")
){

answer =
"🚰 Water leakage detected. Please register a complaint with location details. Our department will verify and solve the issue.";

}






// Complaint

else if(

question.includes("complaint") ||

question.includes("register")

){

answer =
`
📋 Complaint Registration Steps:

1. Open Dashboard

2. Click Register Complaint

3. Enter location

4. Describe the problem

5. Submit complaint
`;

}





// Tracking

else if(

question.includes("track") ||

question.includes("status")

){


let complaints =

JSON.parse(

localStorage.getItem("complaints")

)

|| [];





if(complaints.length>0){



let latest =

complaints[complaints.length-1];



answer =

`
🔎 Latest Complaint

ID:
${latest.id}

Issue:
${latest.issue}

Status:
${latest.status}

Location:
${latest.location}

`;



}

else{


answer =
"❌ No complaint found. Please register a complaint first.";


}



}







// Water saving

else if(

question.includes("save") ||

question.includes("conservation")

){


answer =

`
💧 Water Saving Tips:

• Repair leaking taps

• Close taps after use

• Reuse water

• Avoid wastage

• Protect water resources

`;



}





// No water

else if(

question.includes("no water") ||

question.includes("supply")

){


answer =

"⚠️ No water supply problem detected. Please register a complaint with your location.";

}





// Quality

else if(

question.includes("dirty") ||

question.includes("quality")

){


answer =

"💧 Water quality issue detected. Please report it for inspection.";

}





else{


answer =

"I can help with:\n\n🚰 Leakage\n📋 Complaints\n🔎 Tracking\n💧 Water Saving\n⚠️ Water Problems";


}







setTimeout(()=>{


chat.innerHTML +=


`
<div class="bot">

${answer.replace(/\n/g,"<br>")}

</div>

`;



chat.scrollTop =
chat.scrollHeight;



// Voice reply

speak(answer);



},500);





input.value="";


}







/* =================================
 Voice Input 🎤
================================= */


function startVoice(){



let SpeechRecognition =

window.SpeechRecognition ||

window.webkitSpeechRecognition;




if(!SpeechRecognition){


alert(
"Voice recognition not supported in this browser"
);


return;

}





let recognition =
new SpeechRecognition();




recognition.lang="en-IN";



recognition.start();





recognition.onstart=function(){


alert(
"🎤 Listening..."
);


};






recognition.onresult=function(event){



let text =

event.results[0][0].transcript;




document.getElementById(
"userInput"
).value=text;




sendMessage();



};




}





/* =================================
 Aqua AI Voice Reply 🔊
================================= */


function speak(text){



let speech =

new SpeechSynthesisUtterance(text);



speech.lang="en-IN";

speech.rate=1;



window.speechSynthesis.speak(
speech
);



}