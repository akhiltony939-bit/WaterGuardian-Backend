// ==========================================
// WaterGuardian-X
// Authentication Routes
// ==========================================
console.log("🔥 AUTH.JS LOADED");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Auth Route Working"
    });
});
const User = require("../models/User");

const JWT_SECRET =
process.env.JWT_SECRET || "waterguardianx_secret";


// ==========================================
// REGISTER
// ==========================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({

                success: false,

                message: "All fields are required"

            });

        }

        const existingUser =
            await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({

                success: false,

                message: "Email already exists"

            });

        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            new User({

                name,

                email,

                password: hashedPassword,

                role: "user"

            });

        await user.save();

        res.status(201).json({

            success: true,

            message: "Registration Successful"

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
// USER LOGIN
// ==========================================

router.post("/login", async (req, res) => {

    try {

        const {

            email,

            password

        } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and Password are required"

            });

        }

        const user =
            await User.findOne({ email });

        if (!user) {

            return res.status(400).json({

                success: false,

                message: "User not found"

            });

        }

        const valid =
            await bcrypt.compare(

                password,

                user.password

            );

        if (!valid) {

            return res.status(400).json({

                success: false,

                message: "Invalid Password"

            });

        }

        const token =
            jwt.sign(

                {

                    id: user._id,

                    email: user.email,

                    role: user.role

                },

                JWT_SECRET,

                {

                    expiresIn: "7d"

                }

            );

        res.json({

            success: true,

            message: "Login Successful",

            token,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role

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
// ADMIN LOGIN
// ==========================================

router.post("/admin-login", async (req, res) => {

    try {

        const {

            email,

            password

        } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and Password are required"

            });

        }

        const admin =
            await User.findOne({

                email,

                role: "admin"

            });

        if (!admin) {

            return res.status(401).json({

                success: false,

                message: "Admin not found"

            });

        }

        const valid =
            await bcrypt.compare(

                password,

                admin.password

            );

        if (!valid) {

            return res.status(401).json({

                success: false,

                message: "Invalid Password"

            });

        }

        const token =
            jwt.sign(

                {

                    id: admin._id,

                    email: admin.email,

                    role: "admin"

                },

                JWT_SECRET,

                {

                    expiresIn: "7d"

                }

            );

        res.json({

            success: true,

            message: "Admin Login Successful",

            token,

            admin: {

                id: admin._id,

                name: admin.name,

                email: admin.email,

                role: admin.role

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
// GET PROFILE
// ==========================================

router.get("/profile", async (req, res) => {

    try {

        const authHeader =
            req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Token Missing"

            });

        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            jwt.verify(

                token,

                JWT_SECRET

            );

        const user =
            await User.findById(decoded.id)
                .select("-password");

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"

            });

        }

        res.json({

            success: true,

            user

        });

    }

    catch (err) {

        res.status(401).json({

            success: false,

            message: "Invalid Token"

        });

    }

});

// ==========================================
// CREATE DEFAULT ADMIN (Runs Once)
// ==========================================

(async () => {
    try {
        const adminExists = await User.findOne({
            email: "admin@gmail.com"
        });

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash("admin123", 10);

            await User.create({
                name: "Administrator",
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "admin"
            });

            console.log("✅ Default Admin Created");
        } else {
            console.log("✅ Admin Already Exists");
        }
    } catch (err) {
        console.log("Admin creation error:", err);
    }
})();

module.exports = router;