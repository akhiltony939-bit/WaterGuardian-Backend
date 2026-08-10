```javascript
const API = "https://waterguardian-backend.onrender.com";

const countrySelect = document.getElementById("countrySelect");
const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");

const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");


// ==========================================
// LOAD COUNTRIES
// ==========================================
async function loadCountries() {

    try {

        const response =
            await fetch(`${API}/api/location/countries`);

        if (!response.ok) {
            throw new Error("Failed to load countries");
        }

        const data = await response.json();

        countrySelect.innerHTML =
            `<option value="">Select Country</option>`;

        data.countries.forEach(country => {

            const option = document.createElement("option");

            option.value = country.isoCode;
            option.textContent = country.name;

            countrySelect.appendChild(option);
        });

    } catch (error) {

        console.error("Country loading error:", error);

        countrySelect.innerHTML =
            `<option value="">Unable to load countries</option>`;
    }
}


// ==========================================
// COUNTRY → STATES
// ==========================================
countrySelect.addEventListener("change", async function () {

    const countryCode = this.value;

    stateSelect.innerHTML =
        `<option value="">Select State</option>`;

    districtSelect.innerHTML =
        `<option value="">Select District</option>`;

    stateSelect.disabled = true;
    districtSelect.disabled = true;

    if (!countryCode) return;

    try {

        const response =
            await fetch(
                `${API}/api/location/states/${countryCode}`
            );

        if (!response.ok) {
            throw new Error("Failed to load states");
        }

        const data = await response.json();

        data.states.forEach(state => {

            const option = document.createElement("option");

            option.value = state.isoCode;
            option.textContent = state.name;

            stateSelect.appendChild(option);
        });

        stateSelect.disabled = false;

    } catch (error) {

        console.error("State loading error:", error);

        stateSelect.innerHTML =
            `<option value="">Unable to load states</option>`;
    }
});


// ==========================================
// STATE → DISTRICTS / CITIES
// ==========================================
stateSelect.addEventListener("change", async function () {

    const countryCode = countrySelect.value;
    const stateCode = this.value;

    districtSelect.innerHTML =
        `<option value="">Select District</option>`;

    districtSelect.disabled = true;

    if (!countryCode || !stateCode) return;

    try {

        const response =
            await fetch(
                `${API}/api/location/cities/${countryCode}/${stateCode}`
            );

        if (!response.ok) {
            throw new Error("Failed to load districts");
        }

        const data = await response.json();

        data.cities.forEach(city => {

            const option = document.createElement("option");

            option.value = city.name;
            option.textContent = city.name;

            districtSelect.appendChild(option);
        });

        districtSelect.disabled = false;

    } catch (error) {

        console.error("District loading error:", error);

        districtSelect.innerHTML =
            `<option value="">Unable to load districts</option>`;
    }
});


// ==========================================
// CREATE ACCOUNT
// ==========================================
registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    message.textContent = "";
    message.style.color = "";

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phone =
        document.getElementById("phone").value.trim();

    const country =
        countrySelect.options[countrySelect.selectedIndex]?.text || "";

    const state =
        stateSelect.options[stateSelect.selectedIndex]?.text || "";

    const district =
        districtSelect.options[districtSelect.selectedIndex]?.text || "";

    const address =
        document.getElementById("address").value.trim();

    const password =
        document.getElementById("password").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // ==========================================
    // VALIDATION
    // ==========================================

    if (password !== confirmPassword) {

        message.textContent =
            "Passwords do not match.";

        return;
    }

    if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {

        message.textContent =
            "Please enter a valid 10-digit mobile number.";

        return;
    }


    try {

        message.textContent =
            "Creating account...";


        // ==========================================
        // SEND TO BACKEND
        // ==========================================

        const response = await fetch(
            `${API}/api/auth/register`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,
                    email: email,
                    password: password

                })
            }
        );


        const data = await response.json();


        // ==========================================
        // SUCCESS
        // ==========================================

        if (response.ok && data.success) {

            message.textContent =
                "Account created successfully!";

            message.style.color = "green";


            setTimeout(() => {

                window.location.href = "login.html";

            }, 1500);

            return;
        }


        // ==========================================
        // ERROR FROM SERVER
        // ==========================================

        message.textContent =
            data.message || "Registration failed.";

        message.style.color = "red";


    } catch (error) {

        console.error("Registration error:", error);

        message.textContent =
            "Unable to connect to the server.";

        message.style.color = "red";
    }

});


// ==========================================
// START
// ==========================================
loadCountries();
```
