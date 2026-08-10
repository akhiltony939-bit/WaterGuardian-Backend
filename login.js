// ==========================================
// WaterGuardian-X Login System
// Backend API Connection
// ==========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const message = document.getElementById("message");

        if (email === "" || password === "") {
            message.style.color = "red";
            message.innerHTML = "⚠ Please enter email and password";
            return;
        }

        message.style.color = "#0066ff";
        message.innerHTML = "⏳ Logging in...";

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                // Save Login Data
                localStorage.setItem("token", data.token);

                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                    localStorage.setItem("userId", data.user.id);
                    localStorage.setItem("userName", data.user.name);
                    localStorage.setItem("userEmail", data.user.email);
                    localStorage.setItem("role", data.user.role);
                }

                console.log("Saved User ID:", localStorage.getItem("userId"));

                message.style.color = "green";
                message.innerHTML = "✅ Login Successful";

                setTimeout(() => {
                    window.location.href = "dashboard.html";
                }, 1000);

            } else {

                message.style.color = "red";
                message.innerHTML = "❌ " + data.message;

            }

        } catch (error) {

            console.log(error);

            message.style.color = "red";
            message.innerHTML = "❌ Backend Server Not Connected";

        }

    });

}


// ==========================================
// Remember Me
// ==========================================

const remember = document.getElementById("remember");
const emailInput = document.getElementById("email");

if (remember) {

    remember.addEventListener("change", () => {

        if (remember.checked) {

            localStorage.setItem(
                "savedEmail",
                emailInput.value
            );

        } else {

            localStorage.removeItem("savedEmail");

        }

    });

}


// ==========================================
// Load Saved Email
// ==========================================

window.addEventListener("load", () => {

    const savedEmail = localStorage.getItem("savedEmail");

    if (savedEmail && emailInput) {

        emailInput.value = savedEmail;

        if (remember) {
            remember.checked = true;
        }

    }

});