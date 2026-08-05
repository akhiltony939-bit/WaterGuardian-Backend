const express = require("express");
const router =express.Router();

const Report = require("../models/Report");

// =========================
// Track Complaint
// GET /reports/:id
// =========================

router.get("/:id", async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Complaint not found"
            });
        }

        res.json({
            success: true,
            report
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Invalid Complaint ID"
        });
    }
});

module.exports = router;