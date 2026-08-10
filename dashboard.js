// ======================================
// WaterGuardian-X Dashboard
// Citizen Dashboard
// Complaints + Live Water Sensors
// ======================================


// ======================================
// API CONFIGURATION
// ======================================

const API_URL =
    "http://localhost:5000/api/complaints";

const SENSOR_API_URL =
    "http://localhost:5000/api/sensors";


// ======================================
// CHECK LOGIN
// ======================================

const user = JSON.parse(
    localStorage.getItem("user")
);

const token =
    localStorage.getItem("token");

if (!user || !token) {

    alert("Please login first.");

    window.location.href = "login.html";

    throw new Error(
        "User is not authenticated"
    );
}


// ======================================
// USER ID
// ======================================

const userId = user.id;


// ======================================
// LOAD USER PROFILE
// ======================================

const userName =
    document.getElementById("userName");

const welcomeName =
    document.getElementById("welcomeName");

const userEmail =
    document.getElementById("userEmail");

const userIdElement =
    document.getElementById("userId");

const userRole =
    document.getElementById("userRole");


if (userName) {
    userName.textContent =
        user.name || "Citizen";
}

if (welcomeName) {
    welcomeName.textContent =
        user.name || "Citizen";
}

if (userEmail) {
    userEmail.textContent =
        user.email || "-";
}

if (userIdElement) {
    userIdElement.textContent =
        user.id || "-";
}

if (userRole) {
    userRole.textContent =
        (user.role || "Citizen").toUpperCase();
}


// ======================================
// LOAD MY COMPLAINTS
// ======================================

async function loadMyComplaints() {

    try {

        const response = await fetch(
            `${API_URL}/user/${userId}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        const data =
            await response.json();

        if (!data.success) {

            throw new Error(
                data.message ||
                "Failed to load complaints"
            );
        }

        const complaints =
            data.complaints || [];

        displayComplaints(
            complaints
        );

        updateStats(
            complaints
        );

    } catch (error) {

        console.error(
            "COMPLAINT LOAD ERROR:",
            error
        );

        const table =
            document.getElementById(
                "recentTable"
            );

        if (table) {

            table.innerHTML = `
                <tr>
                    <td colspan="6">
                        ❌ Unable to load complaints
                    </td>
                </tr>
            `;
        }
    }
}


// ======================================
// DISPLAY COMPLAINTS
// ======================================

function displayComplaints(
    complaints
) {

    const table =
        document.getElementById(
            "recentTable"
        );

    if (!table) {
        return;
    }

    table.innerHTML = "";


    if (complaints.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    📋 No complaints found
                </td>
            </tr>
        `;

        return;
    }


    complaints.forEach(
        (complaint) => {

            const row =
                document.createElement(
                    "tr"
                );

            row.innerHTML = `
                <td>
                    ${
                        complaint.id ||
                        complaint._id ||
                        "-"
                    }
                </td>

                <td>
                    ${
                        complaint.issue ||
                        "-"
                    }
                </td>

                <td>
                    ${
                        complaint.area ||
                        complaint.location ||
                        "-"
                    }
                </td>

                <td>
                    ${
                        complaint.status ||
                        "Pending"
                    }
                </td>

                <td>
                    ${
                        complaint.date
                            ? new Date(
                                complaint.date
                            ).toLocaleDateString()
                            : "-"
                    }
                </td>

                <td>
                    <button
                        onclick="downloadReceipt('${complaint._id}')">

                        🧾 Receipt

                    </button>
                </td>
            `;

            table.appendChild(row);
        }
    );
}


// ======================================
// UPDATE DASHBOARD STATS
// ======================================

function updateStats(
    complaints
) {

    const total =
        complaints.length;

    const pending =
        complaints.filter(
            (complaint) =>
                complaint.status ===
                "Pending"
        ).length;

    const resolved =
        complaints.filter(
            (complaint) =>
                complaint.status ===
                "Resolved"
        ).length;


    const totalElement =
        document.getElementById(
            "totalComplaint"
        );

    const pendingElement =
        document.getElementById(
            "pendingComplaint"
        );

    const resolvedElement =
        document.getElementById(
            "resolvedComplaint"
        );

    const waterSavedElement =
        document.getElementById(
            "waterSaved"
        );


    if (totalElement) {
        totalElement.textContent =
            total;
    }

    if (pendingElement) {
        pendingElement.textContent =
            pending;
    }

    if (resolvedElement) {
        resolvedElement.textContent =
            resolved;
    }

    if (waterSavedElement) {
        waterSavedElement.textContent =
            resolved;
    }
}


// ======================================
// DOWNLOAD RECEIPT
// ======================================

function downloadReceipt(
    id
) {

    window.open(
        `http://localhost:5000/api/receipt/${id}`,
        "_blank"
    );
}


// ======================================
// NOTIFICATIONS
// ======================================

function showNotifications() {

    const notificationCount =
        document.getElementById(
            "notificationCount"
        );

    if (notificationCount) {

        notificationCount.textContent =
            "0";
    }


    alert(
        `🔔 WaterGuardian-X Notifications

• Welcome ${user.name}

• Monitor your complaint status regularly.

• Resolved complaints can be downloaded as receipts.

• Check Live Water Monitoring for sensor information.

• Thank you for helping conserve water!`
    );
}


// ======================================
// SEARCH COMPLAINT
// ======================================

function searchComplaint(
    id
) {

    if (!id) {
        return null;
    }

    return fetch(
        `${API_URL}/${id}`
    )
    .then(
        (response) =>
            response.json()
    );
}


// ======================================
// LOAD WATER SENSORS
// ======================================

async function loadSensors() {

    const container =
        document.getElementById(
            "sensorContainer"
        );

    if (!container) {

        console.log(
            "ℹ️ sensorContainer not found"
        );

        return;
    }


    try {

        console.log(
            "💧 Loading sensors..."
        );


        const response =
            await fetch(
                SENSOR_API_URL
            );


        if (!response.ok) {

            throw new Error(
                `Sensor API error: ${response.status}`
            );
        }


        const data =
            await response.json();


        console.log(
            "📡 Sensor response:",
            data
        );


        if (!data.success) {

            throw new Error(
                data.message ||
                "Failed to load sensors"
            );
        }


        const sensors =
            data.sensors || [];


        if (sensors.length === 0) {

            container.innerHTML = `
                <div class="sensor-loading">

                    💧 No water sensors available.

                    <br><br>

                    Add a sensor through the
                    sensor API to display it here.

                </div>
            `;

            return;
        }


        container.innerHTML = "";


        sensors.forEach(
            (sensor) => {

                let statusClass =
                    "normal";


                if (
                    sensor.status ===
                    "Warning"
                ) {

                    statusClass =
                        "warning";
                }


                if (
                    sensor.status ===
                    "Critical"
                ) {

                    statusClass =
                        "critical";
                }


                if (
                    sensor.status ===
                    "Offline"
                ) {

                    statusClass =
                        "offline";
                }


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "sensor-card";


                card.innerHTML = `

                    <div class="sensor-card-header">

                        <div>

                            <h3>
                                💧
                                ${
                                    sensor.name ||
                                    "Water Sensor"
                                }
                            </h3>

                            <p>
                                ${
                                    sensor.sensorId ||
                                    "Unknown ID"
                                }
                            </p>

                        </div>


                        <span
                            class="sensor-status ${statusClass}">

                            ${
                                sensor.status ||
                                "Normal"
                            }

                        </span>

                    </div>


                    <div class="sensor-location">

                        📍
                        ${
                            sensor.location ||
                            "Location unavailable"
                        }

                    </div>


                    <div class="sensor-values">


                        <div class="sensor-value">

                            <span>
                                💧
                            </span>

                            <strong>
                                ${
                                    sensor.waterLevel ??
                                    0
                                }%
                            </strong>

                            <small>
                                Water Level
                            </small>

                        </div>


                        <div class="sensor-value">

                            <span>
                                🧪
                            </span>

                            <strong>
                                ${
                                    sensor.waterQuality ??
                                    0
                                }%
                            </strong>

                            <small>
                                Water Quality
                            </small>

                        </div>


                        <div class="sensor-value">

                            <span>
                                🌊
                            </span>

                            <strong>
                                ${
                                    sensor.flowRate ??
                                    0
                                }
                            </strong>

                            <small>
                                Flow Rate
                            </small>

                        </div>


                        <div class="sensor-value">

                            <span>
                                🌡️
                            </span>

                            <strong>
                                ${
                                    sensor.temperature ??
                                    0
                                }°C
                            </strong>

                            <small>
                                Temperature
                            </small>

                        </div>

                    </div>


                    <div class="sensor-updated">

                        Last updated:

                        ${
                            sensor.lastUpdated
                                ? new Date(
                                    sensor.lastUpdated
                                ).toLocaleString()
                                : "Unknown"
                        }

                    </div>

                `;


                container.appendChild(
                    card
                );
            }
        );


    } catch (error) {

        console.error(
            "❌ SENSOR LOAD ERROR:",
            error
        );


        container.innerHTML = `

            <div class="sensor-loading">

                ❌ Unable to load sensor data.

                <br><br>

                Please make sure the
                WaterGuardian-X backend
                is running.

            </div>

        `;
    }
}


// ======================================
// REFRESH DASHBOARD
// ======================================

function refreshDashboard() {

    loadMyComplaints();

    loadSensors();
}


// ======================================
// INITIALIZE DASHBOARD
// ======================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadMyComplaints();

        loadSensors();

    }
);


// ======================================
// AUTO REFRESH
// ======================================

setInterval(
    () => {

        refreshDashboard();

    },
    20000
);


// ======================================
// WINDOW FOCUS REFRESH
// ======================================

window.addEventListener(
    "focus",
    () => {

        refreshDashboard();

    }
);


// ======================================
// INTERNET CONNECTION
// ======================================

window.addEventListener(
    "online",
    () => {

        console.log(
            "✅ Internet Connected"
        );

        refreshDashboard();

    }
);


window.addEventListener(
    "offline",
    () => {

        console.log(
            "❌ Internet Disconnected"
        );

    }
);


// ======================================
// FINAL LOG
// ======================================

console.log(
    "✅ WaterGuardian-X Dashboard Loaded Successfully"
);

console.log(
    "💧 Live Sensor Monitoring Enabled"
);