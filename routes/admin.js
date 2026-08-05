// ==========================================
// WaterGuardian-X
// Admin Routes
// ==========================================

const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");

const Complaint = require("../models/Complaint");
const User = require("../models/User");


// ==========================================
// ADMIN DASHBOARD
// ==========================================

router.get("/dashboard", adminAuth, async (req, res) => {

    try {

        const totalComplaints =
            await Complaint.countDocuments();

        const pending =
            await Complaint.countDocuments({
                status: "Pending"
            });

        const inProgress =
            await Complaint.countDocuments({
                status: "In Progress"
            });

        const resolved =
            await Complaint.countDocuments({
                status: "Resolved"
            });

        const totalUsers =
            await User.countDocuments();

        res.json({

            success: true,

            stats: {

                totalComplaints,

                pending,

                inProgress,

                resolved,

                totalUsers

            }

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});



// ==========================================
// GET ALL COMPLAINTS
// ==========================================

router.get("/complaints", adminAuth, async (req, res) => {

    try {

        const complaints =
            await Complaint.find()
                .sort({ createdAt: -1 });

        res.json({

            success: true,

            complaints

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: "Unable to fetch complaints"

        });

    }

});




// ==========================================
// GET SINGLE COMPLAINT
// ==========================================

router.get("/complaints/:id", adminAuth, async (req, res) => {

    try {

        const complaint =
            await Complaint.findById(req.params.id);

        if (!complaint) {

            return res.status(404).json({

                success: false,

                message: "Complaint not found"

            });

        }

        res.json({

            success: true,

            complaint

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});




// ==========================================
// UPDATE STATUS
// ==========================================

router.put("/complaints/:id/status", adminAuth, async (req, res) => {

    try {

        const { status } = req.body;

        const complaint =
            await Complaint.findById(req.params.id);

        if (!complaint) {

            return res.status(404).json({

                success: false,

                message: "Complaint not found"

            });

        }

        complaint.status = status;

        complaint.timeline.push({

            status,

            date: new Date()

        });

        await complaint.save();

        res.json({

            success: true,

            message: "Complaint updated",

            complaint

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: "Update failed"

        });

    }

});




// ==========================================
// DELETE COMPLAINT
// ==========================================

router.delete("/complaints/:id", adminAuth, async (req, res) => {

    try {

        const complaint =
            await Complaint.findById(req.params.id);

        if (!complaint) {

            return res.status(404).json({

                success: false,

                message: "Complaint not found"

            });

        }

        await Complaint.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Complaint deleted"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: "Delete failed"

        });

    }

});




// ==========================================
// GET ALL USERS
// ==========================================

router.get("/users", adminAuth, async (req, res) => {

    try {

        const users =
            await User.find()
                .select("-password")
                .sort({ createdAt: -1 });

        res.json({

            success: true,

            users

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: "Unable to fetch users"

        });

    }

});




// ==========================================
// DELETE USER
// ==========================================

router.delete("/users/:id", adminAuth, async (req, res) => {

    try {

        const user =
            await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        await User.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "User deleted"

        });

    }

    catch (err) {

        res.status(500).json({

            success: false,

            message: "Delete failed"

        });

    }

});



module.exports = router;