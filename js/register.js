document

.getElementById("registerForm")

.addEventListener(

"submit",

function(e){


e.preventDefault();





let user={



name:

document.getElementById("name").value,



email:

document.getElementById("email").value,



password:

document.getElementById("password").value



};






let users =

JSON.parse(

localStorage.getItem("users")

)

|| [];





users.push(user);






localStorage.setItem(

"users",

JSON.stringify(users)

);





alert(

"Registration Successful"

);






window.location.href=

"login.html";




});