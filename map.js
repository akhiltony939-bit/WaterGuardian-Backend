/* =====================================
   WaterGuardian-X Smart Interactive Map
===================================== */

let map;
let markers = [];

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("map")) return;

    // Default Location (Chittoor)
    map = L.map("map").setView([13.6288, 79.4192], 13);

    // OpenStreetMap
    L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(map);

    loadComplaints();

    document
        .getElementById("locationBtn")
        ?.addEventListener("click", getLocation);

    document
        .getElementById("refreshBtn")
        ?.addEventListener("click", loadComplaints);

});

/* ================================
   Load Complaint Markers
================================ */

function loadComplaints() {

    // Remove old markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    const complaints =
        JSON.parse(localStorage.getItem("complaints")) || [];

    let pending = 0;
    let resolved = 0;

    complaints.forEach(item => {

        if (item.status === "Pending")
            pending++;

        if (item.status === "Resolved")
            resolved++;

        // Default coordinates
        let lat = 13.6288;
        let lng = 79.4192;

        // Read coordinates from saved complaint
        if (
            item.location &&
            item.location.includes("Latitude")
        ) {

            const match =
                item.location.match(
                    /Latitude:\s*([-\d.]+),\s*Longitude:\s*([-\d.]+)/
                );

            if (match) {

                lat = parseFloat(match[1]);
                lng = parseFloat(match[2]);

            }

        }

        // Marker Color
        let markerColor = "#ff3b30";

        if (item.status === "Resolved") {
            markerColor = "#28a745";
        }

        if (item.status === "In Progress") {
            markerColor = "#ffc107";
        }

        // Custom Marker
        const icon = L.divIcon({

            className: "",

            html: `
                <div style="
                    width:20px;
                    height:20px;
                    background:${markerColor};
                    border-radius:50%;
                    border:3px solid white;
                    box-shadow:0 0 10px rgba(0,0,0,0.4);
                "></div>
            `,

            iconSize: [20, 20]

        });

        const marker =
            L.marker([lat, lng], {
                icon: icon
            }).addTo(map);

        marker.bindPopup(`
            <div style="min-width:220px;">
                <h3 style="margin:0;color:#0077b6;">
                    💧 ${item.id}
                </h3>

                <hr>

                <p><b>👤 Name:</b> ${item.name}</p>

                <p><b>⚠ Issue:</b> ${item.issue}</p>

                <p><b>📅 Date:</b> ${item.date}</p>

                <p>
                    <b>Status:</b>
                    <span style="
                        color:${markerColor};
                        font-weight:bold;
                    ">
                        ${item.status}
                    </span>
                </p>
            </div>
        `);

        markers.push(marker);

    });

    // Statistics
    document.getElementById("mapTotal").textContent =
        complaints.length;

    document.getElementById("mapPending").textContent =
        pending;

    document.getElementById("mapResolved").textContent =
        resolved;

    // Zoom to all markers
    if (markers.length > 0) {

        const group =
            L.featureGroup(markers);

        map.fitBounds(group.getBounds(), {
            padding: [40, 40]
        });

    }

}

/* ================================
   User Current Location
================================ */

function getLocation() {

    if (!navigator.geolocation) {

        alert("GPS is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        (position) => {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;

            map.setView([lat, lng], 16);

            const myIcon = L.divIcon({

                className: "",

                html: `
                    <div style="
                        width:22px;
                        height:22px;
                        background:#0077ff;
                        border-radius:50%;
                        border:3px solid white;
                        box-shadow:0 0 12px rgba(0,0,0,0.5);
                    "></div>
                `,

                iconSize: [22, 22]

            });

            L.marker([lat, lng], {
                icon: myIcon
            })
                .addTo(map)
                .bindPopup("📍 You are here")
                .openPopup();

        },

        () => {

            alert("Location permission denied.");

        }

    );

}