/* =================================
   WaterGuardian-X Login JS
================================= */

// Show / Hide Password

const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            togglePassword.innerHTML = "🙈";

        } else {

            passwordInput.type = "password";
            togglePassword.innerHTML = "👁";

        }

    });

}


// Login Form

document
.getElementById("loginForm")
.addEventListener("submit", function (e) {

    e.preventDefault();

    const email =
        document
        .getElementById("email")
        .value
        .trim();

    const password =
        document
        .getElementById("password")
        .value
        .trim();

    if (email === "" || password === "") {

        alert("Please enter both email and password.");
        return;

    }

    const loginButton =
        document.querySelector(".login-btn");

    if (loginButton) {

        loginButton.disabled = true;
        loginButton.innerHTML = "Logging in...";

    }

    const users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

    const user =
        users.find(u =>
            u.email === email &&
            u.password === password
        );

    setTimeout(() => {

        if (user) {

            localStorage.setItem(
                "waterUser",
                JSON.stringify(user)
            );

            alert("✅ Login Successful!");

            window.location.href =
                "dashboard.html";

        } else {

            alert("❌ Invalid Email or Password");

            if (loginButton) {

                loginButton.disabled = false;
                loginButton.innerHTML = "Login";

            }

        }

    }, 800);

});