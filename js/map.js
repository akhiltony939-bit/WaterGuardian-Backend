/* =====================================
   WaterGuardian-X Smart Interactive Map
===================================== */

let map;
let markers = [];

document.addEventListener("DOMContentLoaded", () => {

    if (!document.getElementById("map")) return;

    map = L.map("map").setView([13.6288, 79.4192], 13);

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

        let lat = 13.6288;
        let lng = 79.4192;

        if (item.location &&
            item.location.includes("Latitude")) {

            const match =
                item.location.match(
                    /Latitude:\s*([-\d.]+),\s*Longitude:\s*([-\d.]+)/
                );

            if (match) {

                lat = parseFloat(match[1]);
                lng = parseFloat(match[2]);

            }

        }

        const marker =
            L.marker([lat, lng]).addTo(map);

        marker.bindPopup(`
            <b>${item.id}</b><br>
            <b>Name:</b> ${item.name}<br>
            <b>Issue:</b> ${item.issue}<br>
            <b>Status:</b> ${item.status}<br>
            <b>Date:</b> ${item.date}
        `);

        markers.push(marker);

    });

    document.getElementById("mapTotal").textContent =
        complaints.length;

    document.getElementById("mapPending").textContent =
        pending;

    document.getElementById("mapResolved").textContent =
        resolved;

    if (markers.length > 0) {

        const group =
            L.featureGroup(markers);

        map.fitBounds(group.getBounds(), {
            padding: [30, 30]
        });

    }

}

/* ================================
   User Location
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

            L.marker([lat, lng])
                .addTo(map)
                .bindPopup("📍 You are here")
                .openPopup();

        },

        () => {

            alert("Location permission denied.");

        }

    );

}