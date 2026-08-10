// ======================================================
// WaterGuardian-X Admin Dashboard
// CLEAN COMPLETE ADMIN.JS
// ======================================================


// ======================================================
// ADMIN AUTHENTICATION
// ======================================================

const ADMIN_TOKEN = localStorage.getItem("adminToken");

if (!ADMIN_TOKEN) {
    alert("Please login as Admin");
    window.location.href = "admin-login.html";
}

const ADMIN_HEADERS = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${ADMIN_TOKEN}`
};


// ======================================================
// API
// ======================================================

const API_URL =
    "https://waterguardian-backend.onrender.com/api/complaints";

const SENSOR_API_URL =
    "https://waterguardian-backend.onrender.com/api/sensors";

// ======================================================
// GLOBAL VARIABLES
// ======================================================

let complaintsData = [];

let adminMap = null;
let mapMarkers = [];
let complaintHeat = null;

let statusChart = null;
let trendChart = null;
let locationChart = null;

let phChart = null;
let temperatureChart = null;
let turbidityChart = null;


// ======================================================
// LOAD COMPLAINTS
// ======================================================

async function loadComplaints() {

    try {

        console.log("🔄 Loading complaints...");

        const response = await fetch(
            API_URL,
            {
                headers: ADMIN_HEADERS
            }
        );

        console.log(
            "📡 Complaint response:",
            response.status
        );

        if (!response.ok) {

            throw new Error(
                `Complaint API Error: ${response.status}`
            );
        }

        const data =
            await response.json();

        console.log(
            "📋 Complaint data:",
            data
        );

        if (Array.isArray(data)) {

            complaintsData = data;

        }
        else if (
            data &&
            Array.isArray(data.complaints)
        ) {

            complaintsData =
                data.complaints;

        }
        else {

            complaintsData = [];

        }

        displayComplaints(
            complaintsData
        );

        updateAnalytics(
            complaintsData
        );

        createCharts(
            complaintsData
        );

        advancedAIAnalysis(
            complaintsData
        );

        loadComplaintMap(
            complaintsData
        );

        console.log(
            "✅ Complaints loaded:",
            complaintsData.length
        );

    }
    catch (error) {

        console.error(
            "❌ Complaint Loading Error:",
            error
        );

        const table =
            document.getElementById(
                "complaintsTable"
            );

        if (table) {

            table.innerHTML = `
                <tr>
                    <td colspan="11">
                        ❌ Backend Connection Failed
                        <br>
                        ${error.message}
                    </td>
                </tr>
            `;

        }

    }

}


// ======================================================
// DISPLAY COMPLAINTS
// ======================================================

function displayComplaints(data) {

    const table =
        document.getElementById(
            "complaintsTable"
        );

    if (!table) {

        console.error(
            "❌ complaintsTable not found"
        );

        return;
    }

    table.innerHTML = "";

    if (
        !Array.isArray(data) ||
        data.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="11">
                    No Complaints Found
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(
        (c, index) => {

            const imageHTML =
                c.image
                    ? `
                        <img
                           src="https://waterguardian-backend.onrender.com/uploads/${c.image}"
                            onclick="previewImage('${c.image}')"
                            style="
                                width:60px;
                                height:60px;
                                object-fit:cover;
                                cursor:pointer;
                            "
                            alt="Complaint Image"
                        >
                    `
                    : "No Image";


            const status =
                c.status || "Pending";


            const statusClass =
                status
                    .toLowerCase()
                    .replace(/\s+/g, "-");


            table.innerHTML += `

                <tr>

                    <td>
                        ${index + 1}
                    </td>

                    <td>
                        ${c.id || c._id || "-"}
                    </td>

                    <td>
                        ${c.name || "-"}
                    </td>

                    <td>
                        ${c.issue || "-"}
                    </td>

                    <td>
                        ${c.location || "-"}
                    </td>

                    <td>
                        ${
                            c.date
                                ? new Date(
                                    c.date
                                ).toLocaleDateString()
                                : "-"
                        }
                    </td>

                    <td>
                        ${imageHTML}
                    </td>

                    <td>
                        <span
                            class="status ${statusClass}"
                        >
                            ${status}
                        </span>
                    </td>

                    <td>
                        ${c.officer || "Not Assigned"}
                    </td>

                    <td>
                        ${c.priority || "Normal"}
                    </td>

                    <td>

                        <button
                            type="button"
                            onclick="updateStatus('${c._id}')"
                        >
                            ✅ Update
                        </button>

                        <button
                            type="button"
                            onclick="assignOfficer('${c._id}')"
                        >
                            👮 Assign
                        </button>

                        <button
                            type="button"
                            onclick="generateReceipt('${c._id}')"
                        >
                            📄 PDF
                        </button>

                    </td>

                </tr>

            `;

        }
    );

}


// ======================================================
// COMPLAINT ANALYTICS
// ======================================================

function updateAnalytics(data) {

    const total =
        data.length;


    const pending =
        data.filter(
            c =>
                c.status === "Pending"
        ).length;


    const progress =
        data.filter(
            c =>
                c.status === "In Progress" ||
                c.status === "Processing"
        ).length;


    const resolved =
        data.filter(
            c =>
                c.status === "Resolved"
        ).length;


    const totalCount =
        document.getElementById(
            "totalCount"
        );

    const pendingCount =
        document.getElementById(
            "pendingCount"
        );

    const progressCount =
        document.getElementById(
            "progressCount"
        );

    const resolvedCount =
        document.getElementById(
            "resolvedCount"
        );


    if (totalCount)
        totalCount.innerText = total;

    if (pendingCount)
        pendingCount.innerText = pending;

    if (progressCount)
        progressCount.innerText = progress;

    if (resolvedCount)
        resolvedCount.innerText = resolved;


    const mapPending =
        document.getElementById(
            "mapPending"
        );

    const mapProgress =
        document.getElementById(
            "mapProgress"
        );

    const mapResolved =
        document.getElementById(
            "mapResolved"
        );


    if (mapPending)
        mapPending.innerText = pending;

    if (mapProgress)
        mapProgress.innerText = progress;

    if (mapResolved)
        mapResolved.innerText = resolved;

}


// ======================================================
// SEARCH
// ======================================================

function initializeSearch() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );

    if (!searchInput)
        return;


    searchInput.addEventListener(
        "keyup",
        function () {

            const value =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const filtered =
                complaintsData.filter(
                    c => {

                        return (

                            String(
                                c._id || ""
                            )
                                .toLowerCase()
                                .includes(value)

                            ||

                            String(
                                c.id || ""
                            )
                                .toLowerCase()
                                .includes(value)

                            ||

                            String(
                                c.name || ""
                            )
                                .toLowerCase()
                                .includes(value)

                            ||

                            String(
                                c.issue || ""
                            )
                                .toLowerCase()
                                .includes(value)

                            ||

                            String(
                                c.location || ""
                            )
                                .toLowerCase()
                                .includes(value)

                        );

                    }
                );


            displayComplaints(
                filtered
            );

        }
    );

}


// ======================================================
// IMAGE PREVIEW
// ======================================================

function previewImage(image) {

    const modal =
        document.getElementById(
            "imageModal"
        );

    const img =
        document.getElementById(
            "previewImg"
        );

    if (!modal || !img)
        return;


    img.src =
       `https://waterguardian-backend.onrender.com/uploads/${image}`;

    modal.style.display =
        "flex";

}


function closePreview() {

    const modal =
        document.getElementById(
            "imageModal"
        );

    if (modal) {

        modal.style.display =
            "none";

    }

}


// ======================================================
// UPDATE COMPLAINT STATUS
// ======================================================

async function updateStatus(id) {

    let status =
        prompt(
            "Enter Status:\nPending / In Progress / Resolved"
        );


    if (!status)
        return;


    status =
        status
            .trim()
            .toLowerCase();


    if (status === "pending") {

        status = "Pending";

    }
    else if (
        status === "in progress" ||
        status === "progress" ||
        status === "processing"
    ) {

        status = "In Progress";

    }
    else if (
        status === "resolved"
    ) {

        status = "Resolved";

    }
    else {

        alert(
            "Invalid status!\n\n" +
            "Enter:\n" +
            "Pending\n" +
            "In Progress\n" +
            "Resolved"
        );

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "PUT",

                    headers: ADMIN_HEADERS,

                    body:
                        JSON.stringify({
                            status:
                                status,

                            message:
                                "Status Updated by Admin"
                        })
                }
            );


        const result =
            await response.json();


        if (
            response.ok &&
            result.success
        ) {

            alert(
                "✅ Complaint status updated successfully!"
            );

            loadComplaints();

        }
        else {

            alert(
                "❌ Update Failed:\n" +
                (
                    result.message ||
                    "Unknown error"
                )
            );

        }

    }
    catch (error) {

        console.error(
            "❌ Update Error:",
            error
        );

        alert(
            "❌ Server Error"
        );

    }

}


// ======================================================
// ASSIGN OFFICER
// ======================================================

async function assignOfficer(id) {

    const officer =
        prompt(
            "Enter Officer Name:"
        );


    if (!officer)
        return;


    try {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "PUT",

                    headers: ADMIN_HEADERS,

                    body:
                        JSON.stringify({
                            officer:
                                officer
                        })
                }
            );


        const data =
            await response.json();


        if (data.success) {

            alert(
                "Officer Assigned Successfully"
            );

            loadComplaints();

        }
        else {

            alert(
                data.message ||
                "Assignment Failed"
            );

        }

    }
    catch (error) {

        console.error(
            "Officer assignment error:",
            error
        );

    }

}


// ======================================================
// PDF RECEIPT
// ======================================================

function generateReceipt(id) {

    const complaint =
        complaintsData.find(
            c =>
                c._id === id
        );


    if (!complaint) {

        alert(
            "Complaint Not Found"
        );

        return;
    }


    if (!window.jspdf) {

        alert(
            "jsPDF library is not loaded."
        );

        return;
    }


    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF();


    pdf.setFontSize(18);

    pdf.text(
        "WaterGuardian-X",
        20,
        20
    );


    pdf.setFontSize(14);

    pdf.text(
        "Water Complaint Receipt",
        20,
        35
    );


    pdf.setFontSize(12);


    pdf.text(
        "Complaint ID : " +
        (
            complaint.id ||
            complaint._id
        ),
        20,
        55
    );


    pdf.text(
        "Citizen : " +
        (
            complaint.name ||
            "-"
        ),
        20,
        70
    );


    pdf.text(
        "Issue : " +
        (
            complaint.issue ||
            "-"
        ),
        20,
        85
    );


    pdf.text(
        "Location : " +
        (
            complaint.location ||
            "-"
        ),
        20,
        100
    );


    pdf.text(
        "Status : " +
        (
            complaint.status ||
            "-"
        ),
        20,
        115
    );


    pdf.text(
        "Generated Date : " +
        new Date().toLocaleDateString(),
        20,
        130
    );


    pdf.save(
        "WaterGuardian_Complaint.pdf"
    );

}


// ======================================================
// COMPLAINT CHARTS
// ======================================================

function createCharts(data) {

    createStatusChart(data);

    createTrendChart(data);

    createLocationChart(data);

}


// ======================================================
// STATUS CHART
// ======================================================

function createStatusChart(data) {

    const canvas =
        document.getElementById(
            "statusChart"
        );


    if (!canvas)
        return;


    if (
        typeof Chart === "undefined"
    ) {

        console.error(
            "❌ Chart.js is not loaded"
        );

        return;
    }


    const pending =
        data.filter(
            c =>
                c.status === "Pending"
        ).length;


    const progress =
        data.filter(
            c =>
                c.status === "In Progress" ||
                c.status === "Processing"
        ).length;


    const resolved =
        data.filter(
            c =>
                c.status === "Resolved"
        ).length;


    if (statusChart) {

        statusChart.destroy();

    }


    statusChart =
        new Chart(
            canvas,
            {
                type: "doughnut",

                data: {

                    labels: [
                        "Pending",
                        "In Progress",
                        "Resolved"
                    ],

                    datasets: [
                        {
                            data: [
                                pending,
                                progress,
                                resolved
                            ]
                        }
                    ]

                },

                options: {
                    responsive: true,

                    plugins: {
                        legend: {
                            position:
                                "bottom"
                        }
                    }
                }

            }
        );

}


// ======================================================
// TREND CHART
// ======================================================

function createTrendChart(data) {

    const canvas =
        document.getElementById(
            "trendChart"
        );


    if (!canvas)
        return;


    if (
        typeof Chart === "undefined"
    )
        return;


    const months = {};


    data.forEach(
        c => {

            const date =
                new Date(
                    c.createdAt ||
                    c.date ||
                    Date.now()
                );


            const month =
                date.toLocaleString(
                    "default",
                    {
                        month:
                            "short"
                    }
                );


            months[month] =
                (
                    months[month] ||
                    0
                ) + 1;

        }
    );


    if (trendChart) {

        trendChart.destroy();

    }


    trendChart =
        new Chart(
            canvas,
            {
                type: "line",

                data: {

                    labels:
                        Object.keys(
                            months
                        ),

                    datasets: [
                        {
                            label:
                                "Complaints",

                            data:
                                Object.values(
                                    months
                                )
                        }
                    ]

                },

                options: {
                    responsive: true
                }

            }
        );

}


// ======================================================
// LOCATION CHART
// ======================================================

function createLocationChart(data) {

    const canvas =
        document.getElementById(
            "locationChart"
        );


    if (!canvas)
        return;


    if (
        typeof Chart === "undefined"
    )
        return;


    const locations = {};


    data.forEach(
        c => {

            const location =
                c.district ||
                c.location ||
                "Unknown";


            locations[location] =
                (
                    locations[location] ||
                    0
                ) + 1;

        }
    );


    const sorted =
        Object.entries(
            locations
        )
            .sort(
                (a, b) =>
                    b[1] - a[1]
            )
            .slice(
                0,
                5
            );


    if (locationChart) {

        locationChart.destroy();

    }


    locationChart =
        new Chart(
            canvas,
            {
                type: "bar",

                data: {

                    labels:
                        sorted.map(
                            x =>
                                x[0]
                        ),

                    datasets: [
                        {
                            label:
                                "Complaints",

                            data:
                                sorted.map(
                                    x =>
                                        x[1]
                                )
                        }
                    ]

                },

                options: {
                    responsive: true
                }

            }
        );

}


// ======================================================
// AI ANALYSIS
// ======================================================

function advancedAIAnalysis(data) {

    const result =
        document.getElementById(
            "aiResult"
        );


    const risk =
        document.getElementById(
            "riskScore"
        );


    if (!result)
        return;


    let leakage = 0;

    let emergency = 0;


    data.forEach(
        c => {

            const text =
                (
                    (c.issue || "") +
                    " " +
                    (c.description || "")
                )
                    .toLowerCase();


            if (
                text.includes("leak") ||
                text.includes("pipe") ||
                text.includes("burst")
            ) {

                leakage++;

            }


            if (
                text.includes("urgent") ||
                text.includes("emergency") ||
                text.includes("no water")
            ) {

                emergency++;

            }

        }
    );


    const score =
        Math.min(
            100,
            leakage * 10 +
            emergency * 15
        );


    if (risk) {

        risk.innerText =
            score + "%";

    }


    result.innerHTML = `

        <h4>🤖 AI Report</h4>

        <p>
            💧 Leakage Issues:
            <b>${leakage}</b>
        </p>

        <p>
            🚨 Emergency Cases:
            <b>${emergency}</b>
        </p>

        <p>
            Analysis completed automatically.
        </p>

    `;

}


// ======================================================
// ADMIN MAP
// ======================================================

function initializeAdminMap() {

    const mapElement =
        document.getElementById(
            "adminMap"
        );


    if (!mapElement)
        return;


    if (
        typeof L === "undefined"
    ) {

        console.error(
            "❌ Leaflet is not loaded"
        );

        return;
    }


    if (adminMap)
        return;


    adminMap =
        L.map(
            "adminMap"
        ).setView(
            [
                13.2742,
                79.1200
            ],
            12
        );


    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
                "© OpenStreetMap"
        }
    ).addTo(
        adminMap
    );

}


// ======================================================
// LOAD COMPLAINT MAP
// ======================================================

function loadComplaintMap(data) {

    if (!adminMap) {

        initializeAdminMap();

    }


    if (!adminMap)
        return;


    mapMarkers.forEach(
        marker => {

            adminMap.removeLayer(
                marker
            );

        }
    );


    mapMarkers = [];


    const heatPoints = [];


    data.forEach(
        c => {

            if (
                c.latitude === undefined ||
                c.longitude === undefined
            ) {
                return;
            }


            const lat =
                Number(
                    c.latitude
                );


            const lng =
                Number(
                    c.longitude
                );


            if (
                !Number.isFinite(lat) ||
                !Number.isFinite(lng)
            ) {
                return;
            }


            let color =
                "orange";


            if (
                c.status === "Resolved"
            ) {

                color =
                    "green";

            }
            else if (
                c.status === "In Progress"
            ) {

                color =
                    "blue";

            }


            const marker =
                L.circleMarker(
                    [
                        lat,
                        lng
                    ],
                    {
                        radius: 10,
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.8
                    }
                );


            marker.addTo(
                adminMap
            );


            marker.bindPopup(`

                <div>

                    <h3>
                        💧 WaterGuardian-X
                    </h3>

                    <p>
                        <b>ID:</b>
                        ${c.id || c._id || "-"}
                    </p>

                    <p>
                        <b>Citizen:</b>
                        ${c.name || "-"}
                    </p>

                    <p>
                        <b>Issue:</b>
                        ${c.issue || "-"}
                    </p>

                    <p>
                        <b>Status:</b>
                        ${c.status || "Pending"}
                    </p>

                    <p>
                        <b>Location:</b>
                        ${c.location || "-"}
                    </p>

                </div>

            `);


            mapMarkers.push(
                marker
            );


            heatPoints.push(
                [
                    lat,
                    lng,
                    1
                ]
            );

        }
    );


    if (
        complaintHeat &&
        adminMap
    ) {

        adminMap.removeLayer(
            complaintHeat
        );

        complaintHeat = null;

    }


    if (
        typeof L.heatLayer ===
            "function" &&
        heatPoints.length > 0
    ) {

        complaintHeat =
            L.heatLayer(
                heatPoints,
                {
                    radius: 30,
                    blur: 25
                }
            ).addTo(
                adminMap
            );

    }


    if (
        mapMarkers.length > 0
    ) {

        const group =
            L.featureGroup(
                mapMarkers
            );


        adminMap.fitBounds(
            group.getBounds(),
            {
                padding: [
                    30,
                    30
                ]
            }
        );

    }

}


// ======================================================
// CENTER MAP
// ======================================================

function centerAdminMap() {

    if (!adminMap)
        return;


    adminMap.flyTo(
        [
            13.2742,
            79.1200
        ],
        12
    );

}


// ======================================================
// SENSOR SYSTEM
// ======================================================

// IMPORTANT:
// THERE IS ONLY ONE loadSensors() FUNCTION.
// API returns { success:true, sensors:[...] }


// ======================================================
// LOAD SENSORS
// ======================================================

async function loadSensors() {

    try {

        console.log(
            "🔄 Loading sensors..."
        );


        const response =
            await fetch(
                SENSOR_API_URL
            );


        console.log(
            "🔥 SENSOR RESPONSE:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Failed to load sensors: ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "🔥 SENSOR API DATA:",
            data
        );


        let sensors = [];


        if (
            Array.isArray(data)
        ) {

            sensors =
                data;

        }
        else if (
            data &&
            Array.isArray(
                data.sensors
            )
        ) {

            sensors =
                data.sensors;

        }
        else {

            console.error(
                "❌ Invalid sensor response:",
                data
            );

            sensors = [];

        }


        console.log(
            "✅ SENSOR ARRAY:",
            sensors
        );


        displaySensors(
            sensors
        );

    }
    catch (error) {

        console.error(
            "❌ Sensor loading error:",
            error
        );


        const container =
            document.getElementById(
                "sensorContainer"
            );


        if (container) {

            container.innerHTML = `

                <div class="danger-alert">

                    ❌ Failed to load sensor data.

                    <br>

                    ${error.message}

                </div>

            `;

        }

    }

}


// ======================================================
// DISPLAY SENSORS
// ======================================================

function displaySensors(sensors) {

    console.log(
        "📡 Displaying sensors:",
        sensors
    );


    const container =
        document.getElementById(
            "sensorContainer"
        );


    if (!container) {

        console.error(
            "❌ sensorContainer not found in admin.html"
        );

        return;

    }


    if (
        !Array.isArray(sensors) ||
        sensors.length === 0
    ) {

        container.innerHTML = `

            <div class="safe-alert">

                📡 No sensors available.

            </div>

        `;


        updateSensorAnalytics(
            []
        );

        checkSensorAlerts(
            []
        );

        return;

    }


    updateSensorAnalytics(
        sensors
    );


    checkSensorAlerts(
        sensors
    );


    createSensorCharts(
        sensors
    );


    container.innerHTML =
        sensors
            .map(
                sensor => {

                    const status =
                        sensor.status ||
                        (
                            sensor.active
                                ? "Active"
                                : "Offline"
                        );


                    const statusLower =
                        String(
                            status
                        ).toLowerCase();


                    const statusClass =
                        (
                            statusLower ===
                                "active" ||
                            statusLower ===
                                "normal"
                        )
                            ? "sensor-normal"
                            : "sensor-warning";


                    return `

                        <div class="sensor-card">

                            <div class="sensor-card-header">

                                <div>

                                    <h3>
                                        💧
                                        ${
                                            sensor.name ||
                                            "Water Sensor"
                                        }
                                    </h3>

                                    <small>
                                        Sensor ID:
                                        ${
                                            sensor.sensorId ||
                                            sensor._id ||
                                            "--"
                                        }
                                    </small>

                                </div>


                                <span
                                    class="${statusClass}"
                                >
                                    ${status}
                                </span>

                            </div>


                            <p>
                                📍
                                <strong>
                                    Location:
                                </strong>

                                ${
                                    sensor.location ||
                                    "--"
                                }
                            </p>


                            <p>
                                🔬
                                <strong>
                                    Type:
                                </strong>

                                ${
                                    sensor.type ||
                                    "Water Sensor"
                                }
                            </p>


                            <div class="sensor-values">

                                <div>

                                    <strong>
                                        pH
                                    </strong>

                                    <span>
                                        ${
                                            sensor.ph ??
                                            "--"
                                        }
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Turbidity
                                    </strong>

                                    <span>
                                        ${
                                            sensor.turbidity ??
                                            "--"
                                        }
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Temperature
                                    </strong>

                                    <span>
                                        ${
                                            sensor.temperature ??
                                            "--"
                                        }°C
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Water Level
                                    </strong>

                                    <span>
                                        ${
                                            sensor.waterLevel ??
                                            "--"
                                        }%
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Water Quality
                                    </strong>

                                    <span>
                                        ${
                                            sensor.waterQuality ??
                                            "--"
                                        }%
                                    </span>

                                </div>


                                <div>

                                    <strong>
                                        Flow Rate
                                    </strong>

                                    <span>
                                        ${
                                            sensor.flowRate ??
                                            "--"
                                        }
                                    </span>

                                </div>

                            </div>


                            <div class="sensor-updated">

                                🕒 Last Updated:

                                ${
                                    sensor.lastUpdated
                                        ? new Date(
                                            sensor.lastUpdated
                                        ).toLocaleString()
                                        : sensor.updatedAt
                                            ? new Date(
                                                sensor.updatedAt
                                            ).toLocaleString()
                                            : "Not available"
                                }

                            </div>

                        </div>

                    `;

                }
            )
            .join("");


    console.log(
        `✅ ${sensors.length} sensor(s) displayed`
    );

}


// ======================================================
// SENSOR ANALYTICS
// ======================================================

function updateSensorAnalytics(
    sensors
) {

    const totalElement =
        document.getElementById(
            "totalSensors"
        );


    const activeElement =
        document.getElementById(
            "activeSensors"
        );


    const phElement =
        document.getElementById(
            "averagePH"
        );


    const tempElement =
        document.getElementById(
            "averageTemp"
        );


    const turbidityElement =
        document.getElementById(
            "averageTurbidity"
        );


    if (
        !Array.isArray(sensors) ||
        sensors.length === 0
    ) {

        if (totalElement)
            totalElement.innerText =
                "0";

        if (activeElement)
            activeElement.innerText =
                "0";

        if (phElement)
            phElement.innerText =
                "0";

        if (tempElement)
            tempElement.innerText =
                "0°C";

        if (turbidityElement)
            turbidityElement.innerText =
                "0";

        return;

    }


    const total =
        sensors.length;


    const active =
        sensors.filter(
            sensor => {

                const status =
                    String(
                        sensor.status ||
                        ""
                    ).toLowerCase();


                return (
                    status === "active" ||
                    status === "normal" ||
                    sensor.active === true
                );

            }
        ).length;


    const phValues =
        sensors
            .map(
                sensor =>
                    Number(
                        sensor.ph
                    )
            )
            .filter(
                value =>
                    Number.isFinite(
                        value
                    ) &&
                    value > 0
            );


    const avgPH =
        phValues.length
            ? phValues.reduce(
                (
                    sum,
                    value
                ) =>
                    sum + value,
                0
            ) /
            phValues.length
            : 0;


    const temperatureValues =
        sensors
            .map(
                sensor =>
                    Number(
                        sensor.temperature
                    )
            )
            .filter(
                value =>
                    Number.isFinite(
                        value
                    )
            );


    const avgTemp =
        temperatureValues.length
            ? temperatureValues.reduce(
                (
                    sum,
                    value
                ) =>
                    sum + value,
                0
            ) /
            temperatureValues.length
            : 0;


    const turbidityValues =
        sensors
            .map(
                sensor =>
                    Number(
                        sensor.turbidity
                    )
            )
            .filter(
                value =>
                    Number.isFinite(
                        value
                    )
            );


    const avgTurbidity =
        turbidityValues.length
            ? turbidityValues.reduce(
                (
                    sum,
                    value
                ) =>
                    sum + value,
                0
            ) /
            turbidityValues.length
            : 0;


    if (totalElement)
        totalElement.innerText =
            total;


    if (activeElement)
        activeElement.innerText =
            active;


    if (phElement)
        phElement.innerText =
            avgPH > 0
                ? avgPH.toFixed(2)
                : "N/A";


    if (tempElement)
        tempElement.innerText =
            avgTemp > 0
                ? avgTemp.toFixed(1) +
                  "°C"
                : "N/A";


    if (turbidityElement)
        turbidityElement.innerText =
            avgTurbidity > 0
                ? avgTurbidity.toFixed(2)
                : "N/A";


    console.log(
        "📊 Sensor Analytics Updated:",
        {
            total,
            active,
            averagePH:
                avgPH,
            averageTemperature:
                avgTemp,
            averageTurbidity:
                avgTurbidity
        }
    );

}


// ======================================================
// SENSOR CHARTS
// ======================================================

function createSensorCharts(
    sensors
) {

    if (
        typeof Chart === "undefined"
    ) {

        console.error(
            "❌ Chart.js is not loaded"
        );

        return;
    }


    const phCanvas =
        document.getElementById(
            "phChart"
        );


    const tempCanvas =
        document.getElementById(
            "temperatureChart"
        );


    const turbidityCanvas =
        document.getElementById(
            "turbidityChart"
        );


    const labels =
        sensors.map(
            sensor =>
                sensor.name ||
                "Sensor"
        );


    const phValues =
        sensors.map(
            sensor =>
                Number(
                    sensor.ph || 0
                )
        );


    const tempValues =
        sensors.map(
            sensor =>
                Number(
                    sensor.temperature ||
                    0
                )
        );


    const turbidityValues =
        sensors.map(
            sensor =>
                Number(
                    sensor.turbidity ||
                    0
                )
        );


    if (phChart) {

        phChart.destroy();

        phChart = null;

    }


    if (temperatureChart) {

        temperatureChart.destroy();

        temperatureChart = null;

    }


    if (turbidityChart) {

        turbidityChart.destroy();

        turbidityChart = null;

    }


    if (phCanvas) {

        phChart =
            new Chart(
                phCanvas,
                {
                    type: "line",

                    data: {

                        labels,

                        datasets: [
                            {
                                label:
                                    "pH",

                                data:
                                    phValues
                            }
                        ]

                    },

                    options: {
                        responsive: true
                    }

                }
            );

    }


    if (tempCanvas) {

        temperatureChart =
            new Chart(
                tempCanvas,
                {
                    type: "line",

                    data: {

                        labels,

                        datasets: [
                            {
                                label:
                                    "Temperature °C",

                                data:
                                    tempValues
                            }
                        ]

                    },

                    options: {
                        responsive: true
                    }

                }
            );

    }


    if (turbidityCanvas) {

        turbidityChart =
            new Chart(
                turbidityCanvas,
                {
                    type: "line",

                    data: {

                        labels,

                        datasets: [
                            {
                                label:
                                    "Turbidity",

                                data:
                                    turbidityValues
                            }
                        ]

                    },

                    options: {
                        responsive: true
                    }

                }
            );

    }

}


// ======================================================
// SENSOR ALERTS
// ======================================================

function checkSensorAlerts(
    sensors
) {

    const alertBox =
        document.getElementById(
            "alertContainer"
        );


    if (!alertBox)
        return;


    if (
        !Array.isArray(sensors) ||
        sensors.length === 0
    ) {

        alertBox.innerHTML = `

            <div class="safe-alert">
                📡 No sensor data available.
            </div>

        `;

        return;

    }


    const alerts = [];


    sensors.forEach(
        sensor => {

            const ph =
                Number(
                    sensor.ph
                );


            const turbidity =
                Number(
                    sensor.turbidity
                );


            const temperature =
                Number(
                    sensor.temperature
                );


            if (
                Number.isFinite(ph) &&
                ph > 0 &&
                (
                    ph < 6.5 ||
                    ph > 8.5
                )
            ) {

                alerts.push(
                    `⚠️ ${
                        sensor.name ||
                        "Sensor"
                    }: Abnormal pH (${ph})`
                );

            }


            if (
                Number.isFinite(
                    turbidity
                ) &&
                turbidity > 5
            ) {

                alerts.push(
                    `⚠️ ${
                        sensor.name ||
                        "Sensor"
                    }: High turbidity (${turbidity})`
                );

            }


            if (
                Number.isFinite(
                    temperature
                ) &&
                temperature > 35
            ) {

                alerts.push(
                    `⚠️ ${
                        sensor.name ||
                        "Sensor"
                    }: High temperature (${temperature}°C)`
                );

            }

        }
    );


    if (
        alerts.length === 0
    ) {

        alertBox.innerHTML = `

            <div class="safe-alert">
                ✅ All sensors are working normally
            </div>

        `;

    }
    else {

        alertBox.innerHTML =
            alerts
                .map(
                    alert => `

                        <div class="danger-alert">
                            ${alert}
                        </div>

                    `
                )
                .join("");

    }

}


// ======================================================
// NOTIFICATIONS
// ======================================================

function createNotification(
    message
) {

    const container =
        document.getElementById(
            "notificationContainer"
        );


    if (!container)
        return;


    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        "notification-item";


    notification.innerHTML = `

        <strong>
            🔔 ${new Date().toLocaleTimeString()}
        </strong>

        <p>
            ${message}
        </p>

    `;


    container.prepend(
        notification
    );

}


// ======================================================
// DARK MODE
// ======================================================

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );

}


// ======================================================
// LOGOUT
// ======================================================

function logout() {

    localStorage.clear();

    window.location.href =
        "admin-login.html";

}


// ======================================================
// AI CHAT
// ======================================================

function sendAIMessage() {

    const input =
        document.getElementById(
            "aiInput"
        );


    const messages =
        document.getElementById(
            "aiMessages"
        );


    if (!input || !messages)
        return;


    const text =
        input.value.trim();


    if (!text)
        return;


    const userMessage =
        document.createElement(
            "div"
        );


    userMessage.className =
        "user-message";


    userMessage.innerText =
        text;


    messages.appendChild(
        userMessage
    );


    const botMessage =
        document.createElement(
            "div"
        );


    botMessage.className =
        "bot-message";


    botMessage.innerText =
        "🤖 Analysis completed. Check complaint statistics and priority cases.";


    messages.appendChild(
        botMessage
    );


    input.value = "";


    messages.scrollTop =
        messages.scrollHeight;

}


function closeAIChat() {

    const box =
        document.getElementById(
            "aiChatBox"
        );


    if (box) {

        box.style.display =
            "none";

    }

}


// ======================================================
// AUTO REFRESH SENSORS
// ======================================================

setInterval(
    function () {

        loadSensors();

    },
    10000
);


// ======================================================
// PAGE START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "🚀 WaterGuardian-X Admin Dashboard Loaded"
        );


        initializeSearch();


        loadComplaints();


        loadSensors();


        initializeAdminMap();

    }
);


// ======================================================
// GLOBAL PAGE LOAD
// ======================================================

window.addEventListener(
    "load",
    function () {

        console.log(
            "✅ Admin page fully loaded"
        );

    }
);