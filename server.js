console.log("RUNNING:", __filename);
console.log("🔥 CURRENT SERVER.JS RUNNING");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

/* ===========================
   Middleware
=========================== */

app.use(cors());

app.use(express.json({
    limit: "10mb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "10mb"
}));

/* ===========================
   Static Upload Folder
=========================== */

app.use(
    "/uploads",
    express.static(path.join(__dirname, "uploads"))
);

/* ===========================
   MongoDB Connection
=========================== */

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected Successfully");
})
.catch((err) => {
    console.error("❌ MongoDB Connection Failed");
    console.error(err);
    process.exit(1);
});

/* ===========================
   Import Routes
=========================== */

const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaint");
const locationRoutes = require("./routes/location");
const adminRoutes = require("./routes/admin");
const receiptRoutes = require("./routes/receipt");

/* ===========================
   API Routes
=========================== */

app.use("/api/auth", authRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/location", locationRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/receipt", receiptRoutes);



/* ===========================
   Home Route
=========================== */

app.get("/", (req, res) => {

    res.status(200).json({

        success: true,

       message: "🔥 AKHIL TEST SERVER"

    });

});

/* ===========================
   404 Route
=========================== */

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message: "Route Not Found"

    });

});

/* ===========================
   Global Error Handler
=========================== */

app.use((err, req, res, next) => {

    console.error("🔥 Server Error:", err);

    res.status(err.status || 500).json({

        success: false,

        message: err.message || "Internal Server Error"

    });

});

/* ===========================
   Start Server
=========================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});