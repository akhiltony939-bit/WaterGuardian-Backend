// ==========================================
// WaterGuardian-X
// Complaint Routes
// ==========================================
const sendEmail =
require("../utils/email");
console.log("🔥 complaint.js loaded");


const express = require("express");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const Complaint = require("../models/Complaint");


// ==========================================
// UPLOAD CONFIG
// ==========================================

const uploadPath =
path.join(__dirname, "../uploads");


if(!fs.existsSync(uploadPath)){

    fs.mkdirSync(uploadPath);

}


const storage = multer.diskStorage({

    destination:function(req,file,cb){

        cb(null,uploadPath);

    },


    filename:function(req,file,cb){

        cb(
            null,
            Date.now() +
            path.extname(file.originalname)
        );

    }

});


const upload =
multer({

    storage:storage

});




// ==========================================
// TEST ROUTE
// ==========================================

router.get("/test",(req,res)=>{

    res.json({

        success:true,

        message:"Complaint Route Working"

    });

});




// ==========================================
// CREATE COMPLAINT
// ==========================================

router.post(
"/create",
upload.single("image"),

async(req,res)=>{


try{


console.log("🔥 Complaint Create API Hit");

console.log(req.body);



let imageName = "";



if(req.file){

    imageName =
    req.file.filename;

}



const complaint =
new Complaint({


    userId:req.body.userId,


    name:req.body.name,


    issue:req.body.issue,



    location:{


        address:req.body.location || "",


        country:req.body.country || "",


        state:req.body.state || "",


        district:req.body.district || "",


        latitude:
        req.body.latitude
        ?
        Number(req.body.latitude)
        :
        null,


        longitude:
        req.body.longitude
        ?
        Number(req.body.longitude)
        :
        null


    },



    description:req.body.description,



    image:imageName,



    status:"Pending",



    timeline:[

        {

            status:"Pending",

            message:
            "Complaint Registered"

        }

    ]


});




await complaint.save();
await sendEmail(

    req.body.email,

    "WaterGuardian-X Complaint Registered",

    `
    <h2>WaterGuardian-X</h2>

    <p>Your complaint has been registered successfully.</p>

    <p>
    <b>Complaint ID:</b>
    ${complaint._id}
    </p>

    <p>
    <b>Issue:</b>
    ${complaint.issue}
    </p>

    <p>
    <b>Status:</b>
    Pending
    </p>

    `

);



res.status(201).json({

    success:true,

    message:
    "Complaint Submitted Successfully",

    complaint

});



}


catch(error){


console.log(error);


res.status(500).json({

    success:false,

    message:error.message

});


}


});




// ==========================================
// GET ALL COMPLAINTS (ADMIN)
// ==========================================

router.get("/",async(req,res)=>{


try{


const complaints =
await Complaint.find()
.sort({
createdAt:-1
});



res.json({

success:true,

complaints

});



}

catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


});




// ==========================================
// GET USER COMPLAINTS
// ==========================================

router.get(
"/user/:userId",
async(req,res)=>{


try{


const complaints =
await Complaint.find({

userId:req.params.userId

})
.sort({
createdAt:-1
});



res.json({

success:true,

complaints

});


}

catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


});




// ==========================================
// UPDATE STATUS (ADMIN)
// ==========================================

router.put(
"/status/:id",
async(req,res)=>{


try{


const {
status,
message
}=req.body;



const complaint =
await Complaint.findById(
req.params.id
);



if(!complaint){


return res.status(404).json({

success:false,

message:"Complaint not found"

});


}



complaint.status =
status;



complaint.timeline.push({

status:status,

message:
message ||
"Status Updated"

});



await complaint.save();



res.json({

success:true,

message:
"Status Updated",

complaint

});


}


catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


});




// ==========================================
// GET SINGLE COMPLAINT
// ==========================================

router.get(
"/:id",
async(req,res)=>{


try{


const complaint =
await Complaint.findById(
req.params.id
);



if(!complaint){

return res.status(404).json({

success:false,

message:"Complaint not found"

});

}



res.json({

success:true,

complaint

});


}


catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


});




module.exports = router;