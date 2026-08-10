```javascript
// ===============================
// WaterGuardian-X Register
// Country → State → District
// ===============================

// IMPORTANT:
// Change this URL if your deployed backend has a different URL.
const API = "https://waterguardian-backend.onrender.com";

const countrySelect = document.getElementById("countrySelect");
const stateSelect = document.getElementById("stateSelect");
const districtSelect = document.getElementById("districtSelect");


// --------------------------------
// Helper: add options to dropdown
// --------------------------------
function addOptions(select, items, placeholder) {

    select.innerHTML = "";

    const firstOption = document.createElement("option");
    firstOption.value = "";
    firstOption.textContent = placeholder;
    select.appendChild(firstOption);

    items.forEach(item => {

        const option = document.createElement("option");

        // Supports either:
        // "India"
        // OR
        // { name: "India" }
        if (typeof item === "string") {
            option.value = item;
            option.textContent = item;
        } else {
            option.value = item.name || item.title || item.value || "";
            option.textContent = item.name || item.title || item.value || "";
        }

        select.appendChild(option);
    });
}


// --------------------------------
// Load Countries
// --------------------------------
async function loadCountries() {

    try {

        const response = await fetch(`${API}/api/location/countries`);

        if (!response.ok) {
            throw new Error("Country API failed");
        }

        const data = await response.json();

        const countries = Array.isArray(data)
            ? data
            : data.countries || data.data || [];

        addOptions(
            countrySelect,
            countries,
            "Select Country"
        );

    } catch (error) {

        console.error("Country loading error:", error);

        countrySelect.innerHTML =
            `<option value="">Unable to load countries</option>`;
    }
}


// --------------------------------
// Country changed
// --------------------------------
countrySelect.addEventListener("change", async function () {

    const country = this.value;

    stateSelect.innerHTML =
        `<option value="">Select State</option>`;

    districtSelect.innerHTML =
        `<option value="">Select District</option>`;

    stateSelect.disabled = true;
    districtSelect.disabled = true;

    if (!country) return;

    try {

        const response = await fetch(
            `${API}/api/location/states/${encodeURIComponent(country)}`
        );

        if (!response.ok) {
            throw new Error("State API failed");
        }

        const data = await response.json();

        const states = Array.isArray(data)
            ? data
            : data.states || data.data || [];

        addOptions(
            stateSelect,
            states,
            "Select State"
        );

        stateSelect.disabled = false;

    } catch (error) {

        console.error("State loading error:", error);

        stateSelect.innerHTML =
            `<option value="">Unable to load states</option>`;
    }
});


// --------------------------------
// State changed
// --------------------------------
stateSelect.addEventListener("change", async function () {

    const state = this.value;

    districtSelect.innerHTML =
        `<option value="">Select District</option>`;

    districtSelect.disabled = true;

    if (!state) return;

    try {

        const response = await fetch(
            `${API}/api/location/districts/${encodeURIComponent(state)}`
        );

        if (!response.ok) {
            throw new Error("District API failed");
        }

        const data = await response.json();

        const districts = Array.isArray(data)
            ? data
            : data.districts || data.data || [];

        addOptions(
            districtSelect,
            districts,
            "Select District"
        );

        districtSelect.disabled = false;

    } catch (error) {

        console.error("District loading error:", error);

        districtSelect.innerHTML =
            `<option value="">Unable to load districts</option>`;
    }
});


// --------------------------------
// Start
// --------------------------------
loadCountries();
```
