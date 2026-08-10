/* =====================================
   WaterGuardian-X Professional Receipt
===================================== */

let complaint = null;

document.addEventListener("DOMContentLoaded", () => {

    complaint =
        JSON.parse(localStorage.getItem("latestComplaint"));

    if (!complaint) {

        alert("No complaint found.");

        window.location.href = "dashboard.html";

        return;

    }

    document.getElementById("complaintId").textContent =
        complaint.id;

    document.getElementById("citizenName").textContent =
        complaint.name;

    document.getElementById("category").textContent =
        complaint.issue;

    document.getElementById("location").textContent =
        complaint.location;

    document.getElementById("description").textContent =
        complaint.description;

    document.getElementById("date").textContent =
        complaint.date;

    document.getElementById("status").textContent =
        complaint.status;

});

/* =====================================
   Print
===================================== */

function printReceipt() {

    window.print();

}

/* =====================================
   Download PDF
===================================== */

async function downloadPDF() {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("WaterGuardian-X", 20, 20);

    pdf.setFontSize(14);
    pdf.text("Government Smart Water Management Portal", 20, 30);

    pdf.line(20, 36, 190, 36);

    pdf.setFontSize(16);
    pdf.text("Complaint Receipt", 20, 48);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    let y = 65;

    pdf.text(`Complaint ID : ${complaint.id}`, 20, y);
    y += 10;

    pdf.text(`Citizen Name : ${complaint.name}`, 20, y);
    y += 10;

    pdf.text(`Category : ${complaint.issue}`, 20, y);
    y += 10;

    pdf.text(`Location : ${complaint.location}`, 20, y);
    y += 10;

    pdf.text(`Description : ${complaint.description}`, 20, y);
    y += 10;

    pdf.text(`Date : ${complaint.date}`, 20, y);
    y += 10;

    pdf.text(`Status : ${complaint.status}`, 20, y);
    y += 20;

    pdf.setFont("helvetica", "italic");

    pdf.text(
        "Thank you for reporting the issue.",
        20,
        y
    );

    pdf.save(`Complaint_${complaint.id}.pdf`);

}