// ==========================================
// WaterGuardian-X
// Complaint Model
// ==========================================

const mongoose = require("mongoose");


const complaintSchema = new mongoose.Schema(

{

    complaintId: {
        type: String,
        unique: true,
        default: () =>
            "WGX-" + Date.now()
    },


    userId: {
        type: String,
        required: true
    },


    name: {
        type: String,
        required: true
    },


    issue: {
        type: String,
        required: true
    },


    // Location Details
    location: {

        address: {
            type: String,
            default: ""
        },

        country: {
            type: String,
            default: ""
        },

        state: {
            type: String,
            default: ""
        },

        district: {
            type: String,
            default: ""
        },

        latitude: {
            type: Number,
            default: null
        },

        longitude: {
            type: Number,
            default: null
        }

    },


    description: {

        type: String,

        required: true

    },


    image: {

        type: String,

        default: ""

    },


    status: {

        type: String,

        enum: [
            "Pending",
            "Processing",
            "Resolved"
        ],

        default: "Pending"

    },


    assignedOfficer: {

        type: String,

        default: ""

    },


    timeline: [

        {

            status: String,

            message: String,

            date: {

                type: Date,

                default: Date.now

            }

        }

    ],


    date: {

        type: Date,

        default: Date.now

    }


},

{

    timestamps: true

}


);



module.exports =
mongoose.model(
    "Complaint",
    complaintSchema
);