// ==========================================
// WaterGuardian-X
// PDF Receipt Route
// ==========================================

const express = require("express");
const router = express.Router();

const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const Complaint = require("../models/Complaint");


// ==========================================
// TEST ROUTE
// ==========================================

router.get("/test", (req, res) => {

    res.json({

        success: true,

        message: "Receipt Route Working"

    });

});




// ==========================================
// DOWNLOAD PDF RECEIPT
// ==========================================

router.get("/:id", async (req, res) => {


    try {


        const complaint =
        await Complaint.findById(
            req.params.id
        );


        if (!complaint) {


            return res.status(404).json({

                success:false,

                message:"Complaint not found"

            });


        }



        const qrText = `

WaterGuardian-X

Complaint ID:
${complaint._id}

Name:
${complaint.name}

Issue:
${complaint.issue}

Status:
${complaint.status}

`;



        const qrCode =
        await QRCode.toDataURL(qrText);



        res.setHeader(
            "Content-Type",
            "application/pdf"
        );


        res.setHeader(
            "Content-Disposition",
            `attachment; filename=WaterGuardian_${complaint._id}.pdf`
        );



        const doc =
        new PDFDocument();



        doc.pipe(res);



        // HEADER

        doc
        .fontSize(24)
        .text(
            "WaterGuardian-X",
            {
                align:"center"
            }
        );


        doc.moveDown();



        doc
        .fontSize(14)
        .text(
            "Government Smart Water Complaint Management System",
            {
                align:"center"
            }
        );


        doc.moveDown(2);



        // DETAILS


        doc.fontSize(12);


        doc.text(
            "Complaint ID : "
            +
            complaint._id
        );


        doc.text(
            "Citizen Name : "
            +
            complaint.name
        );


        doc.text(
            "Issue : "
            +
            complaint.issue
        );


        doc.text(
            "Location : "
            +
            (
                complaint.location?.address
                ||
                "Not Available"
            )
        );


        doc.text(
            "District : "
            +
            (
                complaint.location?.district
                ||
                "Not Available"
            )
        );


        doc.text(
            "Status : "
            +
            complaint.status
        );


        doc.text(
            "Date : "
            +
            complaint.createdAt
        );



        doc.moveDown(2);



        // QR CODE


        const qrBuffer =
        Buffer.from(
            qrCode.split(",")[1],
            "base64"
        );


        doc.text(
            "Scan QR Code For Verification"
        );


        doc.image(
            qrBuffer,
            {
                width:120
            }
        );



        doc.moveDown();



        doc.text(
            "Thank you for using WaterGuardian-X"
        );



        doc.end();



    }

    catch(error){


        console.log(error);


        res.status(500).json({

            success:false,

            message:error.message

        });


    }


});



module.exports = router;