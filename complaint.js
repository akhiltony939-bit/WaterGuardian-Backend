console.log("💧 WaterGuardian-X Complaint JS Loaded");

// =====================================================
// API
// =====================================================

const API = "http://localhost:5000/api";

// =====================================================
// ELEMENTS
// =====================================================

const countrySelect = document.getElementById("country");
const stateSelect = document.getElementById("state");
const districtSelect = document.getElementById("district");

const locationInput = document.getElementById("location");
const latitudeInput = document.getElementById("latitude");
const longitudeInput = document.getElementById("longitude");

const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("imagePreview");

const complaintForm = document.getElementById("complaintForm");


// =====================================================
// COUNTRY → LOAD COUNTRIES
// =====================================================

async function loadCountries() {

    console.log("🌍 Loading countries...");

    countrySelect.innerHTML =
        '<option value="">Loading Countries...</option>';

    try {

        const response = await fetch(
            API + "/location/countries"
        );

        console.log(
            "Countries status:",
            response.status
        );

        if (!response.ok) {
            throw new Error(
                "Countries API returned " +
                response.status
            );
        }

        const data = await response.json();

        console.log(
            "🌍 Countries Response:",
            data
        );

        countrySelect.innerHTML =
            '<option value="">Select Country</option>';

        if (
            data.success &&
            Array.isArray(data.countries)
        ) {

            data.countries.forEach(function(country) {

                const option =
                    document.createElement("option");

                option.value =
                    country.isoCode;

                option.textContent =
                    country.name;

                countrySelect.appendChild(option);

            });

            console.log(
                "✅ Countries loaded:",
                data.countries.length
            );

        } else {

            countrySelect.innerHTML =
                '<option value="">No countries found</option>';

            console.error(
                "❌ Countries data problem:",
                data
            );
        }

    } catch (error) {

        console.error(
            "❌ Country Error:",
            error
        );

        countrySelect.innerHTML =
            '<option value="">Failed to load countries</option>';
    }
}


// =====================================================
// COUNTRY → STATES
// =====================================================

countrySelect.addEventListener(
    "change",
    async function() {

        const country =
            countrySelect.value;

        console.log(
            "🌍 Country selected:",
            country
        );

        // Reset state
        stateSelect.innerHTML =
            '<option value="">Loading States...</option>';

        stateSelect.disabled = true;

        // Reset district
        districtSelect.innerHTML =
            '<option value="">Select State First</option>';

        districtSelect.disabled = true;


        if (!country) {

            stateSelect.innerHTML =
                '<option value="">Select Country First</option>';

            return;
        }


        try {

            const url =
                API +
                "/location/states/" +
                encodeURIComponent(country);

            console.log(
                "🏛️ States URL:",
                url
            );

            const response =
                await fetch(url);

            console.log(
                "States status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "States API returned " +
                    response.status
                );
            }


            const data =
                await response.json();


            console.log(
                "🏛️ States Response:",
                data
            );


            stateSelect.innerHTML =
                '<option value="">Select State</option>';


            if (
                data.success &&
                Array.isArray(data.states)
            ) {

                data.states.forEach(
                    function(state) {

                        const option =
                            document.createElement(
                                "option"
                            );

                        /*
                         * IMPORTANT:
                         * Backend normally returns:
                         * state.isoCode
                         * state.name
                         */

                        option.value =
                            state.isoCode;

                        option.textContent =
                            state.name;

                        stateSelect.appendChild(
                            option
                        );

                    }
                );


                stateSelect.disabled = false;


                console.log(
                    "✅ States loaded:",
                    data.states.length
                );

            } else {

                stateSelect.innerHTML =
                    '<option value="">No States Found</option>';

                console.error(
                    "❌ States data problem:",
                    data
                );
            }

        } catch (error) {

            console.error(
                "❌ State Error:",
                error
            );

            stateSelect.innerHTML =
                '<option value="">Failed to load states</option>';
        }

    }
);


// =====================================================
// STATE → DISTRICTS / CITIES
// =====================================================

stateSelect.addEventListener(
    "change",
    async function() {

        const country =
            countrySelect.value;

        const state =
            stateSelect.value;


        console.log(
            "🏛️ State selected:",
            state
        );


        districtSelect.innerHTML =
            '<option value="">Loading Districts...</option>';

        districtSelect.disabled = true;


        if (!country || !state) {

            districtSelect.innerHTML =
                '<option value="">Select State First</option>';

            return;
        }


        try {

            const url =
                API +
                "/location/cities/" +
                encodeURIComponent(country) +
                "/" +
                encodeURIComponent(state);


            console.log(
                "🏙️ Cities URL:",
                url
            );


            const response =
                await fetch(url);


            console.log(
                "Cities status:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "Cities API returned " +
                    response.status
                );
            }


            const data =
                await response.json();


            console.log(
                "🏙️ Cities Response:",
                data
            );


            districtSelect.innerHTML =
                '<option value="">Select District / City</option>';


            if (
                data.success &&
                Array.isArray(data.cities)
            ) {

                data.cities.forEach(
                    function(city) {

                        const option =
                            document.createElement(
                                "option"
                            );

                        option.value =
                            city.name;

                        option.textContent =
                            city.name;

                        districtSelect.appendChild(
                            option
                        );

                    }
                );


                districtSelect.disabled = false;


                console.log(
                    "✅ Districts loaded:",
                    data.cities.length
                );

            } else {

                districtSelect.innerHTML =
                    '<option value="">No Districts Found</option>';

                console.error(
                    "❌ Cities data problem:",
                    data
                );
            }

        } catch (error) {

            console.error(
                "❌ District Error:",
                error
            );

            districtSelect.innerHTML =
                '<option value="">Failed to load districts</option>';
        }

    }
);


// =====================================================
// MAP
// =====================================================

let map = null;
let marker = null;


function initMap() {

    const mapElement =
        document.getElementById("map");


    if (!mapElement) {
        return;
    }


    map =
        L.map("map").setView(
            [20.5937, 78.9629],
            5
        );


    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "© OpenStreetMap contributors"
        }
    ).addTo(map);


    map.on(
        "click",
        async function(event) {

            const lat =
                event.latlng.lat;

            const lon =
                event.latlng.lng;


            setLocation(
                lat,
                lon
            );


            await reverseGeocode(
                lat,
                lon
            );

        }
    );
}


// =====================================================
// SET LOCATION
// =====================================================

function setLocation(lat, lon) {

    latitudeInput.value =
        lat;

    longitudeInput.value =
        lon;


    if (marker) {

        marker.setLatLng([
            lat,
            lon
        ]);

    } else {

        marker =
            L.marker([
                lat,
                lon
            ]).addTo(map);
    }


    map.setView(
        [
            lat,
            lon
        ],
        15
    );
}


// =====================================================
// GPS
// =====================================================

const gpsButton =
    document.getElementById(
        "getLocation"
    );


if (gpsButton) {

    gpsButton.addEventListener(
        "click",
        function() {

            if (!navigator.geolocation) {

                alert(
                    "Geolocation is not supported."
                );

                return;
            }


            navigator.geolocation.getCurrentPosition(

                async function(position) {

                    const lat =
                        position.coords.latitude;

                    const lon =
                        position.coords.longitude;


                    setLocation(
                        lat,
                        lon
                    );


                    await reverseGeocode(
                        lat,
                        lon
                    );
                },

                function(error) {

                    console.error(
                        "GPS Error:",
                        error
                    );

                    alert(
                        "Unable to get your current location."
                    );
                }
            );
        }
    );
}


// =====================================================
// REVERSE GEOCODING
// =====================================================

async function reverseGeocode(lat, lon) {

    try {

        const url =
            "https://nominatim.openstreetmap.org/reverse" +
            "?format=json" +
            "&lat=" +
            lat +
            "&lon=" +
            lon;


        const response =
            await fetch(url);


        const data =
            await response.json();


        if (data.display_name) {

            locationInput.value =
                data.display_name;
        }

    } catch (error) {

        console.error(
            "❌ Reverse Geocode Error:",
            error
        );
    }
}


// =====================================================
// IMAGE PREVIEW
// =====================================================

if (imageInput) {

    imageInput.addEventListener(
        "change",
        function() {

            const file =
                imageInput.files[0];


            if (!file) {
                return;
            }


            if (imagePreview) {

                imagePreview.src =
                    URL.createObjectURL(file);

                imagePreview.style.display =
                    "block";
            }
        }
    );
}


// =====================================================
// SUBMIT COMPLAINT
// =====================================================

if (complaintForm) {

    complaintForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            try {

                const formData =
                    new FormData();


                formData.append(
                    "name",
                    document.getElementById(
                        "name"
                    ).value
                );


                formData.append(
                    "issue",
                    document.getElementById(
                        "issue"
                    ).value
                );


                formData.append(
                    "location",
                    locationInput.value
                );


                formData.append(
                    "country",
                    countrySelect.value
                );


                formData.append(
                    "state",
                    stateSelect.value
                );


                formData.append(
                    "district",
                    districtSelect.value
                );


                formData.append(
                    "area",
                    document.getElementById(
                        "area"
                    ).value
                );


                formData.append(
                    "description",
                    document.getElementById(
                        "description"
                    ).value
                );


                formData.append(
                    "latitude",
                    latitudeInput.value
                );


                formData.append(
                    "longitude",
                    longitudeInput.value
                );


                formData.append(
                    "userId",
                    localStorage.getItem(
                        "userId"
                    ) || ""
                );


                const storedUser =
                    localStorage.getItem(
                        "user"
                    );


                if (storedUser) {

                    try {

                        const user =
                            JSON.parse(
                                storedUser
                            );


                        formData.append(
                            "email",
                            user.email || ""
                        );

                    } catch (error) {

                        console.error(
                            "User data error:",
                            error
                        );
                    }
                }


                formData.append(
                    "priority",
                    "Normal"
                );


                if (
                    imageInput &&
                    imageInput.files.length > 0
                ) {

                    formData.append(
                        "image",
                        imageInput.files[0]
                    );
                }


                const response =
                    await fetch(
                        API +
                        "/complaints/create",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "📨 Complaint Response:",
                    data
                );


                if (data.success) {

                    alert(
                        "✅ Complaint Submitted Successfully"
                    );


                    window.location.href =
                        "dashboard.html";

                } else {

                    alert(
                        data.message ||
                        "Complaint submission failed"
                    );
                }

            } catch (error) {

                console.error(
                    "❌ Complaint Submit Error:",
                    error
                );


                alert(
                    "❌ Backend not connected"
                );
            }

        }
    );
}


// =====================================================
// PAGE START
// =====================================================

window.addEventListener(
    "load",
    function() {

        console.log(
            "🚀 Complaint page initialized"
        );


        loadCountries();

        initMap();

    }
);