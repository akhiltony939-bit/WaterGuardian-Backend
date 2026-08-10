const API = "https://waterguardian-backend.onrender.com";

const countrySelect = document.getElementById("countrySelect");
const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");


// ==========================================
// LOAD COUNTRIES
// ==========================================
async function loadCountries() {
    try {
        const response = await fetch(`${API}/api/location/countries`);

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

        const response = await fetch(
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

        const response = await fetch(
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
// START
// ==========================================
loadCountries();
